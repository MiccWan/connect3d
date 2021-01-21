import { ServerEvents } from 'knect-common/src/SocketEvents.js';
import ForbiddenError from 'knect-common/src/ForbiddenError.js';
import Lobby from './Lobby.js';
import PlayerList from './PlayerList.js';
import RoomList from './RoomList.js';
import Player from './Player.js';

/** @typedef {import('socket.io').Server} SocketIO */
/** @typedef {import('./Room').default} Room */

export class GameCenter {
  /**
   * @type {SocketIO} io
   */
  constructor(io) {
    this.lobby = new Lobby(this);
    this.rooms = new RoomList(this);
    this.allPlayers = new PlayerList(this);
    this.io = io;

    this.init();
  }

  init() {
    this.io.on('connection', (_socket) => {
      const player = new Player(this, _socket);
      this.allPlayers.add(player);

      this.lobby.join(player.id);

      _socket.on('disconnect', () => {
        this.disconnect(player);
      });
    });

    // TODO: listen on disconnect
    // TODO: remove on allPlayers, room.allPlayers, room.players
  }

  /**
   * @return {Room}
   */
  getRoomById(roomId, { throwOnError = false } = {}) {
    const room = roomId === this.lobby.id ? this.lobby : this.rooms.getById(roomId);
    if (room === undefined && throwOnError) {
      throw new ForbiddenError(`Room ${roomId} doesn't exist`);
    }
    return room;
  }

  /**
   * @return {Player}
   */
  getPlayerById(playerId, { throwOnError = false } = {}) {
    const player = this.allPlayers.getById(playerId);
    if (!player && throwOnError) {
      throw new ForbiddenError(`Player ${playerId} doesn't exist`);
    }
    return player;
  }

  /**
   * @param {string} name
   * @return {Room}
   */
  createRoom(name) {
    const room = this.rooms.create(name);
    this.lobby.emitAll(ServerEvents.UpdateRoomList, this.rooms.serialize());
    return room;
  }

  /**
   * @param {tring} playerId
   * @param {tring} newRoomId
   */
  switchPlayerRoom(playerId, newRoomId) {
    const player = this.getPlayerById(playerId);
    const oldRoom = this.getRoomById(player.roomId);
    const newRoom = this.getRoomById(newRoomId);
    oldRoom.remove(player.id);
    newRoom.join(player.id);
  }

  /**
   * @param {Player} player
   */
  disconnect(player) {
    const room = this.getRoomById(player.roomId);
    room.remove(player.id);
    this.allPlayers.remove(player.id);
  }
}

export default function initGameCenter(io) {
  const gc = new GameCenter(io);
  return gc;
}

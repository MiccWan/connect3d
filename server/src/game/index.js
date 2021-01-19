import { ServerEvents } from 'knect-common/src/SocketEvents.js';
import UpdateType from 'knect-common/src/UpdateType.js';
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
      throw new Error(`Room ${roomId} doesn't exist`);
    }
    return room;
  }

  /**
   * @return {Player}
   */
  getPlayerById(playerId, { throwOnError = false } = {}) {
    const player = this.allPlayers.getById(playerId);
    if (!player && throwOnError) {
      throw new Error(`Player ${playerId} doesn't exist`);
    }
    return player;
  }

  /**
   * @param {string} name
   * @return {Room}
   */
  createRoom(name) {
    const room = this.rooms.create(name);
    const { id } = room;
    this.lobby.emitAll(ServerEvents.UpdateRoomList, { type: UpdateType.New, room: room.serialize() });
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

    console.log('new room', newRoomId, newRoom);

    console.log('old room', oldRoom.allPlayers, oldRoom.players);
    if (oldRoom.isEmpty() && oldRoom !== this.lobby) {
      this.rooms.remove(oldRoom.id);
      console.log('lobby member', this.lobby.allPlayers);
      this.lobby.emitAll(ServerEvents.UpdateRoomList, { type: UpdateType.Remove, room: { id: oldRoom.id, name: oldRoom.name } });
    }
  }

  /**
   * @param {Player} player
   */
  disconnect(player) {
    const room = this.getRoomById(player.roomId);
    room.remove(player.id);
  }
}

export default function initGameCenter(io) {
  const gc = new GameCenter(io);
  return gc;
}

import Lobby from './Lobby.js';
import PlayerList from './PlayerList.js';
import RoomList from './RoomList.js';
import Player from './Player.js';
import Room from './Room.js';
import { ServerEvents } from 'knect-common/src/SocketEvents';
import UpdateType from 'knect-common/src/UpdateType';

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

      const { id, name } = player;
      this.lobby.emitAll(ServerEvents.UpdatePlayerList, { type: UpdateType.New, id, name });

      this.lobby.join(id);
      player.joinRoom(this.lobby.id);

      this.allPlayers.add(player);
    });
  }

  /**
   * @return {Room}
   */
  getRoomById(roomId, { throwOnError = false }) {
    const room = this.rooms.getById(roomId);
    if (room === undefined && throwOnError) {
      throw new Error(`Room ${roomId} doesn't exist`);
    }
    return room;
  }

  /**
   * @return {Player}
   */
  getPlayerById(playerId, { throwOnError = false }) {
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
    const room = this.rooms.create();
    const { id } = room;
    this.lobby.emitAll(ServerEvents.UpdateRoomList, { type: UpdateType.New, id, name });
    return room;
  }
}

export default function initGameCenter(io) {
  const gc = new GameCenter(io);
  return gc;
}

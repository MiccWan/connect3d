import Lobby from './Lobby.js';
import PlayerList from './PlayerList.js';
import RoomList from './RoomList.js';
import Player from './Player.js';

/** @typedef {import('socket.io').Server} SocketIO */

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
    });
  }

  getRoomById(roomId, { throwOnError = false }) {
    const room = this.rooms.getById(roomId);
    if (room === undefined && throwOnError) {
      throw new Error(`Room ${roomId} doesn't exist`);
    }
    return room;
  }
}

export default function initGameCenter(io) {
  const gc = new GameCenter(io);
  return gc;
}

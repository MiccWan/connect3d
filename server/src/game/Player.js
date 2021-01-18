import { ServerEvents } from 'knect-common/src/SocketEvents.js';
import PlayerStatusType from './constant/PlayerStatusType.js';
import ServerSocketWrapper from './ServerSocketWrapper.js';
import getUniqueName from './util/generateName.js';
import { lobbyId } from './Lobby.js';

/** @typedef {import('socket.io').Socket} Socket */
/** @typedef {import('./index.js').GameCenter} GameCenter */

export default class Player {
  /**
   * @param {GameCenter} gc
   * @param {Socket} _socket
   */
  constructor(gc, _socket) {
    this.gc = gc;
    this.name = getUniqueName();
    this.roomId = null;
    this.socket = new ServerSocketWrapper(gc, this, _socket);
    this.socket.emit(ServerEvents.SetPlayerName, this.name);

    this.status = PlayerStatusType.Lobby;
    gc.lobby.join(this.id);
  }

  get id() {
    return this.socket.id;
  }

  sendChat(msg) {
    const { name } = this;
    const time = Date.now();
    if (PlayerStatusType.is.Lobby(this.status)) {
      this.gc.lobby.emitAll(ServerEvents.NotifyChat, { name, msg, time });
    }
    else if (PlayerStatusType.is.Room(this.status)) {
      const room = this.gc.rooms.getById(this.roomId);
      room.emitAll(ServerEvents.NotifyChat, { name, msg, time });
    }
    else {
      throw new Error(`Player '${name}' trying to send chat is neither in lobby nor any room`);
    }
  }

  /**
   * @param {string} roomId
   */
  joinRoom(roomId) {
    // this.gc.getRoomById(roomId, { throwOnError: true });
    this.roomId = roomId;
  }

  /**
   * Return whether a player is in a room
   * @param {{ throwOnFalse: boolean }} config
   * @return {boolean} whether the player is in any room
   */
  isInRoom({ throwOnTrue = false, throwOnFalse = false }) {
    const result = this.roomId && this.roomId !== lobbyId;
    if (result && throwOnTrue) {
      throw new Error(`Player is already in room ${this.roomId}`);
    }
    if (!result && throwOnFalse) {
      throw new Error('Player is not in any room');
    }
    return result;
  }

  notifyInvitation(playerId, roomId) {
    this.socket.emit(ServerEvents.NotifyInvitation, { playerId, roomId });
  }
}

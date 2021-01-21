import { ServerEvents } from 'knect-common/src/SocketEvents.js';
import ForbiddenError from 'knect-common/src/ForbiddenError.js';
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
    this.name = null;
    this.roomId = null;
    this.socket = new ServerSocketWrapper(gc, this, _socket);
    // this.socket.emit(ServerEvents.SetPlayerName, this.name);

    this.status = PlayerStatusType.Lobby;
  }

  get id() {
    return this.socket.id;
  }

  init() {
    this.gc.lobby.join(this.id);
  }

  login(name) {
    if (!name) throw new TypeError(`Cannot login with falsy name ${name}`);
    this.name = name;
    this.gc.lobby.join(this.id);
  }

  sendChat(msg) {
    const { name } = this;
    const time = Date.now();
    const room = this.gc.getRoomById(this.roomId);
    room.emitAll(ServerEvents.NotifyChat, { name, msg, time });
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
   * @param {{ throwOnTrue: boolean, throwOnFalse: boolean }} config
   * @return {boolean} whether the player is in any room
   */
  isInRoom({ throwOnTrue = false, throwOnFalse = false } = {}) {
    const result = this.roomId && this.roomId !== lobbyId;
    if (result && throwOnTrue) {
      throw new ForbiddenError(`Player is already in room ${this.roomId}`);
    }
    if (!result && throwOnFalse) {
      throw new ForbiddenError('Player is not in any room');
    }
    return result;
  }

  notifyInvitation(playerId, roomId) {
    this.socket.emit(ServerEvents.NotifyInvitation, { playerId, roomId });
  }

  serialize() {
    const { id, name, roomId } = this;
    return { id, name, roomId };
  }
}

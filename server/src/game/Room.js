import { ServerEvents } from 'knect-common/src/SocketEvents.js';
import { v4 as uuidv4 } from 'uuid';

/** @typedef {import('./index.js').GameCenter} GameCenter */

export default class Room {
  /**
   * @param {GameCenter} gc 
   * @param {String} name 
   */
  constructor(gc, name) {
    this.gc = gc;
    this.name = name;
    this.id = uuidv4();

    /**
     * @type {Set<string>}
     */
    this.players = new Set();
  }

  get isEmpty() {
    return !!this.players.size;
  }

  emitAll(event, arg) {
    this.players.forEach(playerId => {
      const player = this.gc.allPlayers.getById(playerId);
      player.socket.emit(event, arg);
    });
  }

  /**
   * Join a player to this room
   * @param {String} id
   */
  join(id) {
    if (this.players.has(id)) {
      throw new Error(`Player ${id} already in this room`);
    }
    this.players.add(id);
    this.emitAll(ServerEvents.NotifyPlayerJoinRoom, { id });
  }

  remove(id) {
    if (this.players.has(id)) this.players.delete(id);
    else throw new Error(`Trying to remove non-existing player from room#${this.id}`);
  }

  /**
   * Join a player to the game
   * @param {String} id
   */
  joinGame(id) {
    if (!this.players.has(id)) {
      throw new Error(`This player is not in this room`);
    }
    // TODO: check if game joinable
    // TODO: join game
  }
}

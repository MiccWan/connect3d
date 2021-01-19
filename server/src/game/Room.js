import { v4 as uuidv4 } from 'uuid';

/** @typedef {import('./index.js').GameCenter} GameCenter */

export default class Room {
  /**
   * @param {GameCenter} gc
   * @param {string} name
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

  join(id) {
    this.players.add(id);
  }

  remove(id) {
    if (this.players.has(id)) this.players.delete(id);
    else throw new Error(`Trying to remove non-existing player from room#${this.id}`);
  }
}

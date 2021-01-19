import { v4 as uuidv4 } from 'uuid';

import { ServerEvents } from 'knect-common/src/SocketEvents.js';
import UpdateType from 'knect-common/src/UpdateType.js';

/** @typedef {import('./index.js').GameCenter} GameCenter */

export default class Room {
  /**
   * @param {GameCenter} gc
   * @param {string} name
   */
  constructor(gc, name, id = uuidv4()) {
    this.gc = gc;
    this.name = name;
    this.id = id;

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
   * @param {string} id
   */
  join(id) {
    if (this.players.has(id)) {
      throw new Error(`Player ${id} already in this room`);
    }
    const player = this.gc.getPlayerById(id);
    const { name } = player;
    this.players.add(id);
    this.emitAll(ServerEvents.UpdatePlayerList, { type: UpdateType.New, id, name });
    player.joinRoom(this.id);
  }

  remove(id) {
    if (this.players.has(id)) {
      const player = this.gc.getPlayerById(id);
      const { name } = player;
      this.emitAll(ServerEvents.UpdatePlayerList, { type: UpdateType.Remove, id, name });
      this.players.delete(id);
    }
    else throw new Error(`Trying to remove non-existing player from room#${this.id}`);
  }

  /**
   * Join a player to the game
   * @param {string} id
   */
  joinGame(id) {
    if (!this.players.has(id)) {
      throw new Error(`This player is not in this room`);
    }
    // TODO: check if game joinable
    // TODO: join game
  }
}

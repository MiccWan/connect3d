import { v4 as uuidv4 } from 'uuid';

import { ServerEvents } from 'knect-common/src/SocketEvents.js';
import UpdateType from 'knect-common/src/UpdateType.js';
import PlayerSideType from 'knect-common/src/PlayerSideType.js';

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
    this.allPlayers = new Set();

    /**
     * @type {Map<PlayerSideType, string>}
     */
    this.players = new Map();
  }

  get isEmpty() {
    return !!this.allPlayers.size;
  }

  emitAll(event, arg) {
    this.allPlayers.forEach(playerId => {
      const player = this.gc.allPlayers.getById(playerId);
      player.socket.emit(event, arg);
    });
  }

  /**
   * Join a player to this room
   * @param {string} id
   */
  join(id) {
    if (this.allPlayers.has(id)) {
      throw new Error(`Player ${id} already in this room`);
    }
    const player = this.gc.getPlayerById(id);
    const { name } = player;
    this.allPlayers.add(id);
    this.emitAll(ServerEvents.UpdatePlayerList, { type: UpdateType.New, id, name });
    player.joinRoom(this.id);
  }

  remove(id) {
    if (this.allPlayers.has(id)) {
      const player = this.gc.getPlayerById(id);
      const { name } = player;
      this.emitAll(ServerEvents.UpdatePlayerList, { type: UpdateType.Remove, id, name });
      this.allPlayers.delete(id);

      // TODO: if player in game
    }
    else throw new Error(`Trying to remove non-existing player from room#${this.id}`);
  }

  /**
   * Join a player to the game
   * @param {string} id
   * @param {PlayerSideType} side
   */
  joinGame(id, side) {
    if (!this.allPlayers.has(id)) {
      throw new Error(`This player is not in this room`);
    }

    if (this.players.has(side)) {
      throw new Error(`This side is not joinable`);
    }

    this.players.set(side, id);
    this.emitAll(ServerEvents.NotifyPlayerSide, { id, side });

    if (this.players.size === PlayerSideType.size) {
      // TODO: request confirm
    }
  }
}

import { v4 as uuidv4 } from 'uuid';

import { ServerEvents, ServerRequests } from 'knect-common/src/SocketEvents.js';
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

  isEmpty() {
    return !this.allPlayers.size;
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
      if (this.getPlayerSide(id) !== null) {
        this.removeFromGame(id);
      }

      this.allPlayers.delete(id);

      const player = this.gc.getPlayerById(id);
      const { name } = player;
      this.emitAll(ServerEvents.UpdatePlayerList, { type: UpdateType.Remove, id, name });
    }
    else throw new Error(`Trying to remove non-existing player from room#${this.id}`);
  }

  removeFromGame(id) {
    if (!this.allPlayers.has(id)) {
      throw new Error(`Player ${id} is not in this room`);
    }

    const side = this.getPlayerSide(id);
    if (side === null) {
      throw new Error(`Player ${id} is not in game`);
    }

    const payload = { type: UpdateType.Remove, roomId: this.id, id, side };
    this.emitAll(ServerEvents.NotifyPlayerSide, payload);
    this.gc.lobby.emitAll(ServerEvents.NotifyPlayerSide, payload);

    this.players.delete(side);
  }

  /**
   * @param {string} id player id
   */
  getPlayerSide(id) {
    const playersList = Array.from(this.players);
    const playersIdList = playersList.map(([_, playerId]) => playerId);
    const position = playersIdList.indexOf(id);

    if (position === -1) {
      return null;
    }

    return playersList[position][0];
  }

  serialize() {
    const { id, name, allPlayers, players } = this;
    return {
      id,
      name,
      allPlayers: Array.from(allPlayers).map(playerId => {
        const { name: playerName } = this.gc.getPlayerById(playerId);
        return { id: playerId, name: playerName };
      }),
      players: Object.fromEntries(Array.from(players).map(([side, playerId]) => {
        const { name: playerName } = this.gc.getPlayerById(playerId);
        return [side, { id: playerId, name: playerName }];
      })),
    };
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

    const payload = { type: UpdateType.New, roomId: this.id, id, side };
    this.emitAll(ServerEvents.NotifyPlayerSide, payload);
    this.gc.lobby.emitAll(ServerEvents.NotifyPlayerSide, payload);

    if (this.players.size === PlayerSideType.size) {
      Promise.all(Array.from(this.players.values()).map(playerId => this.gc.getPlayerById(playerId)).map(player => player.socket.request(ServerRequests.ConfirmStart))).then(() => {/* game start */}).catch(e => {})
    }
  }
}

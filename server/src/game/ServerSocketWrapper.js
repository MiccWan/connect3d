import SocketWrapper from 'knect-common/src/SocketWrapper.js';
import { ClientRequests, ClientEvents } from 'knect-common/src/SocketEvents.js';
import * as Bingo from 'knect-common/src/BingoEvents.js';

/** @typedef {import('socket.io').Socket} Socket */
/** @typedef {import('./index.js').GameCenter} GameCenter */
/** @typedef {import('./Player.js').default} Player */

export default class ServerSocketWrapper extends SocketWrapper {
  /**
   * @param {GameCenter} gc
   * @param {Player} player
   * @param {Socket} _socket
   */
  constructor(gc, player, _socket) {
    super(_socket);

    /**
     * Add handlers here to response to client requests.
     */
    const requestsHandler = {
      [ClientRequests.GetPlayerName]() {
        return player.name;
      },
      [ClientRequests.GetPlayerList]() {
        return gc.allPlayers.getAll;
      },
      ...Object.fromEntries(Object.values(Bingo.ClientRequests).map(evt => [evt, (...args) => {
        const room = gc.rooms.getById(player.roomId);
        return room.game.requestHandlers[evt](player.id, ...args);
      }]))
    };

    const eventsHandler = {
      [ClientEvents.SendChat]({ msg }) {
        player.sendChat(msg);
      },
      ...Object.fromEntries(Object.values(Bingo.ClientEvents).map(evt => [evt, (...args) => {
        const room = gc.rooms.getById(player.roomId);
        room.game.eventHandlers[evt](player.id, ...args);
      }]))
    };

    this.init(requestsHandler, eventsHandler);
  }
}

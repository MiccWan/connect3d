import SocketWrapper from 'knect-common/src/SocketWrapper.js';
import { ClientRequests, ClientEvents } from 'knect-common/src/SocketEvents.js';

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
    super(gc, player, _socket);

    /**
     * Add handlers here to response to client requests.
     */
    const requestsHandler = {
      [ClientRequests.GetPlayerList]() {
        return gc.playerList.getAll();
      }
    };

    const eventsHandler = {
      [ClientEvents.SendChat]({ msg }) {
        player.sendChat(msg);
      }
    };

    this.init(requestsHandler, eventsHandler);
  }
}

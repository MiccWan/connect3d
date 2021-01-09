import io from 'socket.io-client';
import { ServerEvents } from 'knect-common/src/SocketEvents';
import SocketWrapper from 'knect-common/src/SocketWrapper';

export default class ClientSocketWrapper extends SocketWrapper {
  constructor({ setChatContent, setPlayerList }) {
    super(io());

    const requestsHandler = {

    };

    const eventsHandler = {
      [ServerEvents.SendChat](msg) {
        setChatContent((message) => [...message, msg]);
      },

      [ServerEvents.UpdatePlayerList]({ newList }) {
        setPlayerList((list) => [...list, newList]);
      }
    };

    this.init(requestsHandler, eventsHandler);
  }
}

/**
 * Examples
 */

// const socket = new ClientSocketWrapper();

// // Event
// function sendMessage(msg = 'test') {
//   socket.emit(ClientEvents.SendChat, { msg });
// }

// // Request
// async function test() {
//   await socket.request(ClientRequests.GetPlayerList); // Array<Object>
// }

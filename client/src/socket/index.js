import io from 'socket.io-client';
import { ServerEvents } from 'knect-common/src/SocketEvents';
import SocketWrapper from 'knect-common/src/SocketWrapper';

export default class ClientSocketWrapper extends SocketWrapper {
  constructor({ setChatContent, setPlayerList, setRoomList }) {
    super(io());

    const requestsHandler = {

    };

    const eventsHandler = {

      [ServerEvents.UpdateRoomList]({ type, id, name }) {
        if (type === 1) { // new room
          setRoomList((list) => [...list, { id, name }]);
        }
        if (type === 2) { // remove room
          setRoomList((list) => list.filter(x => x.id !== id));
        }
      },

      [ServerEvents.UpdatePlayerList]({ type, id, name }) {
        if (type === 1) {
          setPlayerList((list) => [...list, { id, name }]);
        }
        // remove room
        if (type === 2) {
          setPlayerList((list) => list.filter(x => x.id !== id));
        }
      },

      [ServerEvents.NotifyChat](newMessage) {
        setChatContent((message) => [...message, newMessage]);
      },

      // [ServerEvents.NotifyInvitation]({ playerId, roomId }){

      // },

      [ServerEvents.NotifyChat](newMessage) {
        setChatContent((message) => [...message, newMessage]);
      },

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

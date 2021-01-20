import io from 'socket.io-client';
import { ServerEvents } from 'knect-common/src/SocketEvents.js';
import SocketWrapper from 'knect-common/src/SocketWrapper.js';

export default class ClientSocketWrapper extends SocketWrapper {
  constructor({ setChatContent, setPlayerList, setRoomList, setGamers }) {
    super(io());

    const requestsHandler = {

    };

    const eventsHandler = {
      [ServerEvents.UpdateRoomList](rooms) {
        setRoomList(rooms);
      },

      [ServerEvents.UpdatePlayerList](players) {
        setPlayerList(players);
      },

      [ServerEvents.NotifyChat](newMessage) {
        setChatContent((message) => [...message, newMessage]);
      },

      // [ServerEvents.NotifyInvitation]({ playerId, roomId }){

      // },

      [ServerEvents.NotifyPlayerJoinGame](gamers) {
        setGamers(gamers);
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

import io from 'socket.io-client';
import { ServerEvents } from 'knect-common/src/SocketEvents.js';
import * as BingoEvents from 'knect-common/src/BingoEvents.js';
import SocketWrapper from 'knect-common/src/SocketWrapper.js';
import showToast from '../helper/Toast.js';

export default class ClientSocketWrapper extends SocketWrapper {
  constructor({ setChatContent, setPlayerList, setRoomList, setGamers, setGameState }) {
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

      [ServerEvents.Announcement]({ msg }) {
        showToast(msg);
      },

      // [ServerEvents.NotifyInvitation]({ playerId, roomId }){

      // },

      [ServerEvents.NotifyPlayerJoinGame](gamers) {
        setGamers(gamers);
      },

      [ServerEvents.NotifyGamer](role) {
        setGameState((state) => ({ ...state, role }));
      },

      [ServerEvents.NotifyGameStart](newState) {
        showToast('Game Start!');
        setGameState((state) => ({ ...state, ...newState }));
      },

      [BingoEvents.ServerEvents.NotifyPlaced](newState) {
        setGameState((state) => ({ ...state, ...newState }));
      },

      [ServerEvents.NotifyGameEnd](newState) {
        showToast('Game Over!');
        setGameState((state) => ({ ...state, ...newState }));
      }
    };

    this.init(requestsHandler, eventsHandler);
  }

  disconnect() {
    this._socket.disconnect();
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

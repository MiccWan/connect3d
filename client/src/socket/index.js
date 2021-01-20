import io from 'socket.io-client';
import { ServerEvents } from 'knect-common/src/SocketEvents.js';
import * as BingoEvents from 'knect-common/src/BingoEvents.js';
import SocketWrapper from 'knect-common/src/SocketWrapper.js';

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

      // [ServerEvents.NotifyInvitation]({ playerId, roomId }){

      // },

      [ServerEvents.NotifyPlayerJoinGame](gamers) {
        setGamers(gamers);
      },

      [ServerEvents.NotifyGamer](role) {
        setGameState((state) => ({ ...state, role }));
      },

      [ServerEvents.NotifyGameStart]({ board, turn }) {
        setGameState((state) => ({ ...state, end: false, board, turn }));
      },

      [BingoEvents.ServerEvents.NotifyPlaced]({ board, turn, lastPiece }) {
        setGameState((state) => ({ ...state, board, turn, lastPiece }));
      },

      [BingoEvents.ServerEvents.NotifyGameEnd]({ result }) {
        setGameState((state) => ({ ...state, end: true, result }));
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

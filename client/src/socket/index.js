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

      [ServerEvents.NotifyGameStart]({ board, turn }) {
        showToast('Game Start!');
        setGameState((state) => ({ ...state, end: false, board, turn }));
      },

      [BingoEvents.ServerEvents.NotifyPlaced]({ board, turn, record, lastPiece }) {
        setGameState((state) => ({ ...state, board, turn, record, lastPiece }));
      },

      [ServerEvents.NotifyGameEnd]({ result }) {
        showToast('Game over!');
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

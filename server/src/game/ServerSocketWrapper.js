import SocketWrapper from 'knect-common/src/SocketWrapper.js';
import { ClientRequests, ClientEvents } from 'knect-common/src/SocketEvents.js';
import { lobbyId } from './Lobby.js';

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
        return gc.allPlayers.getAll().map(({ id, name, roomId }) => ({ id, name, roomId }));
      },
      [ClientRequests.GetRoomList]() {
        return gc.rooms.getAll().map(room => ({
          id: room.id,
          name: room.name,
          players: Array.from(room.players).map(([side, id]) => {
            const { name } = gc.getPlayerById(id);
            return [side, { id, name }];
          }),
        }));
      },
      [ClientRequests.CreateRoom]({ name }) {
        player.isInRoom({ throwOnTrue: true });
        const room = gc.createRoom(name);
        gc.switchPlayerRoom(player.id, room.id);
        return room.serialize();
      },
      [ClientRequests.JoinRoom]({ roomId }) {
        player.isInRoom({ throwOnTrue: true });
        gc.switchPlayerRoom(player.id, roomId);
        const room = gc.getRoomById(roomId);
        return room.serialize();
      },
    };

    const eventsHandler = {
      [ClientEvents.SendChat]({ msg }) {
        player.sendChat(msg);
      },
      [ClientEvents.LeaveRoom]() {
        player.isInRoom({ throwOnFalse: true });
        gc.switchPlayerRoom(player.id, lobbyId);
      },
      [ClientEvents.LeaveGame]() {
        player.isInRoom({ throwOnFalse: true });
        const room = gc.getRoomById(player.roomId);
        room.removeFromGame(player.id);
      },
      [ClientEvents.SendInvitation]({ playerId }) {
        player.isInRoom({ throwOnFalse: true });
        const target = gc.getPlayerById(playerId, { throwOnError: true });
        target.notifyInvitation(player.id, player.roomId);
      },
      [ClientEvents.JoinGame]({ side }) {
        player.isInRoom({ throwOnFalse: true });
        const room = gc.rooms.getById(player.roomId);
        room.joinGame(player.id, side);
      },
    };

    this.init(requestsHandler, eventsHandler);
  }
}

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
          players: Array.from(room.players).map(gc.getPlayerById).map(({ id, name }) => ({ id, name })),
        }));
      },
      [ClientRequests.CreateRoom]({ name }) {
        player.isInRoom({ throwOnTrue: true });
        const room = gc.createRoom(name);
        player.joinRoom(room.id);
        return room.id;
      },
    };

    const eventsHandler = {
      [ClientEvents.SendChat]({ msg }) {
        player.sendChat(msg);
      },
      [ClientEvents.JoinRoom]({ roomId }) {
        player.isInRoom();
        const room = gc.getRoomById(roomId, { throwOnError: true });
        const oldRoom = gc.getRoomById(player.roomId, { throwOnError: true });
        oldRoom.remove(player.id);
        room.join(player.id);
      },
      [ClientEvents.SendInvitation]({ playerId }) {
        player.isInRoom({ throwOnFalse: true });
        const target = gc.getPlayerById(playerId, { throwOnError: true });
        target.notifyInvitation(player.id, player.roomId);
      },
      [ClientEvents.JoinGame]() {
        player.isInRoom({ throwOnFalse: true });
        const room = gc.rooms.getById(player.roomId);
        room.joinGame(player.id);
      }
    };

    this.init(requestsHandler, eventsHandler);
  }
}

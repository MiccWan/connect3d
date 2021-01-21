import { v4 as uuidv4 } from 'uuid';
import SocketWrapper from 'knect-common/src/SocketWrapper.js';
import { ClientRequests, ClientEvents } from 'knect-common/src/SocketEvents.js';
import * as Bingo from 'knect-common/src/BingoEvents.js';
import ForbiddenError from 'knect-common/src/ForbiddenError.js';
import { lobbyId } from './Lobby.js';
import getUniqueName from './util/generateName.js';
import User from '../db/models/user.js';

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
      async [ClientRequests.Login]({ name, token }) {
        let user;
        if (token) {
          user = await User.findOne({ token });
          if (!user) throw new ForbiddenError('Token is not valid');
        }
        else if (name) {
          user = await User.findOne({ name });
          if (user) throw new ForbiddenError('Username already taken');
          user = new User({ name, token: uuidv4() });
          user = await user.save();
        }
        else {
          user = { name: getUniqueName() };
        }
        player.login(user.name);
        return {
          name: user.name,
          token: user.token,
          rooms: gc.rooms.serialize(),
          players: gc.lobby.allPlayers.serialize()
        };
      },
      async [ClientRequests.Logout]({ token } = {}) {
        if (!token) throw new ForbiddenError('Token is not provided');
        const user = await User.findOne({ token });
        if (!user) throw new ForbiddenError('Trying to logout with non-existing token');
        await user.delete();
      },
      [ClientRequests.GetPlayerName]() {
        return player.name;
      },
      [ClientRequests.GetPlayerList]() {
        const room = gc.getRoomById(player.roomId);
        return room.allPlayers.serialize();
      },
      [ClientRequests.GetRoomList]() {
        return gc.rooms.serialize();
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
      [ClientRequests.LeaveRoom]() {
        player.isInRoom({ throwOnFalse: true });
        gc.switchPlayerRoom(player.id, lobbyId);
        return {
          roomId: lobbyId,
          rooms: gc.rooms.serialize(),
          players: gc.lobby.allPlayers.serialize(),
        };
      },
      ...Object.fromEntries(Object.values(Bingo.ClientRequests).map(evt => [evt, (...args) => {
        const room = gc.rooms.getById(player.roomId);
        if (room) {
          return room.game.requestHandlers[evt](player.id, ...args);
        }
        throw new ForbiddenError(`Player not in a room.`);
      }]))
    };

    const eventsHandler = {
      [ClientEvents.SendChat]({ msg }) {
        player.sendChat(msg);
      },
      [ClientEvents.LeaveGame]() {
        player.isInRoom({ throwOnFalse: true });
        const room = gc.getRoomById(player.roomId);
        room.leaveGame(player.id);
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
      ...Object.fromEntries(Object.values(Bingo.ClientEvents).map(evt => [evt, (...args) => {
        const room = gc.rooms.getById(player.roomId);
        room.game.eventHandlers[evt](player.id, ...args);
      }]))
    };

    this.init(requestsHandler, eventsHandler);
  }
}

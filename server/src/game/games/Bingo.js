import PieceType from 'knect-common/src/games/PieceType.js';
import * as Socket from 'knect-common/src/SocketEvents.js';
import { ClientEvents, ServerEvents } from 'knect-common/src/BingoEvents.js';
import RoleType, { getPieceType } from 'knect-common/src/RoleType.js';
import CheckResultType from './CheckResultType.js';
import Game from './Game.js';

/** @typedef {import('../index.js').GameCenter} GameCenter */

export default class Bingo extends Game {
  /**
   * @param {GameCenter} gc
   * @param {string} roomId
   */
  constructor(gc, roomId) {
    super(gc, '3DBingo', roomId);
    this.board = [];
    this.turn = null;
    this.record = [];

    this.eventHandlers = {
      [ClientEvents.Place]: (playerId, { x, y, z }) => {
        if (playerId !== this.gamers.get(this.turn)) {
          throw new Error(`Forbidden Operation: Authentication check failed.`);
        }

        if (!this.isPlacible(x, y, z)) {
          throw new Error(`Forbidden Operation: Invalid place.`);
        }

        if (this.playing === false) {
          throw new Error(`Forbidden Operation: Game is not playing.`);
        }

        this.setBoard(x, y, z, this.getCurrentPiece());
        this.addRecord(x, y, z);

        this.result = this.checkWinner(x, y, z);
        this.turn = this.result !== CheckResultType.NotOverYet ? RoleType.None : 
                      (this.turn === RoleType.PlayerA) ? RoleType.PlayerB : RoleType.PlayerA;

        const room = gc.rooms.getById(roomId);
        room.emitAll(ServerEvents.NotifyPlaced, { board: this.board, turn: this.turn });

        if (this.result !== CheckResultType.NotOverYet) {
          this.end();
        }
      },
      [ClientEvents.Surrender]: (playerId) => {
        if (this.playing === false) {
          throw new Error(`Forbidden Operation: Game is not playing.`);
        }

        this.turn = RoleType.None;

        const room = gc.rooms.getById(roomId);
        room.emitAll(ServerEvents.NotifyPlaced, { board: this.board, turn: this.turn });

        this.playerSurrender(this.gamers.get(RoleType.PlayerA) === playerId ? RoleType.PlayerA : RoleType.PlayerB);
      },
    };

    this.requestHandlers = {

    };
  }

  get room() {
    return this.gc.rooms.getById(this.roomId);
  }

  get gamers() {
    return this.room.gamers;
  }

  // ########################################
  //  virtual
  // ########################################

  init() {
    super.init();
    this.turn = RoleType.None;
    this.record = [];
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        for (let k = 0; k < 4; ++k) {
          this.setBoard(i, j, k, PieceType.Empty);
        }
      }
    }
  }

  start() {
    super.start();
    this.turn = RoleType.PlayerA;

    const playerA = this.gc.allPlayers.getById(this.gamers.get(RoleType.PlayerA));
    const playerB = this.gc.allPlayers.getById(this.gamers.get(RoleType.PlayerB));

    this.room.emitAll(Socket.ServerEvents.NotifyGameStart, { board: this.board, turn: this.turn });
    playerA.socket.emit(Socket.ServerEvents.NotifyGamer, RoleType.PlayerA);
    playerB.socket.emit(Socket.ServerEvents.NotifyGamer, RoleType.PlayerB);
  }

  // ########################################
  //  util
  // ########################################

  getCurrentPlayer() {
    return this.gc.getPlayerById(this.gamers.get(this.turn));
  }

  // ########################################
  //  self game controll
  // ########################################

  setBoard(x, y, z, val) {
    this.board[x * 16 + y * 4 + z] = val;
  }

  getBoard(x, y, z) {
    return this.board[x * 16 + y * 4 + z];
  }

  addRecord(x, y, z) {
    this.record.push(x * 16 + y * 4 + z);
  }

  getCurrentPiece() {
    return getPieceType(this.turn);
  }

  isPlacible(x, y, z) {
    if (!PieceType.is.Empty(this.getBoard(x, y, z))) {
      return false;
    }

    if (y === 0) {
      return true;
    }

    if (!PieceType.is.Empty(this.getBoard(x, y - 1, z))) {
      return true;
    }

    return false;
  }

  isBoardFilled() {
    for (const piece of this.board) {
      if (PieceType.is.Empty(piece)) return false;
    }
    return true;
  }

  checkWinner(x, y, z) {
    const sum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 4; ++i) {
      const lines = [
        // 1D
        this.getBoard(i, y, z),
        this.getBoard(x, i, z),
        this.getBoard(x, y, i),
        // 2D
        this.getBoard(x, i, i),
        this.getBoard(i, y, i),
        this.getBoard(i, i, z),
        // 2D inverse
        this.getBoard(x, i, 3 - i),
        this.getBoard(i, y, 3 - i),
        this.getBoard(i, 3 - i, z),
        // 3D
        this.getBoard(i, i, i),
        this.getBoard(i, i, 3 - i),
        this.getBoard(3 - i, i, i),
        this.getBoard(3 - i, i, 3 - i)
      ];
      for (const point in lines) {
        if (lines[point] === PieceType.PlayerA) sum[point] += 1;
        if (lines[point] === PieceType.PlayerB) sum[point] -= 1;
      }
    }

    for (let i = 0; i < sum.length; ++i) {
      if (sum[i] === 4) return CheckResultType.PlayerAWins;
      if (sum[i] === -4) return CheckResultType.PlayerBWins;
    }

    if (this.isBoardFilled()) return CheckResultType.Filled;

    return CheckResultType.NotOverYet;
  }

  end() {
    super.end();

    this.room.emitAll(Socket.ServerEvents.NotifyGameEnd, { result: this.result });

    this.room.saveRecord(this.record);
    this.room.afterGame();
  }

  /**
   * @param {RoleType} side
   */
  playerSurrender(side) {
    this.result = RoleType.is.PlayerA(side) ? CheckResultType.PlayerBWins : CheckResultType.PlayerAWins;
    this.end();
  }
}

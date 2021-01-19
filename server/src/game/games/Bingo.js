import PieceType from 'knect-common/src/games/PieceType';
import TurnsType, { getPieceType } from './TurnsType.js';
import { ClientEvents } from './BingoEvents.js';
import CheckResultType from './CheckResultType.js';
import Game from './Game.js';

export default class Bingo extends Game {
  constructor(roomId) {
    super('3DBingo', roomId);
    this.board = new Array(64);
    this.turn = null;
    this.players = new Array(2);
    this.record = [];

    this.eventHandlers = {
      [ClientEvents.place]: (playerId, x, y, z) => {
        if (playerId !== this.players[this.turn]) {
          throw new Error(`Forbidden Operation: Authentication check failed.`);
        }

        if (!this.isPlacible(x, y, z)) {
          throw new Error(`Forbidden Operation: Invalid place.`);
        }

        this.setBoard(x, y, z, this.getCurrentPiece());
        this.addRecord(x, y, z);

        // TODO: NotifyPlaced
      }
    };

    this.requestHandlers = {

    };
  }

  // ########################################
  //  virtual
  // ########################################

  init() {
    super.init();
    this.turn = TurnsType.None;
    this.record = [];
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        for (let k = 0; k < 4; ++k) {
          this.setBoard(i, j, k, PieceType.Empty);
        }
      }
    }
  }

  // ########################################
  //  util
  // ########################################

  getCurrentPlayer() {
    return this.gc.getPlayerById(this.players[this.turn]);
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

    if (z === 0) {
      return true;
    }

    if (!PieceType.is.Empty(this.getBoard(x, y, z - 1))) {
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
}

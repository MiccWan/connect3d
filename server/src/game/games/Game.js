/** @typedef {import('../index.js').GameCenter} GameCenter */

export default class Game {
  /**
   * @param {GameCenter} gc
   * @param {string} name
   */
  constructor(gc, name, roomId) {
    this.gc = gc;
    this.gameName = name;
    this.roomId = roomId;
    this.playing = false;
  }

  /**
   * @virtual
   */
  init() {
    this.playing = false;
  }

  /**
   * @virtual
   */
  start() {
    this.playing = true;
  }

  /**
   * @virtual
   */
  end() {
    this.playing = false;
  }
}

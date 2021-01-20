/** @typedef {import('../socket/index.js').default} ClientSocketWrapper */

export default class Game {
  /**
   * @param {string} name
   * @param {ClientSocketWrapper} socket
   */
  constructor(name, socket, elRef) {
    this.name = name;
    this.elRef = elRef;
    this.socket = socket;
  }
}

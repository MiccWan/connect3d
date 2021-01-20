/** @typedef {import('./index.js').GameCenter} GameCenter */
/** @typedef {import('./Player.js').default} Player */

export default class PlayerIdList {
  /**
   * @param {GameCenter} gc
   */
  constructor(gc) {
    this.gc = gc;
    this._all = new Set();
  }

  get size() {
    return this._all.size;
  }

  add(id) {
    return this._all.add(id);
  }

  has(id) {
    return this._all.has(id);
  }

  delete(id) {
    return this._all.delete(id);
  }

  forEach(cb) {
    this._all.forEach(cb);
  }

  getById(id) {
    return this.gc.allPlayers.getById(id);
  }

  /**
   * @return {Array<string>}
   */
  getAllId() {
    return [...this._all.values()];
  }

  getAll() {
    return this.getAllId().map(id => this.getById(id));
  }

  serialize() {
    return this.getAll().map(player => player.serialize());
  }
}

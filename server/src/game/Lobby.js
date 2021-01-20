import Room from './Room.js';

const lobbyId = 'lobby';

export default class Lobby extends Room {
  constructor(gc) {
    super(gc, 'Lobby', lobbyId);
  }
}

export { lobbyId };

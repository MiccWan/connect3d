import Enum from './Enum.js';

/* eslint-disable import/no-mutable-exports */
let ServerRequests = {

};

let ServerEvents = {
  NotifyPlaced: 'notify_placed',
};

let ClientRequests = {

};

let ClientEvents = {
  Place: 'place',
  Surrender: 'surrender',
};

ServerRequests = new Enum(Object.fromEntries(Object.entries(ServerRequests).map(([key, str]) => [key, `Bingo_S_R_${str}`])));
ServerEvents = new Enum(Object.fromEntries(Object.entries(ServerEvents).map(([key, str]) => [key, `Bingo_S_E_${str}`])));
ClientRequests = new Enum(Object.fromEntries(Object.entries(ClientRequests).map(([key, str]) => [key, `Bingo_C_R_${str}`])));
ClientEvents = new Enum(Object.fromEntries(Object.entries(ClientEvents).map(([key, str]) => [key, `Bingo_S_E_${str}`])));

export { ServerRequests, ServerEvents, ClientRequests, ClientEvents };

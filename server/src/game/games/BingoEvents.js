import Enum from 'knect-common/src/Enum';

/* eslint-disable import/no-mutable-exports */
let ServerRequests = {

};

let ServerEvents = {

};

let ClientRequests = {

};

let ClientEvents = {

};

ServerRequests = new Enum(Object.fromEntries(Object.entries(ServerRequests).map(([key, str]) => [key, `S_R_${str}`])));
ServerEvents = new Enum(Object.fromEntries(Object.entries(ServerEvents).map(([key, str]) => [key, `S_E_${str}`])));
ClientRequests = new Enum(Object.fromEntries(Object.entries(ClientRequests).map(([key, str]) => [key, `C_R_${str}`])));
ClientEvents = new Enum(Object.fromEntries(Object.entries(ClientEvents).map(([key, str]) => [key, `S_E_${str}`])));

export { ServerRequests, ServerEvents, ClientRequests, ClientEvents };

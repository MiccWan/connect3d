import Enum from './Enum.js';

/* eslint-disable import/no-mutable-exports */

let ServerRequests = {

};

let ServerEvents = {
  SetPlayerName: 'set_player_name',
  UpdateRoomList: 'update_room_list',
  UpdatePlayerList: 'update_player_list',
  NotifyChat: 'notify_chat',
  NotifyInvitation: 'notify_invitation',
  NotifyPlayerJoinRoom: 'notify_player_join_room', // deprecated
};

let ClientRequests = {
  GetPlayerName: 'get_player_name',
  GetPlayerList: 'get_player_list',
  GetRoomList: 'get_room_list',
  CreateRoom: 'create_room',
};

let ClientEvents = {
  SendChat: 'send_chat',
  JoinRoom: 'join_room',
  SendInvitation: 'send_invitation',
  JoinGame: 'join_game',
};

ServerRequests = new Enum(Object.fromEntries(Object.entries(ServerRequests).map(([key, str]) => [key, `S_R_${str}`])));
ServerEvents = new Enum(Object.fromEntries(Object.entries(ServerEvents).map(([key, str]) => [key, `S_E_${str}`])));
ClientRequests = new Enum(Object.fromEntries(Object.entries(ClientRequests).map(([key, str]) => [key, `C_R_${str}`])));
ClientEvents = new Enum(Object.fromEntries(Object.entries(ClientEvents).map(([key, str]) => [key, `S_E_${str}`])));

export { ServerRequests, ServerEvents, ClientRequests, ClientEvents };

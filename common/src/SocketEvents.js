import Enum from './Enum.js';

/* eslint-disable import/no-mutable-exports */

let ServerRequests = {
  ConfirmStart: 'confirm_start',
};

let ServerEvents = {
  SetPlayerName: 'set_player_name',
  UpdateRoomList: 'update_room_list',
  UpdatePlayerList: 'update_player_list',
  NotifyChat: 'notify_chat',
  NotifyInvitation: 'notify_invitation',
  NotifyPlayerJoinRoom: 'notify_player_join_room', // deprecated
  NotifyPlayerJoinGame: 'notify_player_join_game',
  NotifyGamer: 'notify_gamer',
  NotifyGameStart: 'notify_game_start',
  NotifyGameEnd: 'notify_game_end',
  Announcement: 'announcement'
};

let ClientRequests = {
  GetPlayerName: 'get_player_name',
  GetPlayerList: 'get_player_list',
  GetRoomList: 'get_room_list',
  CreateRoom: 'create_room',
  JoinRoom: 'join_room',
  LeaveRoom: 'leave_room',
};

let ClientEvents = {
  SendChat: 'send_chat',
  LeaveGame: 'leave_game',
  SendInvitation: 'send_invitation',
  JoinGame: 'join_game',
};

ServerRequests = new Enum(Object.fromEntries(Object.entries(ServerRequests).map(([key, str]) => [key, `S_R_${str}`])));
ServerEvents = new Enum(Object.fromEntries(Object.entries(ServerEvents).map(([key, str]) => [key, `S_E_${str}`])));
ClientRequests = new Enum(Object.fromEntries(Object.entries(ClientRequests).map(([key, str]) => [key, `C_R_${str}`])));
ClientEvents = new Enum(Object.fromEntries(Object.entries(ClientEvents).map(([key, str]) => [key, `S_E_${str}`])));

export { ServerRequests, ServerEvents, ClientRequests, ClientEvents };

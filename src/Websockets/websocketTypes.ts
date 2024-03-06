export enum MessageTypes {
  CONNECT = 1,
  RECONNECT,
  JOIN_ROOM,
  CREATE_ROOM,
  CHECK_STATUS,
  DEV_INFO,
  MOVE
}

export type Message = {
  type: MessageTypes;
  data: any;
};

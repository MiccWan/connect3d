import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';

export default function initSocket(app) {
  const httpServer = createServer(app);
  const io = new SocketIO(httpServer);

  return { httpServer, io };
}

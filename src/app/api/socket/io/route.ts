import { NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import type { Socket as NetSocket } from 'net';
import type { Server as HTTPServer } from 'http';
import type { NextApiResponse } from 'next';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: SocketIOServer;
    };
  };
};

export async function GET(req: Request) {
  const res = new NextResponse('Socket server endpoint', { status: 200 });
  const socketRes = res as any;

  if (socketRes.socket?.server?.io) {
    console.log('Socket.io server is already running');
  } else if (socketRes.socket?.server) {
    console.log('Initializing Socket.io server...');
    const io = new SocketIOServer(socketRes.socket.server, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: { origin: '*' },
    });

    io.on('connection', (socket) => {
      console.log('Client connected to socket:', socket.id);

      socket.on('join-room', (roomId: string) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
      });

      socket.on('send-message', (data: any) => {
        io.to(data.conversationId).emit('new-message', data);
        io.emit('conversation-updated', data);
      });
    });

    socketRes.socket.server.io = io;
  }

  return res;
}

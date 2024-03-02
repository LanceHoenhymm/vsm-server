import type { Server, Socket } from 'socket.io';
import type { ServerPowercardEventHandler } from '../types';

export function registerPowercardHandler(io: Server, socket: Socket) {
  const onMuft: ServerPowercardEventHandler = (callback) => {
    callback({
      status: 'Success',
      data: {
        msg: '"Muft ka Paisa" used successfully',
      },
    });
  };

  const onInsider: ServerPowercardEventHandler = (callback) => {
    callback({
      status: 'Success',
      data: {
        news: Math.floor(Math.random()),
      },
    });
  };

  const onOptions: ServerPowercardEventHandler = (callback) => {
    callback({
      status: 'Success',
      data: {
        msg: '"Options" used successfully',
      },
    });
  };

  socket.on('game:insider', onInsider);
  socket.on('game:muft', onMuft);
  socket.on('game:options', onOptions);
}

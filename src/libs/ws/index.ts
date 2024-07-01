import WebSocket, { WebSocketServer } from 'ws';

import { WebSocketEvents } from './events';
import { getFormattedDataToSend } from './utils';

class WebSocketWithId extends WebSocket {
  id = '';
}

const wss = new WebSocketServer<typeof WebSocketWithId>({
  noServer: true, // Websocket will be called from httpServer on upgrade event
  maxPayload: 1048576, // 1 MB in bytes
  skipUTF8Validation: true, // Disable this verification to improve performance, since clients are trusted
});

wss.on('connection', (socket, _request, ...args) => {
  const userId = args.at(0) as unknown as string;
  wss.clients.forEach((client) => {
    if (client === socket) return;

    if (client.id === userId) {
      client.send(getFormattedDataToSend(WebSocketEvents.LOGOUT, {}));
      client.terminate();
    }
  });

  socket.id = userId;
});

setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState !== WebSocket.OPEN) return;

    client.ping();
  });
}, 1000);

export { wss };

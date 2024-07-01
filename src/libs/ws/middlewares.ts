import { Duplex } from 'stream';
import { IncomingMessage } from 'http';

import { wss } from '../ws';
import { getQueryParamFromUrl } from './utils';
import { Jwt } from '../Jwt';

export const ensureWebsocketAuthentication = async (
  request: IncomingMessage,
  socket: Duplex,
  head: Buffer
) => {
  try {
    const token = getQueryParamFromUrl(request.url || '', 'token');

    if (!token) {
      throw new Error(`Missing token`);
    }

    const jwt = new Jwt(process.env.JWT_SECRET ?? '');

    const { id } = jwt.decrypt(token);

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, id);
    });
  } catch (e: any) {
    socket.destroy();
  }
};

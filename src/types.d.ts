import { RequestHandler, ErrorRequestHandler } from 'express';

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type AckResponse = { status: 'Success' | 'Failure'; data?: object };
type ReqHandler<TReqBody> = RequestHandler<
  object,
  AckResponse,
  TReqBody,
  object
>;
type ErrHandler = ErrorRequestHandler<object, AckResponse, object, object>;

interface ServerStockEventHandler {
  (args: object, callback: (ack: AckResponse) => void): void;
}
interface ServerPowercardEventHandler {
  (callback: (ack: AckResponse) => void): void;
}

interface ServerGameInfoEventHandler {
  (callback: (ack: AckResponse) => void): void;
}

interface RequestUserProp {
  teamId: string;
  admin: boolean;
}

declare module 'express' {
  interface Request {
    user: RequestUserProp;
  }
}

declare module 'jsonwebtoken' {
  interface JwtPayload {
    user: RequestUserProp;
  }
}

declare module 'socket.io' {
  interface Socket {
    player: {
      teamId: string;
    };
  }
}

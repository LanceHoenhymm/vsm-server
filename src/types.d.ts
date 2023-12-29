import { RequestHandler } from 'express';

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type ReqHandler<TReqBody, TResBody> = RequestHandler<
  object,
  TResBody,
  TReqBody,
  object
>;
type AckResponse = { status: 'Successful' | 'Failed'; data?: object };

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

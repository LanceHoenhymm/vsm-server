import { RequestHandler } from 'express';

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type ReqHandler<TReqBody, TResBody> = RequestHandler<
  object,
  TResBody,
  TReqBody,
  object
>;
type AckResponse = { status: string; msg: string };

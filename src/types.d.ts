import { RequestHandler } from 'express';

type ReqHandler<TReqBody, TResBody> = RequestHandler<
  object,
  TResBody,
  TReqBody,
  object
>;
type AckResponse = { status: string; msg: string };

import { RequestHandler } from 'express';

type ReqHandler<TReqBody, TResBody> = RequestHandler<
  object,
  TResBody,
  TReqBody,
  object
>;

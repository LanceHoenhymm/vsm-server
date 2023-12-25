import { convertedNewsCollectionRef, News } from '../../model';
import httpStatus from 'http-status-codes';
import { BadRequest } from '../../errors';
import type { ReqHandler, AckResponse } from '../../types';
import type { IAddNewsDto } from './admin.controller.dto';

type AddNewHandler = ReqHandler<IAddNewsDto, AckResponse>;

const addNews: AddNewHandler = async function (req, res) {
  const { news, forInsider, roundApplicableAt } = req.body;
};

import { convertedGameDataCollectionRef, GameData } from '../../model';
import httpStatus from 'http-status-codes';
import { BadRequest } from '../../errors';
import type { ReqHandler, AckResponse } from '../../types';
import type { IGameDataDto, IGameDataBatchDto } from './admin.controller.dto';

type AddGameDataHandler = ReqHandler<IGameDataDto, AckResponse>;

export const addGameData: AddGameDataHandler = async function (req, res) {
  const { news, stocks, roundNumber } = req.body;

  await convertedGameDataCollectionRef
    .doc(`R${roundNumber}`)
    .set(new GameData(news, stocks));

  res.status(httpStatus.OK).json({
    status: 'Successful',
    msg: `GameData for round ${roundNumber} was added.`,
  });
};
};

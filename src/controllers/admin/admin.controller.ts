import { firestoreDB } from '../../services/db';
import { convertedGameDataCollectionRef, GameData } from '../../model';
import httpStatus from 'http-status-codes';
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

type AddGameDataBatchHandler = ReqHandler<IGameDataBatchDto, AckResponse>;

export const addGameDataBatch: AddGameDataBatchHandler = async function (
  req,
  res,
) {
  const { data } = req.body;
  const gameDataWriteBatch = firestoreDB.batch();

  for (const gameState of data) {
    gameDataWriteBatch.set(
      convertedGameDataCollectionRef.doc(`R${gameState.roundNumber}`),
      new GameData(gameState.news, gameState.stocks),
    );
  }

  await gameDataWriteBatch.commit();

  res.status(httpStatus.OK).json({
    status: 'Successful',
    msg: `GameData for ${data.length} rounds was added.`,
  });
};

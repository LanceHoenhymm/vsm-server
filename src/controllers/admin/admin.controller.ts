import { getFirestoreDb } from '../../services/firebase';
import { gameDataConverter } from '../../converters';
import { gameDataCollectionName } from '../../appConfig';
import { StatusCodes } from 'http-status-codes';
import type { ReqHandler, AckResponse } from '../../types';
import type { IGameDataDto, IGameDataBatchDto } from './admin.controller.dto';

type AddGameDataHandler = ReqHandler<IGameDataDto, AckResponse>;

export const addGameData: AddGameDataHandler = async function (req, res) {
  const gameDataCollection = getFirestoreDb().collection(
    gameDataCollectionName,
  );
  const { news, stocks, roundNumber } = req.body;

  await gameDataCollection
    .withConverter(gameDataConverter)
    .doc(`R${roundNumber}`)
    .set({ news, stocks });

  res.status(StatusCodes.OK).json({
    status: 'Successful',
  });
};

type AddGameDataBatchHandler = ReqHandler<IGameDataBatchDto, AckResponse>;

export const addGameDataBatch: AddGameDataBatchHandler = async function (
  req,
  res,
) {
  const firestore = getFirestoreDb();
  const gameDataWriteBatch = firestore.batch();
  const gameDataCollection = firestore.collection(gameDataCollectionName);
  const { data } = req.body;

  for (const gameState of data) {
    gameDataWriteBatch.set(
      gameDataCollection
        .withConverter(gameDataConverter)
        .doc(`R${gameState.roundNumber}`),
      { news: gameState.news, stocks: gameState.stocks },
    );
  }

  await gameDataWriteBatch.commit();

  res.status(StatusCodes.OK).json({
    status: 'Successful',
    data: { length: data.length },
  });
};

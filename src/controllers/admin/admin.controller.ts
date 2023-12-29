import { getFirestoreDb } from '../../services/firebase';
import { GameDataConverter } from '../../converters';
import { gameDataColName } from '../../common/app-config';
import { StatusCodes } from 'http-status-codes';
import type { ReqHandler, AckResponse } from '../../types';
import type { IGameDataDto, IGameDataBatchDto } from './admin.controller.dto';

type AddGameDataHandler = ReqHandler<IGameDataDto, AckResponse>;

export const addGameData: AddGameDataHandler = async function (req, res) {
  const gameDataCollection = getFirestoreDb().collection(gameDataColName);
  const { news, stocks, roundNumber } = req.body;

  await gameDataCollection
    .withConverter(GameDataConverter)
    .doc(`R${roundNumber}`)
    .set({ news, stocks });

  res.status(StatusCodes.CREATED).json({
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
  const gameDataCollection = firestore.collection(gameDataColName);
  const { data } = req.body;

  for (const roundData of data) {
    gameDataWriteBatch.set(
      gameDataCollection
        .withConverter(GameDataConverter)
        .doc(`R${roundData.roundNumber}`),
      { news: roundData.news, stocks: roundData.stocks },
    );
  }

  await gameDataWriteBatch.commit();

  res.status(StatusCodes.CREATED).json({
    status: 'Successful',
    data: { length: data.length },
  });
};

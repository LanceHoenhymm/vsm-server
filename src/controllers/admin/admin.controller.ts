import { getFirestoreDb } from '../../services/firebase';
import { GameDataConverter } from '../../converters';
import { gameDataColName } from '../../common/app-config';
import { StatusCodes } from 'http-status-codes';
import type { ReqHandler } from '../../types';
import type {
  IAddGameDataDto,
  IAddGameDataBatchDto,
} from './admin.controller.dto';

type AddGameDataHandler = ReqHandler<IAddGameDataDto>;

export const addGameData: AddGameDataHandler = async function (req, res) {
  const gameDataCollection = getFirestoreDb().collection(gameDataColName);
  const { news, stocks, roundNumber } = req.body;

  const result = await gameDataCollection
    .withConverter(GameDataConverter)
    .doc(`R${roundNumber}`)
    .set({ news, stocks });

  res.status(StatusCodes.CREATED).json({
    status: 'Success',
    data: result,
  });
};

type AddGameDataBatchHandler = ReqHandler<IAddGameDataBatchDto>;

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

  const result = await gameDataWriteBatch.commit();

  res.status(StatusCodes.CREATED).json({
    status: 'Failure',
    data: { length: data.length, result },
  });
};

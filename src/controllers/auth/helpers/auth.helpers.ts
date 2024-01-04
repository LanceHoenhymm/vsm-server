import {
  playerDataColName,
  playerPortColName,
  playerStatColName,
  playerHistColName,
} from '../../../common/app-config';
import {
  startingAmount,
  startingValuation,
  startingDebt,
} from '../../../game/game-config';
import {
  PlayerDataConverter,
  PlayerPortfolioConverter,
} from '../../../converters';
import { getFirestoreDb } from '../../../services/firebase';

export function setupPlayer(teamId: string) {
  const firestoreDb = getFirestoreDb();
  const playerDataCollection = firestoreDb
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter);
  const playerPortCollection = firestoreDb
    .collection(playerPortColName)
    .withConverter(PlayerPortfolioConverter);

  return Promise.all([
    playerDataCollection.doc(teamId).set({
      balance: startingAmount,
      valuation: startingValuation,
      debt: startingDebt,
      total: startingAmount + startingValuation - startingDebt,
    }),
    playerPortCollection.doc(teamId).set({}),
  ]);
}

import {
  playerDataColName,
  playerPortColName,
  playerStatColName,
  playerHistColName,
} from '../../../common/app-config';
import { initialStartingAmount } from '../../../common/game-config';
import {
  PlayerDataConverter,
  PlayerPortfolioConverter,
  PlayerStatusConverter,
  PlayerHistoryConverter,
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
  const playerStatCollection = firestoreDb
    .collection(playerStatColName)
    .withConverter(PlayerStatusConverter);
  const playerHistoryCollection = firestoreDb
    .collection(playerHistColName)
    .withConverter(PlayerHistoryConverter);

  return Promise.all([
    playerDataCollection.doc(teamId).set({
      balance: initialStartingAmount,
      valuation: 0,
      debt: 0,
      total: initialStartingAmount,
    }),
    playerPortCollection.doc(teamId).set({}),
    playerStatCollection.doc(teamId).set({}),
    playerHistoryCollection.doc(teamId).set({}),
  ]);
}

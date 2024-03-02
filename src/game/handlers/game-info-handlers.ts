import { getFirestoreDb } from '../../services/firebase';
import { playerDataColName } from '../../common/app-config';
import { PlayerDataConverter } from '../../converters';

export async function getLeaderboard() {
  const firestore = getFirestoreDb();
  const playerData = await firestore
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter)
    .get();

  return playerData.docs
    .map(function (d) {
      return { id: d.id, ...d.data() };
    })
    .sort((a, b) => b.balance + b.valuation - (a.balance + a.valuation));
}

export function getPortfolio(teamId: string) {
  const firestore = getFirestoreDb();
  return firestore
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter)
    .doc(teamId)
    .get()
    .then((d) => d.data())
    .then((d) => d?.portfolio);
}

export function getBalence(teamId: string) {
  const firestore = getFirestoreDb();
  return firestore
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter)
    .doc(teamId)
    .get()
    .then((d) => d.data()!)
    .then((d) => d.balance);
}

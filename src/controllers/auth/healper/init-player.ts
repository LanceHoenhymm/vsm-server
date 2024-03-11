import { getFirestoreDb } from '../../../services/firebase.js';
import { PlayerDataConverter } from '../../../converters/index.js';
import { playerDataColName } from '../../../common/app-config.js';
import {
  startingAmount,
  startingValuation,
} from '../../../common/game-config.js';

export async function initPlayer(teamId: string) {
  const firebase = getFirestoreDb();
  const playerDataColRef = firebase
    .collection(playerDataColName)
    .withConverter(PlayerDataConverter);

  if ((await playerDataColRef.doc(teamId).get()).exists) {
    return;
  }

  return playerDataColRef.doc(teamId).set({
    balance: startingAmount,
    valuation: startingValuation,
    powercards: {
      muft: 'unused',
      options: { status: 'unused', forStock: null, lockedPrice: null },
      insider: 'unused',
    },
    portfolio: {
      NI: {
        volume: 20,
      },
      CSS: {
        volume: 20,
      },
      AID: {
        volume: 20,
      },
      QTI: {
        volume: 20,
      },
    },
  });
}

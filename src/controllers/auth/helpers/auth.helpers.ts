import {
  userAccountRefName,
  userPortfolioRefName,
  userStatusRefName,
  userHistoryRefName,
} from '../../../common/appConfig';
import { initialStartingAmount } from '../../../common/gameConfig';
import { getRealTimeDb } from '../../../services/firebase';

export function setupPlayer(teamId: string) {
  const rtDb = getRealTimeDb();
  const userAccRef = rtDb.ref(userAccountRefName + '/' + teamId);
  const userPortRef = rtDb.ref(userPortfolioRefName + '/' + teamId);
  const userStatRef = rtDb.ref(userStatusRefName + '/' + teamId);
  const userHistRef = rtDb.ref(userHistoryRefName + '/' + teamId);

  return Promise.all([
    userAccRef.set({
      balance: initialStartingAmount,
      valuation: 0,
      debt: 0,
      total: 0,
    }),
    userPortRef.set({}),
    userStatRef.set({}),
    userHistRef.set({}),
  ]);
}

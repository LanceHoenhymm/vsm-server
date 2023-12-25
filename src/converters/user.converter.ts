import type {
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { getHashedPassword, getUniqueId } from '../utils/hash.util';

interface IUser {
  teamId: string;
  email: string;
  password: string;
  memberCount: 1 | 2;
  p1Name: string;
  p2Name?: string;
}

export const userConverter = {
  async toFirestore(user: Omit<IUser, 'memberCount'>): Promise<DocumentData> {
    const teamId = getUniqueId(user.teamId);
    const hashedPassword = await getHashedPassword(user.password);
    const memberCount = user.p2Name ? 2 : 1;
    return {
      teamId,
      email: user.email,
      password: hashedPassword,
      memberCount,
      p1Name: user.p1Name,
      p2Name: user.p2Name,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<IUser>): IUser {
    return snapshot.data();
  },
};

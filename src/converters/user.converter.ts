import type {
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { hashPassword, getUniqueId } from '../utils/hash.util';

interface IUser {
  teamId: string;
  email: string;
  password: string;
  memberCount: 1 | 2;
  p1Name: string;
  p2Name: string;
}

export const userConverter = {
  toFirestore(user: IUser): DocumentData {
    const teamId = getUniqueId(user.teamId);
    const hashedPassword = hashPassword(user.password);
    return {
      teamId,
      email: user.email,
      password: hashedPassword,
      memberCount: user.memberCount,
      p1Name: user.p1Name,
      p2Name: user.p2Name,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<IUser>): IUser {
    return snapshot.data();
  },
};

import type {
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

interface IUser {
  email: string;
  password: string;
  memberCount: 1 | 2;
  p1Name: string;
  p2Name?: string;
}

export const userConverter = {
  toFirestore(user: IUser): DocumentData {
    return {
      email: user.email,
      password: user.password,
      memberCount: user.memberCount,
      p1Name: user.p1Name,
      p2Name: user.p2Name,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<IUser>): IUser {
    return snapshot.data();
  },
};

import { firestoreDB } from '../services/db';
import type {
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

class User {
  constructor(
    public email: string,
    public password: string,
    public memberCount: 1 | 2,
    public p1Name: string,
    public p2Name: string,
  ) {}
}

const userConverter = {
  toFirestore(user: User): DocumentData {
    return {
      email: user.email,
      password: user.password,
      memberCount: user.memberCount,
      p1Name: user.p1Name,
      p2Name: user.p2Name,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<User>): User {
    return snapshot.data();
  },
};

export const userCollectionRef = firestoreDB.collection('users');
export const convertedUserCollectionRef = firestoreDB
  .collection('users')
  .withConverter(userConverter);

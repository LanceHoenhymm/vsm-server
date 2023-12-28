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
  admin: boolean;
}

export class User implements IUser {
  memberCount: 1 | 2;

  constructor(
    public teamId: string,
    public email: string,
    public password: string,
    public p1Name: string,
    public p2Name: string = '',
    public admin: boolean = false,
  ) {
    this.teamId = getUniqueId(teamId);
    this.password = hashPassword(password);
    this.memberCount = p2Name ? 2 : 1;
  }

  verifyPassword(candidate: string) {
    return this.password === hashPassword(candidate);
  }

  toPlainObject() {
    return {
      teamId: this.teamId,
      email: this.email,
      password: this.password,
      p1Name: this.p1Name,
      p2Name: this.p2Name,
      memberCount: this.memberCount,
      admin: this.admin,
    };
  }
}

export const userConverter = {
  toFirestore(user: User): DocumentData {
    return user.toPlainObject();
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<IUser>): User {
    const { teamId, email, password, p1Name, p2Name, admin } = snapshot.data();
    return new User(teamId, email, password, p1Name, p2Name, admin);
  },
};

import { firestoreDB } from '../services/db';
import type {
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

export class News {
  constructor(
    public news: string,
    public forInsider: boolean,
    public roundApplicableAt: number,
  ) {}
}

const userConverter = {
  toFirestore(news: News): DocumentData {
    return {
      news: news.news,
      forInsider: news.forInsider,
      roundApplicableAt: news.roundApplicableAt,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<News>): News {
    return snapshot.data();
  },
};

export const newsCollectionRef = firestoreDB.collection('news');
export const convertedNewsCollectionRef = firestoreDB
  .collection('news')
  .withConverter(userConverter);

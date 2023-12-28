import { ApplicationError } from './application.error';
import httpStatus from 'http-status-codes';

export class Unauthenticated extends ApplicationError {
  constructor(message: string) {
    super(message, httpStatus.UNAUTHORIZED);
  }
}

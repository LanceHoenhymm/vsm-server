import { ApplicationError } from './application.error';
import httpStatus from 'http-status-codes';

export class Unauthorized extends ApplicationError {
  constructor(message: string) {
    super(message, httpStatus.FORBIDDEN);
  }
}

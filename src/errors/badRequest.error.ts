import httpStatus from 'http-status-codes';
import { ApplicationError } from './application.error';

export class BadRequest extends ApplicationError {
  constructor(message: string) {
    super(message, httpStatus.BAD_REQUEST);
  }
}

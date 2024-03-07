import { ApplicationError } from './application.error.js';
import { StatusCodes } from 'http-status-codes';

export class Unauthorized extends ApplicationError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN);
  }
}

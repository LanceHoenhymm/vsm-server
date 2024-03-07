import { ApplicationError } from './application.error.js';
import { StatusCodes } from 'http-status-codes';

export class UnprocessableEntity extends ApplicationError {
  constructor(message: string) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY);
  }
}

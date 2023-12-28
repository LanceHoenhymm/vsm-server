import type { Request, Response, NextFunction } from 'express';
import type { Schema } from 'zod';
import { BadRequest } from '../errors';

export function validatorFactory(schema: Schema) {
  return function (req: Request, res: Response, next: NextFunction) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const problems = result.error.errors.map((error) => error.path.join('.'));

      throw new BadRequest('Invalid Input', { problems });
    }

    next();
  };
}

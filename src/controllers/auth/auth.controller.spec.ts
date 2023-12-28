import request from 'supertest';
import express, { type Express } from 'express';
import { registerUser } from './auth.controller';
import { IRegisterUserDto } from './auth.controller.dto';

describe('Auth Controller', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/register', registerUser);
  });

  describe('register endpoint', () => {
    it('should add user data', async () => {
      const user: IRegisterUserDto = {
        teamId: 'Lemon',
        email: 'abc@123.com',
        password: 'listerine',
        p1Name: 'Mocha',
      };
      const expectedResponse = {
        status: 'Successful',
      };
      const res = await request(app).post('/register').send(user);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expectedResponse);
    });
  });
});

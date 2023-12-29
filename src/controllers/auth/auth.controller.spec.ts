import request from 'supertest';
import express, { type Express } from 'express';
import { loginUser, registerUser } from './auth.controller';
import { ILoginUserDto, IRegisterUserDto } from './auth.controller.dto';

describe('Auth Controller', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/register', registerUser);
    app.post('/login', loginUser);
  });

  describe('register endpoint', () => {
    it('should run without error', async () => {
      const req: IRegisterUserDto = {
        teamId: 'Lemon',
        email: 'abc@123.com',
        password: 'listerine',
        p1Name: 'Mocha',
      };
      const expectedRes = {
        status: 'Successful',
      };
      const res = await request(app).post('/register').send(req);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(expectedRes);
    });
  });

  describe('login endpoint', () => {
    it('should run without error', async () => {
      const req: ILoginUserDto = {
        email: 'abc@123.com',
        password: 'listerine',
      };
      const expectedRes = {
        status: 'Successful',
        data: {
          token: expect.any(String) as string,
        },
      };

      const res = await request(app).post('/login').send(req);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(expectedRes);
    });
  });
});

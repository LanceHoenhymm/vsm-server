import { StatusCodes } from 'http-status-codes';
import { eq } from 'drizzle-orm';
import type { ReqHandler } from '../../types';
import type { ILoginUserDto, IRegisterUserDto } from './auth.controller.dto.js';
import { BadRequest, NotFound, Unauthenticated } from '../../errors/index.js';
import { db } from '../../services/index.js';
import { users } from '../../models/index.js';
import { getHash, createToken } from '../../common/utils.js';

type RegisterUserHandler = ReqHandler<IRegisterUserDto>;

export const registerUser: RegisterUserHandler = async function (req, res) {
  const { email, password, p1Name, p2Name, isAdmin } = req.body;
  if (!email || !password || !p1Name) {
    throw new BadRequest('Email, Password, and Player 1 Name are Required');
  }
  await db
    .insert(users)
    .values({ email, password: getHash(password), p1Name, p2Name, isAdmin });
  res.status(StatusCodes.CREATED).json({
    status: 'Success',
  });
};

type LoginUserHandler = ReqHandler<ILoginUserDto>;

export const loginUser: LoginUserHandler = async function (req, res) {
  const { email, password } = req.body;
  const result = await db.select().from(users).where(eq(users.email, email));
  if (result.length === 0) {
    throw new NotFound('User Not Found');
  }
  const user = result[0];
  if (user.password !== getHash(password)) {
    throw new Unauthenticated('Invalid Password');
  }
  const token = createToken({ teamId: user.id, admin: user.isAdmin });
  res.status(StatusCodes.CREATED).json({
    status: 'Success',
    data: { token },
  });
};

import { StatusCodes } from 'http-status-codes';
import type { ReqHandler } from '../../types';
import type { ILoginUserDto, IRegisterUserDto } from './auth.controller.dto.js';

type RegisterUserHandler = ReqHandler<IRegisterUserDto>;

export const registerUser: RegisterUserHandler = function (req, res) {
  res.status(StatusCodes.CREATED).json({
    status: 'Success',
  });
};

type LoginUserHandler = ReqHandler<ILoginUserDto>;

export const loginUser: LoginUserHandler = function (req, res) {
  res.status(StatusCodes.CREATED).json({
    status: 'Success',
    data: {},
  });
};

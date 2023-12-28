import { getFirestoreDb } from '../../services/firebase';
import { userConverter, User } from '../../converters';
import { userCollectionName } from '../../appConfig';
import { StatusCodes } from 'http-status-codes';
import { BadRequest, NotFound, Unauthorized } from '../../errors';
import type { ReqHandler, AckResponse } from '../../types';
import type { ILoginUserDto, IRegisterUserDto } from './auth.controller.dto';
import { createToken } from '../../utils/jwt.util';

type RegisterUserHandler = ReqHandler<IRegisterUserDto, AckResponse>;

export const registerUser: RegisterUserHandler = async function (req, res) {
  const userCollection = getFirestoreDb().collection(userCollectionName);
  const { teamId, email, password, p1Name, p2Name } = req.body;

  const emailAlreadyExist = !(
    await userCollection.where('email', '==', email).get()
  ).empty;

  if (emailAlreadyExist) {
    throw new BadRequest('Invalid Email: User Already Exists');
  }

  await userCollection
    .withConverter(userConverter)
    .add(new User(teamId, email, password, p1Name, p2Name));

  res.status(StatusCodes.CREATED).json({
    status: 'Successful',
  });
};

  await userCollection.withConverter(userConverter).add({
    ...req.body,
    p2Name: req.body.p2Name ?? '',
    memberCount: req.body.p2Name ? 2 : 1,
  });

  res.status(StatusCodes.OK).json({
    status: 'Successful',
  });
};

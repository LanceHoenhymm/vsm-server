import { getFirestoreDb } from '../../services/firebase';
import { userConverter } from '../../converters';
import { userCollectionName } from '../../appConfig';
import httpStatus from 'http-status-codes';
import { BadRequest } from '../../errors';
import type { ReqHandler, AckResponse } from '../../types';
import type { IRegisterUserDto } from './auth.controller.dto';

type AddUserHandler = ReqHandler<IRegisterUserDto, AckResponse>;

export const registerUser: AddUserHandler = async function (req, res) {
  const userCollection = getFirestoreDb().collection(userCollectionName);
  const { email } = req.body;

  const emailAlreadyExist = !(
    await userCollection.where('email', '==', email).get()
  ).empty;

  if (emailAlreadyExist) {
    throw new BadRequest(`Email: ${email} already exists.`);
  }

  await userCollection.withConverter(userConverter).add(req.body);

  res.sendStatus(httpStatus.OK).json({
    status: 'Successful',
    msg: `Team: ${email} added to Database`,
  });
};

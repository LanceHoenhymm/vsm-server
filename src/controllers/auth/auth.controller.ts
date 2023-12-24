import { convertedUserCollectionRef, User } from '../../model/User';
import httpStatus from 'http-status-codes';
import { getHashedPassword } from '../../utils/hash.util';
import { BadRequest } from '../../errors';
import type { ReqHandler, AckResponse } from '../../types';
import type { AddUserReqBody } from './auth.controller.validator';

type AddUserHandler = ReqHandler<AddUserReqBody, AckResponse>;

export const signUpUser: AddUserHandler = async function (req, res) {
  const { email, password, p1Name, p2Name } = req.body;

  const emailAlreadyExist = !(
    await convertedUserCollectionRef.where('email', '==', email).get()
  ).empty;

  if (emailAlreadyExist) {
    throw new BadRequest(`Email: ${email} already exists.`);
  }

  const memberCount = p2Name ? 2 : 1;
  const hashedPassword = await getHashedPassword(password);

  await convertedUserCollectionRef.add(
    new User(email, hashedPassword, memberCount, p1Name, p2Name),
  );

  res.sendStatus(httpStatus.OK).json({
    status: 'Successful',
    msg: `Team: ${email} added to Database`,
  });
};

import { firestore } from '../../services/db';
import httpStatus from 'http-status-codes';
import { getUniqueId, getHashedPassword } from '../../utils/hash.util';
import type { ReqHandler, AckResponse } from '../../types';
import type { AddUserReqBody } from './admin.controller.validator';

type AddUserHandler = ReqHandler<AddUserReqBody, AckResponse>;

export const signUpUser: AddUserHandler = async function (req, res) {
  const { email, password, p1Name, p2Name } = req.body;
  const memberCount = p2Name ? 2 : 1;
  const hashedPassword = await getHashedPassword(password);
  const teamId = getUniqueId(email);

  await firestore.collection('users').doc(teamId).set({
    email,
    memberCount,
    password: hashedPassword,
    p1Name,
    p2Name,
  });

  res.sendStatus(httpStatus.OK).json({
    status: 'Successful',
    msg: `Team: ${email} added to Database`,
  });
};

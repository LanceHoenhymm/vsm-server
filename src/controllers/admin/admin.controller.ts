import { firestore } from '../../services/db';
import httpStatus from 'http-status-codes';
import { getUniqueId, getHashedPassword } from '../../utils/hash.util';
import type { ReqHandler, AckResponse } from '../../types';
import type { AddUserReqBody } from './admin.validators';

type AddUserHandler = ReqHandler<AddUserReqBody, AckResponse>;

export const addUser: AddUserHandler = async function (req, res) {
  const { teamName, password, p1Name, p2Name } = req.body;
  const memberCount = p2Name ? 2 : 1;
  const hashedPassword = await getHashedPassword(password);
  const teamId = getUniqueId(teamName);

  await firestore.collection('users').doc(teamId).set({
    teamName,
    memberCount,
    password: hashedPassword,
    p1Name,
    p2Name,
  });

  res.sendStatus(httpStatus.OK).json({
    status: 'Successful',
    msg: `Team: ${teamName} added to Database`,
  });
};

import { getFirestoreDb } from '../../services/firebase';
import { User } from '../../converters';
import { userAccountColName } from '../../common/app-config';
import { createToken, getHash } from '../../common/utils';
import { StatusCodes } from 'http-status-codes';
import { BadRequest, NotFound, Unauthorized } from '../../errors';
import type { ReqHandler } from '../../types';
import type { ILoginUserDto } from './auth.controller.dto';

type LoginUserHandler = ReqHandler<ILoginUserDto>;

export const loginUser: LoginUserHandler = async function (req, res) {
  const userCollection = getFirestoreDb().collection(userAccountColName);
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequest('Email and Password are Required');
  }

  const hashEmail = getHash(email);
  const userDocSnap = await userCollection
    .withConverter(User.converter)
    .doc(hashEmail)
    .get();

  if (!userDocSnap.exists) {
    throw new NotFound('Invalid Email: User Does Not Exist');
  }

  const userDoc = userDocSnap.data()!;

  if (!userDoc.verifyPassword(password)) {
    throw new Unauthorized('Wrong Email or Password');
  }

  if (!userDoc.admin) {
    console.log('User Logged in');
  }

  const token = createToken({ teamId: hashEmail, admin: userDoc.admin });

  res.status(StatusCodes.CREATED).json({
    status: 'Success',
    data: {
      token,
    },
  });
};

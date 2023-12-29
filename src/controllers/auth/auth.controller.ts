import { getFirestoreDb } from '../../services/firebase';
import { User } from '../../converters';
import { userCollectionName } from '../../common/appConfig';
import { createToken, getHash } from '../../common/utils';
import { setupPlayer } from './helpers/auth.helpers';
import { StatusCodes } from 'http-status-codes';
import { BadRequest, NotFound, Unauthorized } from '../../errors';
import type { ReqHandler, AckResponse } from '../../types';
import type { ILoginUserDto, IRegisterUserDto } from './auth.controller.dto';

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
    .withConverter(User.converter)
    .add(new User(teamId, email, password, p1Name, p2Name));

  res.status(StatusCodes.CREATED).json({
    status: 'Successful',
  });
};

type LoginUserHandler = ReqHandler<ILoginUserDto, AckResponse>;

export const loginUser: LoginUserHandler = async function (req, res) {
  const userCollection = getFirestoreDb().collection(userCollectionName);
  const { email, password } = req.body;

  const userEmailQuery = await userCollection
    .withConverter(User.converter)
    .where('email', '==', email)
    .limit(1)
    .get();

  if (userEmailQuery.empty) {
    throw new NotFound('Invalid Email: User Does Not Exist');
  }

  const userDoc = userEmailQuery.docs[0].data();

  if (!userDoc.verifyPassword(password)) {
    throw new Unauthorized('Wrong Email or Password');
  }

  if (!userDoc.admin) {
    await setupPlayer(userDoc.teamId);
  }

  const token = createToken({ teamId: userDoc.teamId, admin: userDoc.admin });

  res.status(StatusCodes.CREATED).json({
    status: 'Successful',
    data: {
      token,
    },
  });
};

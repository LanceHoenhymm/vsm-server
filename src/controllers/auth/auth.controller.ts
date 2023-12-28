import { getFirestoreDb } from '../../services/firebase';
import { userConverter, User } from '../../converters';
import { userCollectionName } from '../../common/appConfig';
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

type LoginUserHandler = ReqHandler<ILoginUserDto, AckResponse>;

export const loginUser: LoginUserHandler = async function (req, res) {
  const userCollection = getFirestoreDb().collection(userCollectionName);
  const { email, password } = req.body;

  const userEmailQuery = await userCollection
    .withConverter(userConverter)
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

  const token = createToken({ teamId: userDoc.teamId, admin: userDoc.admin });

  res.status(StatusCodes.OK).json({
    status: 'Successful',
    data: {
      token,
    },
  });
};

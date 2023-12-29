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
  const { email, password, p1Name, p2Name } = req.body;

  const hashEmail = getHash(email);
  const emailAlreadyExist = (await userCollection.doc(hashEmail).get()).exists;

  if (emailAlreadyExist) {
    throw new BadRequest('Invalid Email: User Already Exists');
  }

  await userCollection
    .withConverter(User.converter)
    .doc(hashEmail)
    .set(new User(email, password, p1Name, p2Name));

  res.status(StatusCodes.CREATED).json({
    status: 'Successful',
  });
};

type LoginUserHandler = ReqHandler<ILoginUserDto, AckResponse>;

export const loginUser: LoginUserHandler = async function (req, res) {
  const userCollection = getFirestoreDb().collection(userCollectionName);
  const { email, password } = req.body;

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
    await setupPlayer(hashEmail);
  }

  const token = createToken({ teamId: hashEmail, admin: userDoc.admin });

  res.status(StatusCodes.CREATED).json({
    status: 'Successful',
    data: {
      token,
    },
  });
};

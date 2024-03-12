import { getFirestoreDb } from '../../services/firebase.js';
import { User } from '../../converters/index.js';
import { usersColName } from '../../common/app-config.js';
import { createToken, getHash } from '../../common/utils.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequest, NotFound, Unauthorized } from '../../errors/index.js';
import type { ReqHandler } from '../../types';
import type { ILoginUserDto, IRegisterUserDto } from './auth.controller.dto.js';
import { initPlayer } from './healper/init-player.js';

type RegisterUserHandler = ReqHandler<IRegisterUserDto>;

export const registerUser: RegisterUserHandler = async function (req, res) {
  const userCollection = getFirestoreDb().collection(usersColName);
  const { email, password, p1Name, p2Name } = req.body;

  if (!email || !password || !p1Name) {
    throw new BadRequest('Email, Password, and Player 1 Name are Required');
  }

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
    status: 'Success',
  });
};

type LoginUserHandler = ReqHandler<ILoginUserDto>;

export const loginUser: LoginUserHandler = async function (req, res) {
  const userCollection = getFirestoreDb().collection(usersColName);
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

  const token = createToken({ teamId: hashEmail, admin: userDoc.admin });

  if (!userDoc.admin) {
    await initPlayer(hashEmail);
  }

  res.status(StatusCodes.CREATED).json({
    status: 'Success',
    data: {
      token,
    },
  });
};

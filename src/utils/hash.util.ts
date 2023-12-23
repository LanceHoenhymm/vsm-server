import argon2 from 'argon2';

export function getUniqueId(baseString: string) {
  return `${Date.now()}_${baseString}`;
}

export function getHashedPassword(password: string) {
  return argon2.hash(password);
}

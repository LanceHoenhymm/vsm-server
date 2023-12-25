import argon2 from 'argon2';

export function getUniqueId(baseString: string) {
  let uid = `${baseString}${Date.now()}`;
  if (uid.length < 20) {
    uid += Array.from({ length: 20 - uid.length }, () =>
      Math.floor(Math.random() * 10),
    ).join('');
  } else if (uid.length > 20) {
    uid = uid.slice(0, 20);
  }
  return uid;
}

export function getHashedPassword(password: string) {
  return argon2.hash(password);
}

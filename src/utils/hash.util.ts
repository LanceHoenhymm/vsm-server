import { createHash } from 'crypto';
export function getUniqueId(str: string) {
  let uid = `${str}${Date.now()}`;
  if (uid.length < 20) {
    uid += Array.from({ length: 20 - uid.length }, () =>
      Math.floor(Math.random() * 10),
    ).join('');
  } else if (uid.length > 20) {
    uid = uid.slice(0, 20);
  }
  return uid;
}

export function hashPassword(str: string) {
  return createHash('md5').update(str).digest('hex');
}

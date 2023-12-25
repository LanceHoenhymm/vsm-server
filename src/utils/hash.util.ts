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
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

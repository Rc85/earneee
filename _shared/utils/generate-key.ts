export const generateKey = (complexity?: 1 | 2, length?: number) => {
  if (length == null) {
    length = 32;
  }

  let chars = '';

  if (!complexity) {
    chars = '1234567890';
  } else if (complexity === 1) {
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  } else if (complexity === 2) {
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_,.;[]|!@#$%^&*()-=~_+{}|:<>?';
  }

  let min = 0;
  let max = chars.length - 1;

  const key: string[] = [];

  for (let i = 0; i < length; i++) {
    key.push(chars[Math.floor(Math.random() * (max - min + 1) + min)]);
  }

  return key.join('');
};

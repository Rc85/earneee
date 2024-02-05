const transformResults = (data: any, revert?: boolean, topLevelOnly?: boolean): any => {
  for (const key in data) {
    const keys = data[key] ? Object.keys(data[key]) : [];

    let newKey: any = key
      .split('_')
      .map((str, i) => (i !== 0 ? str.charAt(0).toUpperCase() + str.substring(1) : str))
      .join('');

    if (revert) {
      const keyChunks = key.split('');
      const newKeyChunks: string[] = [];

      for (const index in keyChunks) {
        const letter = keyChunks[index];

        if (/[a-zA-Z]/.test(letter) && letter === letter.toUpperCase()) {
          newKeyChunks.push('_');
          newKeyChunks.push(letter.toLowerCase());
        } else {
          newKeyChunks.push(letter);
        }
      }

      newKey = newKeyChunks.join('');
    }

    data[newKey] = data[key];

    if (key !== newKey) {
      delete data[key];
    }

    if (!topLevelOnly) {
      if (keys.length > 0) {
        if (data[newKey] instanceof Array) {
          for (const d of data[newKey]) {
            if (d instanceof Object) {
              transformResults(d, revert);
            }
          }
        } else if (data[newKey] instanceof Object) {
          transformResults(data[newKey], revert);
        }
      }
    }
  }

  return data;
};

export const resultsToCamelCase = (data: any[], revert?: boolean, topLevelOnly?: boolean): any => {
  const result = data.map((d) => {
    return transformResults(d, revert, topLevelOnly);
  });

  return result;
};

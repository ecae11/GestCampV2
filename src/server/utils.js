const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const START_TIME = Date.now();
const MAX_RETRIES = 5;

const expBackoff = (func) => {
  for (let n = 0; n <= MAX_RETRIES; n += 1) {
    try {
      return func();
    } catch (e) {
      if (n === MAX_RETRIES) {
        throw e;
      }
      Utilities.sleep(2 ** n * ONE_SECOND + Math.round(Math.random() * ONE_SECOND));
    }
  }
  return null;
};

const columnToLetter = (column) => {
  let temp = '';
  let letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    // eslint-disable-next-line no-param-reassign
    column = (column - temp - 1) / 26;
  }
  return letter;
};

const hasCpuTime = () => !(Date.now() - START_TIME > ONE_MINUTE * 4);

export { expBackoff, hasCpuTime, columnToLetter };

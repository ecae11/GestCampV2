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

const getDataForSheetName = (ssID, sheetName) => {
  // Logger.log('entra a getDataForSheetName()');
  // Logger.log(ssID);
  // Logger.log(sheetName);
  const wb =
    ssID === '' || ssID === null
      ? SpreadsheetApp.getActiveSpreadsheet()
      : SpreadsheetApp.openById(ssID);
  const ss = wb.getSheetByName(sheetName);
  const lastLetterColumn = columnToLetter(ss.getLastColumn());
  const lastRow = ss.getLastRow();
  return ss.getRange(`A1:${lastLetterColumn}${lastRow}`).getDisplayValues();
};

const dataToJson = (arr, key, value) => {
  // Logger.log('entra a dataToJson()');
  // Logger.log(arr.length);
  // Logger.log(key);
  // Logger.log(value);
  const dt = [];
  if (arr.length > 1) {
    // Logger.log('cabecera:');
    // Logger.log(arr[0]);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < arr.length; i++) {
      const obj = {};
      if (i > 0) {
        arr[0].forEach((a, index) => {
          obj[a] = arr[i][index];
        });
        dt.push(obj);
      }
    }
  }
  return key !== '' && value !== '' ? dt.filter((d) => d[key] === value) : dt;
};

const filterByKeyValue = (arr, key, value) => {
  return arr.find((ele) => ele[key] === value);
};

const hasCpuTime = () => !(Date.now() - START_TIME > ONE_MINUTE * 4);

export {
  expBackoff,
  hasCpuTime,
  columnToLetter,
  getDataForSheetName,
  dataToJson,
  filterByKeyValue,
};

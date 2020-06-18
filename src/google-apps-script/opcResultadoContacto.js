import { columnToLetter } from '../server/utils';
import ssIdConfig from './config';

const getOpcResultadoContacto = () => {
  const wb = SpreadsheetApp.openById(ssIdConfig());
  // SpreadsheetApp.getActiveSpreadsheet();
  const ss = wb.getSheetByName('Leyenda');
  const lastLetterColumn = columnToLetter(ss.getLastColumn());
  const lastRow = ss.getLastRow();
  const dataSheet = ss.getRange(`A1:${lastLetterColumn}${lastRow}`).getDisplayValues();
  const arr = [];

  if (dataSheet.length > 1) {
    dataSheet.forEach((b, index0) => {
      const obj = {};
      if (index0 > 0) {
        dataSheet[0].forEach((a, index) => {
          obj[a] = b[index];
        });
        arr.push(obj);
      }
    });
  }
  return arr;
};

export default getOpcResultadoContacto;

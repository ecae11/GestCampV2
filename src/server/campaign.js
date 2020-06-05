import { columnToLetter } from './utils';
import getDataCampaignForEmail from './datafilter';

const getCampaign = () => {
  const wb = SpreadsheetApp.getActiveSpreadsheet();
  const ss = wb.getSheetByName('Campanias');
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
        obj.DATA = getDataCampaignForEmail(obj.SHEET_DATA);
        arr.push(obj);
      }
    });
  }
  return arr;
};

export default getCampaign;

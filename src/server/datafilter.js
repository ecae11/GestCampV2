import getGmailAliases from '../google-apps-script/gmail.alias';
import { columnToLetter } from './utils';

const getDataCampaignForEmail = (ssID) => {
  const email = getGmailAliases()[0];
  const wb = SpreadsheetApp.openById(ssID);
  const ss = wb.getSheetByName('Data');
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
        obj.ROW = index0 + 1;
        if (obj.EMAIL_USER.trim().toUpperCase() === email.trim().toUpperCase()) {
          arr.push(obj);
        }
      }
    });
  }
  return arr;
};

export default getDataCampaignForEmail;

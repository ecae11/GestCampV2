import { columnToLetter } from '../server/utils';
import { getInfoUser } from './UserInfo';
import ssIdConfig from './config';

const getOpcMenu = () => {
  const wb = SpreadsheetApp.openById(ssIdConfig());
  // SpreadsheetApp.getActiveSpreadsheet();
  const ss = wb.getSheetByName('Menu');
  const lastLetterColumn = columnToLetter(ss.getLastColumn());
  const lastRow = ss.getLastRow();
  const dataSheet = ss.getRange(`A1:${lastLetterColumn}${lastRow}`).getDisplayValues();
  const infoUser = getInfoUser();
  const arr = [];
  if (dataSheet.length > 1) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < dataSheet.length; i++) {
      const obj = {};
      if (i > 0) {
        dataSheet[0].forEach((a, index) => {
          obj[a] = dataSheet[i][index];
        });
        if (infoUser.ROL === 'Admin') {
          arr.push(obj);
        } else {
          const perfiles = obj.PERFILES.trim();
          if (perfiles !== null || perfiles !== '') {
            const arrPerfiles = perfiles.split('-');
            // eslint-disable-next-line no-plusplus
            for (let j = 0; j < arrPerfiles.length; j++) {
              if (arrPerfiles[j] === infoUser.PUESTO.CODPUE) {
                arr.push(obj);
                break;
              }
            }
          }
        }
      }
    }
  }
  return arr; // arr.length > 0 ? arr : arr.push({ ROL: rol, CORREO: email });
};
export default getOpcMenu;

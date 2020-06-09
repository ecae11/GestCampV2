import { getDataForSheetName } from '../server/utils';
import getGmailAliases from './gmail.alias';

const getRolUser = () => {
  const email = getGmailAliases()[0];
  const dataSheet = getDataForSheetName('', 'Rol');
  let rol = 'User';

  if (dataSheet.length > 1) {
    dataSheet.forEach((b, index0) => {
      const obj = {};
      if (index0 > 0) {
        dataSheet[0].forEach((a, index) => {
          obj[a] = b[index];
        });
        if (obj.CORREO.trim().toUpperCase() === email.trim().toUpperCase()) {
          rol = obj.ROL;
        }
      }
    });
  }
  return rol;
};

const getPuesto = (codpue) => {
  const dataSheet = getDataForSheetName('', 'Puesto');
  let arr = {};
  if (dataSheet.length > 1) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < dataSheet.length; i++) {
      const obj = {};
      if (i > 0) {
        dataSheet[0].forEach((a, index) => {
          obj[a] = dataSheet[i][index];
        });
        if (obj.CODPUE === codpue) {
          arr = obj;
          break;
        }
      }
    }
  }
  return arr;
};

const getInfoUser = () => {
  const email = getGmailAliases()[0];
  const dataSheet = getDataForSheetName('', 'Empleado');
  const arr = [];
  let objInfo = {};
  const rol = getRolUser();
  if (dataSheet.length > 1) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < dataSheet.length; i++) {
      const obj = {};
      if (i > 0) {
        dataSheet[0].forEach((a, index) => {
          obj[a] = dataSheet[i][index];
        });
        if (obj.CORREO.trim().toUpperCase() === email.trim().toUpperCase()) {
          obj.ROL = rol;
          obj.PUESTO = getPuesto(obj.CODPUE);
          arr.push(obj);
          objInfo = obj;
          break;
        }
      }
    }
  }
  if (arr.length === 0) {
    const obj = {};
    if (rol === 'Admin') {
      obj.EMPNOM = 'SUPER';
      obj.EMPAPP = 'ADMIN';
    }
    obj.ROL = rol;
    obj.CORREO = email;
    // arr.push(obj);
    objInfo = obj;
    return obj;
    // return arr;
  }
  return objInfo; // arr.length > 0 ? arr : arr.push({ ROL: rol, CORREO: email });
};

export { getRolUser, getInfoUser };

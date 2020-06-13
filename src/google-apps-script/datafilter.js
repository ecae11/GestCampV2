import getGmailAliases from './gmail.alias';
import { dataToJson, filterByKeyValue, getDataForSheetName } from '../server/utils';
import { getInfoUser } from './UserInfo';

const functionZ = (data, permisos) => {
  let dt = [];
  // eslint-disable-next-line radix
  const valorClave = parseInt(permisos.VALOR_CLAVE);
  const att = permisos.ATTB;
  // eslint-disable-next-line radix
  const val2 = permisos.USERVALUE;
  if (valorClave === 0) {
    dt = data.filter((elem) => {
      return elem[att] === val2;
    });
  } else if (valorClave === 99 || valorClave === 999) {
    dt = data;
  } else {
    // Logger.log('entra al else funcionX');
  }
  return dt;
};
// eslint-disable-next-line no-unused-vars
const funcionX = (data, permisos) => {
  const dt = [];
  data.forEach((obj) => {
    // eslint-disable-next-line radix
    const valorClave = parseInt(permisos.VALOR_CLAVE);

    if (valorClave === 0) {
      const att = permisos.ATTB;
      // eslint-disable-next-line radix
      const val1 = parseInt(obj[att]);
      // eslint-disable-next-line radix
      const val2 = parseInt(permisos.USERVALUE);
      if (val1 === val2) {
        dt.push(obj);
      }
    } else if (valorClave === 99 || valorClave === 999) {
      // Logger.log('entra al else-if funcionX');
      dt.push(obj);
    } else {
      // Logger.log('entra al else funcionX');
    }
  });
  return dt;
};
const getDataCampaignForEmail = (ssID) => {
  const email = getGmailAliases()[0];
  const dataSheet = getDataForSheetName(ssID, 'Data');
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

const getPermisos = (infoUser) => {
  const arrPermisos = [];
  const nivelAccesos = dataToJson(getDataForSheetName('', 'NivelAcceso'));
  const accesoPuesto = dataToJson(
    getDataForSheetName('', 'AccesoPuesto'),
    'CODPUE',
    infoUser.PUESTO.CODPUE
  );
  accesoPuesto.forEach((obj) => {
    // Logger.log('accesoPuesto obj:');
    // Logger.log(obj);
    // eslint-disable-next-line no-param-reassign
    const nvl = obj.NIVELACCESO;
    // Logger.log('nvl:');
    // Logger.log(nvl);
    const attb = filterByKeyValue(nivelAccesos, 'ID', nvl);
    // eslint-disable-next-line no-param-reassign
    obj.ATTB = attb.ATTRIBUTE;
    // eslint-disable-next-line no-param-reassign
    obj.USERVALUE = infoUser[obj.ATTB];
    arrPermisos.push(obj);
  });
  return arrPermisos;
};

const getDataCampLvlAccess = (ssID, sheet, arrPermisos) => {
  // Logger.log('ingresa a getDatacCampCodpueNivelAcceso');
  // Logger.log(ssID);
  // Logger.log(infoUser);
  // Logger.log(infoUser.PUESTO.CODPUE);
  const dataCamp = getDataForSheetName(ssID, sheet);
  let data = dataToJson(dataCamp, '', '');
  arrPermisos.forEach((obj) => {
    data = functionZ(data, obj); // funcionX(data, obj);
  });
  return data;
};

const todoDataCampanias = () => {
  const arrRetur = [];
  const arrCamp = dataToJson(getDataForSheetName('', 'Campanias'), '', '');
  const arrPermisos = getPermisos(getInfoUser());
  arrCamp.forEach((obj) => {
    // eslint-disable-next-line radix
    const status = parseInt(obj.STATUS);
    if (status === 1) {
      arrRetur.push(getDataCampLvlAccess(obj.SHEET_DATA, 'Data', arrPermisos));
      // arrRetur.push(getDataForSheetName(obj.SHEET_DATA, 'Data'));
    }
  });
  // return getDataCampLvlAccess('1_J4xlvvQOuSgnmdEg_NeLTPEcreTyp_Vu8UxnDgBCiA', getInfoUser());
  return arrRetur;
};

const getRegionFilter = () => {
  // eslint-disable-next-line no-unused-vars
  const arrPermisos = getPermisos(getInfoUser()).filter((e) => {
    return e.ATTB === 'CODREG';
  });
  Logger.log('arrPermisos-getRegionFilter:');
  Logger.log(arrPermisos);
  return getDataCampLvlAccess('', 'Region', arrPermisos);
};

const getAgenciasFilter = () => {
  const arrPermisos = getPermisos(getInfoUser());
  return getDataCampLvlAccess('', 'Agencia', arrPermisos);
};
const getUsuarios = () => {
  const arrPermisos = getPermisos(getInfoUser());
  return getDataCampLvlAccess('', 'Empleado', arrPermisos);
};

const getCampanias = () => {
  return dataToJson(getDataForSheetName('', 'Campanias'), 'STATUS', '1');
};

export {
  getDataCampaignForEmail,
  todoDataCampanias,
  getRegionFilter,
  getAgenciasFilter,
  getCampanias,
  getUsuarios,
};

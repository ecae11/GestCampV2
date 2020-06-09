import getGmailAliases from './gmail.alias';
import { dataToJson, filterByKeyValue, getDataForSheetName } from '../server/utils';
import { getInfoUser } from './UserInfo';

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

const getDataCampLvlAccess = (ssID, infoUser) => {
  // Logger.log('ingresa a getDatacCampCodpueNivelAcceso');
  // Logger.log(ssID);
  // Logger.log(infoUser);
  // Logger.log(infoUser.PUESTO.CODPUE);
  // eslint-disable-next-line func-names
  const accesoPuesto = dataToJson(
    getDataForSheetName('', 'AccesoPuesto'),
    'CODPUE',
    infoUser.PUESTO.CODPUE
  );
  const nivelAccesos = dataToJson(getDataForSheetName('', 'NivelAcceso'));
  const dataCamp = getDataForSheetName(ssID, 'Data');
  // Logger.log('nivelAccesos:');
  // Logger.log(nivelAccesos);
  // Logger.log('accesoPuesto:');
  // Logger.log(accesoPuesto);
  const arrPermisos = [];
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
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
  // Logger.log('permisos');
  // Logger.log(arrPermisos);
  let data = dataToJson(dataCamp, '', '');
  arrPermisos.forEach((obj) => {
    data = funcionX(data, obj);
  });
  return data;
};

const example = () => {
  return getDataCampLvlAccess('1_J4xlvvQOuSgnmdEg_NeLTPEcreTyp_Vu8UxnDgBCiA', getInfoUser());
};

export { getDataCampaignForEmail, getDataCampLvlAccess, example };

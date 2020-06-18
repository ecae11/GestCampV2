// eslint-disable-next-line import/prefer-default-export
import { getDataCampaignForEmail } from '../google-apps-script/datafilter';

// eslint-disable-next-line import/prefer-default-export
export const actualizarLLamada = (ssID, object) => {
  Logger.log(ssID);
  Logger.log(object);
  const wb = SpreadsheetApp.openById(ssID);
  const ss = wb.getSheetByName('Data');
  const range = ss.getRange(`AB${object.ROW}:AS${object.ROW}`);
  const arr = [];
  /*  arr.push(object.ID_CAMP);
  arr.push(object.CAMPANA);
  arr.push(object.EMAIL_USER);
  arr.push(object.CODIGOCLIENTE);
  arr.push(object.AUTORIZA);
  arr.push(object.NOMBRECOMPLETO);
  arr.push(object.DOCUMENTO);
  arr.push(object.TELEFONO);
  arr.push(object.FECNAC);
  arr.push(object.EDAD);
  arr.push(object.CORREO);
  arr.push(object.SEXO);
  arr.push(object.DEPARTAMENTO);
  arr.push(object.PROVINCIA);
  arr.push(object.DISTRITO);
  arr.push(object.ZONA);
  arr.push(object.DIRECCION);
  arr.push(object.DIRECCIONPOSTAL);
  arr.push(object.CALIF0);
  arr.push(object.CALIF1);
  arr.push(object.NROIFI);
  arr.push(object.DEUDADIRECTA);
  arr.push(object.TIPOCREDITOSBS);
  arr.push(object.DEUDIRCONREV);
  arr.push(object.ACTIVIDAD_ESENCIAL);
  arr.push(object.CODREG);
  arr.push(object.CODAGE); */
  arr.push(object.ASESOR);
  arr.push(object.FCONTACTO1);
  arr.push(object.RCONTACTO1);
  arr.push(object.FCONTACTO2);
  arr.push(object.RCONTACTO2);
  arr.push(object.FCONTACTO3);
  arr.push(object.RCONTACTO3);
  arr.push(object.FCONTACTO4);
  arr.push(object.RCONTACTO4);
  arr.push(object.FCONTACTO5);
  arr.push(object.RCONTACTO5);
  arr.push(object.COMENTARIOS);
  arr.push(object.FULTIMA);
  arr.push(object.RULTIMA);
  arr.push(object.LIBRO);
  arr.push(object.FECHACT);
  arr.push(object.FECHA_SEGUIM);
  arr.push(object.RESULTADO_SEGUIM);
  Logger.log(arr);
  range.setValues([arr]);
  // getDataCampaignForEmail(obj.SHEET_DATA);
  return getDataCampaignForEmail(ssID);
};
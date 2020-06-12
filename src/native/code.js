function columnToLetter(column) {
  let temp = '';
  let letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    // eslint-disable-next-line no-const-assign
    letter = String.fromCharCode(temp + 65) + letter;
    // eslint-disable-next-line no-param-reassign
    column = (column - temp - 1) / 26;
  }
  return letter;
}
function letraToHead(arr, key) {
  let ind = 0;
  arr[0].forEach((a, index) => {
    if (a === key) {
      ind = index + 1;
    }
  });
  return ind;
}

function replaceInSheet(range, toReplace, replaceWith) {
  const data = range.getValues();

  let oldValue = '';
  let newValue = '';
  // let cellsChanged = 0;

  // eslint-disable-next-line no-plusplus
  for (let row = 0; row < data.length; row++) {
    // eslint-disable-next-line no-plusplus
    for (let item = 0; item < data[row].length; item++) {
      oldValue = data[row][item];
      newValue = data[row][item].replace(toReplace, replaceWith);
      if (oldValue.trim().toUpperCase() !== newValue.trim().toUpperCase()) {
        data[row][item] = newValue;
      }
    }
  }
  range.setValues(data);
}

function updateAsesor(ssID, obj) {
  const sheet = SpreadsheetApp.openById(ssID).getSheetByName('Data');
  const lastRow = sheet.getLastRow();
  const lastLetterColumn = columnToLetter(lastRow);
  const range = sheet.getRange(`A1:${lastLetterColumn}1`).getDisplayValues();
  const letraEmail = columnToLetter(letraToHead(range, 'EMAIL_USER'));
  const letraAsesor = columnToLetter(letraToHead(range, 'ASESOR'));
  const rangeEmail = sheet.getRange(`${letraEmail}2:${letraEmail}${lastRow}`);
  const rangeAsesor = sheet.getRange(`${letraAsesor}2:${letraAsesor}${lastRow}`);
  replaceInSheet(rangeEmail, obj.EMAIL, obj.EMAILN);
  replaceInSheet(rangeAsesor, obj.ASESOR, obj.ASESORN);
  return { row: { ASESOR: obj.ASESORN, EMAIL: obj.EMAILN }, status: 200 };
}

function updateRow(ssID, object) {
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
  return { row: object.ROW, status: 200 };
}

function getCampanias(id) {
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
      }
      if (obj.ID_CAMPANIA === id) {
        arr.push(obj);
      }
    });
  }
  return arr;
}

// eslint-disable-next-line no-unused-vars
function registerCall(obj) {
  const camp = getCampanias(obj.ID_CAMP);
  if (camp.length > 0) {
    const ssid = camp[0].SHEET_DATA;
    return updateRow(ssid, obj);
  }
  return { row: obj.ROW, status: 400 };
}

// eslint-disable-next-line no-unused-vars
function actualizarAsesor(obj) {
  const camp = getCampanias(obj.ID_CAMP);
  if (camp.length > 0) {
    const ssid = camp[0].SHEET_DATA;
    return updateAsesor(ssid, obj);
  }
  return { row: obj.ASESOR, status: 400 };
}

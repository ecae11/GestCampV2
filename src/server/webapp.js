import getCampaign from '../google-apps-script/campaign';
import getOpcResultadoContacto from '../google-apps-script/opcResultadoContacto';
import { getInfoUser } from '../google-apps-script/UserInfo';
import getOpcMenu from '../google-apps-script/opcMenu';
// eslint-disable-next-line import/named
import {
  getAgenciasFilter,
  getCampanias,
  // eslint-disable-next-line import/named
  getCampById,
  getRegionFilter,
  getUsuarios,
  // eslint-disable-next-line import/named
  lvlAccesoOpcMenu,
  todoDataCampanias,
} from '../google-apps-script/datafilter';
// eslint-disable-next-line import/named
import { actualizarLLamada } from './post';

const Route = {};
Route.path = function (route, callback) {
  Route[route] = callback;
};

const render = (file, argsObject) => {
  const template = HtmlService.createTemplateFromFile(file);
  if (argsObject) {
    const keys = Object.keys(argsObject);
    // eslint-disable-next-line func-names
    keys.forEach(function (key) {
      template[key] = argsObject[key];
    });
  }
  return template.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
};

const universalObject = () => {
  const objs = {};
  objs.userinfo = getInfoUser();
  objs.opcmenu = getOpcMenu();
  return objs;
};
const convertJson = (obj) => {
  const objs = {};
  Object.keys(obj).forEach((e) => {
    objs[e] = JSON.stringify(obj[e]);
  });
  return objs;
};

const loadIndex = () => {
  let objs = universalObject();
  objs = convertJson(objs);
  return render('index', objs);
};
const loadCampanias = () => {
  let objs = universalObject();
  // eslint-disable-next-line no-empty
  if (lvlAccesoOpcMenu(objs.opcmenu, 'campanias')) {
    objs = convertJson(objs);
    return render('campanias', objs);
  }
  return render('403', objs);
};
const loadViewAdminAgencia = () => {
  let objs = universalObject();
  if (lvlAccesoOpcMenu(objs.opcmenu, 'agencias')) {
    objs = convertJson(objs);
    return render('agencias', objs);
  }
  return render('403', objs);
};
const loadViewGerenteRegional = () => {
  let objs = universalObject();
  if (lvlAccesoOpcMenu(objs.opcmenu, 'region')) {
    objs = convertJson(objs);
    return render('regiones', objs);
  }
  return render('403', objs);
};
// eslint-disable-next-line no-unused-vars
const getOAuthToken1 = () => {
  Logger.log(`Current project has ${ScriptApp.getOAuthToken()}`);
};
const apiCampaniasAsesor = () => {
  const data = {};
  data.campanias = getCampaign();
  data.opcresultcontacto = getOpcResultadoContacto();
  // Logger.log(data);
  return ContentService.createTextOutput(`on_result(${JSON.stringify(data)})`).setMimeType(
    ContentService.MimeType.JAVASCRIPT
  );
};
const apiAdministradoresAgencia = () => {
  const data = {};
  data.agencia = getAgenciasFilter();
  data.data = todoDataCampanias();
  data.campanias = getCampanias();
  data.usuarios = getUsuarios();
  data.opcresultcontacto = getOpcResultadoContacto();
  // Logger.log(data);
  return ContentService.createTextOutput(`on_result(${JSON.stringify(data)})`).setMimeType(
    ContentService.MimeType.JAVASCRIPT
  );
};
const apiGerenteRegional = () => {
  const data = {};
  data.region = getRegionFilter();
  data.agencia = getAgenciasFilter();
  data.data = todoDataCampanias();
  data.campanias = getCampanias();
  data.opcresultcontacto = getOpcResultadoContacto();
  // Logger.log(data);
  return ContentService.createTextOutput(`on_result(${JSON.stringify(data)})`).setMimeType(
    ContentService.MimeType.JAVASCRIPT
  );
};
const apiRegistrarLLamada = (e) => {
  Logger.log('apiRegistrarLLamada');
  // Logger.log(e);
  const json = Object.keys(e).filter((k) => {
    return k.length > 20;
  });
  // Logger.log(json[0]);
  // eslint-disable-next-line no-eval
  const data = JSON.parse(json[0]);
  const camp = getCampById(data.ID_CAMP);
  let ret = {};
  Logger.log(data);
  if (camp.length > 0) {
    const ssid = camp[0].SHEET_DATA;
    ret = actualizarLLamada(ssid, data);
  }

  return ContentService.createTextOutput(`on_result(${JSON.stringify(ret)})`).setMimeType(
    ContentService.MimeType.JAVASCRIPT
  );
};
const doGet = (e) => {
  Logger.log(e);
  Logger.log('------------------------');
  Logger.log(e.parameters);
  Logger.log('------------------------');
  Logger.log(e.parameters.v);
  Logger.log('------------------------');
  Route.path('home', loadIndex);
  Route.path('campanias', loadCampanias);
  Route.path('agencias', loadViewAdminAgencia);
  Route.path('region', loadViewGerenteRegional);
  Route.path('apicampaniasasesor', apiCampaniasAsesor);
  Route.path('apigerenteregional', apiGerenteRegional);
  Route.path('apiadministradoragencia', apiAdministradoresAgencia);
  Route.path('postregistrarLLamada', apiRegistrarLLamada);
  if (Route[e.parameters.v]) {
    if (e.parameters.v.includes('postregistrarLLamada')) return apiRegistrarLLamada(e.parameters);
    return Route[e.parameters.v]();
  }
  return render('404');

  /* let view = 'home';
  if (e.parameters.v !== null) {
    Logger.log(view);
    // eslint-disable-next-line prefer-destructuring
    view = e.parameters.v[0];
    if (Route[view]) {
      return Route[view];
    }
    return HtmlService.createHtmlOutput('<h1>Hello</h1>');
  }
  return Route[view]; */
};

export default doGet;

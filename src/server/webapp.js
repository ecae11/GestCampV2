import getCampaign from '../google-apps-script/campaign';
import getOpcResultadoContacto from '../google-apps-script/opcResultadoContacto';
import { getInfoUser } from '../google-apps-script/UserInfo';
import getOpcMenu from '../google-apps-script/opcMenu';
import { example } from '../google-apps-script/datafilter';

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
  objs.userinfo = JSON.stringify(getInfoUser());
  objs.opcmenu = JSON.stringify(getOpcMenu());
  return objs;
};

const loadIndex = () => {
  const objs = universalObject();
  return render('index', objs);
  /* .setSandboxMode(HtmlService.SandboxMode.IFRAME) // This method now has no effect — previously it set the sandbox mode used for client-side scripts
    .addMetaTag('viewport', 'width=device-width, initial-scale=1') // important tag for Responsiveness
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); // Sets the state of the page's X-Frame-Options header, which controls clickjacking prevention. */
};
const loadCampanias = () => {
  const objs = universalObject();
  objs.campanias = JSON.stringify(getCampaign());
  objs.opcresultcontacto = JSON.stringify(getOpcResultadoContacto());
  return render('campanias', objs);
};
const loadAgencia = () => {
  const objs = universalObject();
  // eslint-disable-next-line no-undef
  const data = example();
  objs.agencia = JSON.stringify(data);
  return render('agencias', objs);
};
const doGet = (e) => {
  Logger.log(e.parameters);
  Logger.log(e.parameters.v);
  Route.path('home', loadIndex);
  Route.path('campanias', loadCampanias);
  Route.path('agencias', loadAgencia);
  if (Route[e.parameters.v]) {
    return Route[e.parameters.v]();
  }
  return render('home');

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

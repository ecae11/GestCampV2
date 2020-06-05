import getGmailAliases from '../google-apps-script/gmail.alias';
// import getDataForEmail from './datafilter';
import getCampaign from './campaign';
import getOpcResultadoContacto from './opcResultadoContacto';

const Route = {};
Route.path = function (route, callback) {
  Route[route] = callback;
};

const loadIndex = () => {
  const correo = getGmailAliases()[0];
  const template = HtmlService.createTemplateFromFile('index');
  template.email = correo;
  // template.data = JSON.stringify(getDataForEmail());
  template.campanias = JSON.stringify(getCampaign());
  template.opcresultcontacto = JSON.stringify(getOpcResultadoContacto());
  return template
    .evaluate()
    .setTitle('GestCamp')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME) // This method now has no effect — previously it set the sandbox mode used for client-side scripts
    .addMetaTag('viewport', 'width=device-width, initial-scale=1') // important tag for Responsiveness
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); // Sets the state of the page's X-Frame-Options header, which controls clickjacking prevention.
};

const doGet = (e) => {
  Logger.log(e.parameters);
  Logger.log(e.parameters.v);
  Route.path('home', loadIndex());
  let view = 'home';
  if (e.parameters.v !== null) {
    Logger.log(view);
    // eslint-disable-next-line prefer-destructuring
    view = e.parameters.v[0];
    if (Route[view]) {
      return Route[view];
    }
    return HtmlService.createHtmlOutput('<h1>Hello</h1>');
  }
  return Route[view];
};

export default doGet;

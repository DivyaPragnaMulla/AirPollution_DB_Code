//entry file to the routes module
//import all routes form their dedicated files and export them as an object
import centralina from './centralina.routes';
import comune from './comune.routes';
import inquinante from './inquinante.routes';
import rilevazione from './rilevazione.routes';
import mortalita from './mortalita.routes';
import causemorte from './causemorte.routes';
import airqplus from './airqplus.routes';
import eta from './eta.routes';
 
export default {
  centralina,
  comune,
  inquinante,
  rilevazione,
  mortalita,
  causemorte,
  airqplus,
  eta
};
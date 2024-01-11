import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import routes from './routes';
 
const app = express();

app.use(cors());
/**built-in Express middleware to make the data available in the request's body object */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/centraline', routes.centralina);
app.use('/comune',routes.comune);
app.use('/inquinante',routes.inquinante);
app.use('/rilevazione',routes.rilevazione);

app.use('/mortalita',routes.mortalita);
app.use('/causa_morte',routes.causemorte);
app.use('/eta',routes.eta);

app.use('/airqplus',routes.airqplus);

app.listen(process.env.PORT, () =>
  console.log(`App listening on port ${process.env.PORT}!`),
);
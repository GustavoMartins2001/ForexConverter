import express from 'express';
import morgan from 'morgan';
import routes from './Routes.js';
import errorHandler from './middleware/ErrorHandler.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

export default app;
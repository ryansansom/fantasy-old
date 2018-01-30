import express from 'express';
import path from 'path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routes from './routes';
import { notFound, devError, prodError } from './routes/error-handler';

const app = express();
const errorHandler = app.get('env') === 'development' ? devError : prodError;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'site/public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(notFound);

// error handler
app.use(errorHandler);

export default app;

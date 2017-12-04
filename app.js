import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routes from './routes';
import { notFound, devError, prodError } from './routes/error-handler';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'site/public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(notFound);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(devError);
}

// production error handler
// no stacktraces leaked to user
app.use(prodError);


module.exports = app;

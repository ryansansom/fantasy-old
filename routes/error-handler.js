export function notFound (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
}

export function devError (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
}

export function prodError (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
}
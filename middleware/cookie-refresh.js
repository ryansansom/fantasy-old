const cookiesToRefresh = [{key: 'columns', options: { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true }}];

export default (req, res, next) => {
  const reqCookies = req.cookies || {};
  cookiesToRefresh.forEach(cookie => {
    const cookieValue = reqCookies[cookie.key];

    if (cookieValue) {
      res.cookie(cookie.key, cookieValue, cookie.options);
    }
  });

  return next();
};

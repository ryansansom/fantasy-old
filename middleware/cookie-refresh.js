import { cookieOptions as options } from '../constants/cookie-settings';

const cookiesToRefresh = [{key: 'columns', options}];

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

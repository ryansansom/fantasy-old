import { columnCookieFilter } from '../../helpers/cookies';
import { cookieOptions } from '../../constants/cookie-settings';

export default (req, res) => {
  const columnCookie = columnCookieFilter(req.cookies.columns);
  const columnBody = columnCookieFilter(req.body);

  const newCookie = Object.assign({}, columnCookie, columnBody);

  res.cookie('columns', JSON.stringify(newCookie), cookieOptions);

  return res.status(204).end();
};

import { columnCookieFilter } from '../../helpers/cookies';

export default (req, res) => {
  const columnCookie = columnCookieFilter(req.cookies.columns);
  const columnBody = columnCookieFilter(req.body);

  const newCookie = Object.assign({}, columnCookie, columnBody);

  res.cookie('columns', JSON.stringify(newCookie), { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });

  return res.json({test: true});
};

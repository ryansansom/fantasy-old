const allowedCookieKeys = ['tableCols', 'playerCols'];

export default (req, res) => {
  const columnCookie = columnCookieFilter(req.cookies.columns);
  const columnBody = columnCookieFilter(req.body);

  const newCookie = Object.assign({}, columnCookie, columnBody);

  res.cookie('columns', JSON.stringify(newCookie), { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });

  return res.json({test: true});
};

function columnCookieFilter(cookie = {}) {
  let parsedCookie = {};
  try {
    if (typeof cookie !== 'object') {
      parsedCookie = JSON.parse(cookie);
    } else {
      parsedCookie = cookie;
    }
  } catch (e) {
    console.error('RS2016', 'Invalid cookie value'); // eslint-disable-line no-console
  }

  let newCookie = {};
  Object.keys(parsedCookie).forEach(key => {
    if (allowedCookieKeys.find(allowedKey => allowedKey === key)) newCookie[key] = parsedCookie[key];
  });

  return newCookie;
}

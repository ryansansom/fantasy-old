import { playerCols, tableCols } from '../constants/default-column-config';

const allowedCookieKeys = ['tableCols', 'playerCols'];

export function columnCookieFilter(cookie) {
  let parsedCookie = {};
  try {
    if (typeof cookie !== 'object') {
      parsedCookie = JSON.parse(cookie);
    } else {
      parsedCookie = cookie;
    }
  } catch (e) {
    // In the case of invalid body or invalid cookie, reset to default config.
    parsedCookie = { tableCols, playerCols };
  }

  let newCookie = {};
  Object.keys(parsedCookie).forEach(key => {
    if (allowedCookieKeys.find(allowedKey => allowedKey === key)) newCookie[key] = parsedCookie[key];
  });

  return newCookie;
}

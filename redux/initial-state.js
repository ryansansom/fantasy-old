import { columnCookieFilter } from '../helpers/cookies';

export function getInitialState(req) {
  return {
    columns: columnCookieFilter(req.cookies.columns),
    fetchError: false,
    standings: {},
    updating: false,
  };
}

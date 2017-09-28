import { columnCookieFilter } from '../helpers/cookies';
import { leagueListCookie } from '../helpers/league-list';

export function getInitialState(req) {
  return {
    columns: columnCookieFilter(req.cookies.columns),
    leaguesList: leagueListCookie(req),
    fetchError: false,
    updating: false
  };
}

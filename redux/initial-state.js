import { columnCookieFilter } from '../helpers/cookies';

export function getInitialState(req) {
  const { tableCols, playerCols } = columnCookieFilter(req.cookies.columns);

  return {
    tableCols,
    playerCols,
    fetchError: false,
    classicLeagues: {},
    leaguesList: null,
    modalOpen: '',
    updating: false,
  };
}

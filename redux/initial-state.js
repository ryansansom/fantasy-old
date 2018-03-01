import { columnCookieFilter } from '../helpers/cookies';

export function getInitialState(req) {
  const { tableCols, playerCols } = columnCookieFilter(req.cookies.columns);

  return {
    tableCols,
    playerCols,
    fetchError: false,
    standings: {},
    classicLeagues: {},
    leaguesList: null,
    modalOpen: '',
    updating: false,
  };
}

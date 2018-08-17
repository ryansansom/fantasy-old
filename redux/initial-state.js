import { columnCookieFilter } from '../helpers/cookies';
import { generateLeagues } from '../helpers/league-list';
import { safeJsonParse } from '../helpers/safe-json-parse';

export function getInitialState(req) {
  const { tableCols, playerCols } = columnCookieFilter(req.cookies.columns);

  return {
    tableCols,
    playerCols,
    fetchError: false,
    classicLeagues: {},
    leaguesList: generateLeagues(safeJsonParse(req.cookies.league_list)),
    modalOpen: '',
    updating: false,
  };
}

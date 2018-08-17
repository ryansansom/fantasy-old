import { generateLeagues } from '../../helpers/league-list';
import { cookieOptions } from '../../constants/cookie-settings';
import { safeJsonParse } from '../../helpers/safe-json-parse';

export default (req, res, data = {}) => {
  res.cookie('league_list', JSON.stringify(generateLeagues(safeJsonParse(req.cookies.league_list), data.leagueList)), cookieOptions);
};

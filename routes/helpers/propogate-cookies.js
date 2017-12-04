import { REAL_DATA } from '../../redux/actions';
import { leagueListCookie } from '../../helpers/league-list';
import { cookieOptions } from '../../constants/cookie-settings';

export default (req, res, data = {}) => {
  res.cookie('league_list', JSON.stringify(leagueListCookie(req, data.type === REAL_DATA && data.value)), cookieOptions);
};

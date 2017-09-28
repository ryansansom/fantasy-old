import { REAL_DATA } from '../../redux/actions';
import { leagueListCookie } from '../../helpers/league-list';
import { cookieOptions } from '../../constants/cookie-settings';

const leagueTypeMapping = {
  'h': 'h2h',
  'c': 'classic',
  'd': 'draft'
};

export default (req, res, data = {}) => {
  const realData = data.type === REAL_DATA && data.value;
  const leagueType = leagueTypeMapping[realData.leagueType];

  res.cookie('league_list', JSON.stringify(leagueListCookie(req, realData, leagueType)), cookieOptions);
}

import { UPDATE_CLASSIC_LEAGUE } from '../../redux/actions';
import { getLatestLeagueList } from '../../helpers/league-list';
import { cookieOptions } from '../../constants/cookie-settings';

export default (req, res, data = {}) => {
  res.cookie('league_list', JSON.stringify(getLatestLeagueList(req.cookies.league_list, data.type === UPDATE_CLASSIC_LEAGUE && data.value)), cookieOptions);
};

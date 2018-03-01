import { getLatestLeagueList } from '../../helpers/league-list';

export default (req, res) => res.json(getLatestLeagueList(req.cookies.league_list));

import { leagueListCookie } from '../../helpers/league-list';

export default (req, res) => res.json(leagueListCookie(req));

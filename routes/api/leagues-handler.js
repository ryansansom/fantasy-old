import { leagueListCookie } from '../../helpers/league-list';

export default (req, res) => {
  return res.json(leagueListCookie(req));
};

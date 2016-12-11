import { leagueListCookie } from '../../helpers/league-list';

export default (req, res) => {
  const cookie = leagueListCookie(req, res);

  return res.json(cookie);
};

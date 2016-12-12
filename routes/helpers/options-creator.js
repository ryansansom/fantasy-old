import { leagueListCookie } from '../../helpers/league-list';

export default function getOptions(req, renderProps) {
  return {
    leagueID: renderProps.params.leagueID,
    leaguesList: leagueListCookie(req)
  };
}

import { getLatestLeagueList } from '../../helpers/league-list';
import getDetailedStandings from '../../lib/get-detailed-standings';

export default function getOptions(req, renderProps) {
  const { leagueID } = renderProps.params;
  return {
    leagueID,
    leaguesList: getLatestLeagueList(req.cookies.league_list),
    standingsData: getDetailedStandings,
  };
}

import { getLatestLeagueList } from '../../helpers/league-list';
import getDetailedStandings from '../../lib/get-detailed-standings';
import { mockRealAPI } from '../../components/mock-api';

export default function getOptions(req, renderProps) {
  const { leagueID } = renderProps.params;
  return {
    leagueID: leagueID || 'mock',
    leaguesList: getLatestLeagueList(req.cookies.league_list),
    standingsData: leagueID ? getDetailedStandings : mockRealAPI,
  };
}

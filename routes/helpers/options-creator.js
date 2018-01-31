import { leagueListCookie } from '../../helpers/league-list';
import getDetailedStandings from '../../lib/get-detailed-standings';
import { mockRealAPI } from '../../components/mock-api';

export default function getOptions(req, renderProps) {
  const { leagueID } = renderProps.params;
  return {
    leagueID,
    leaguesList: leagueListCookie(req),
    standingsData: leagueID ? getDetailedStandings : mockRealAPI,
  };
}

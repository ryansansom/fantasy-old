import { generateLeagues } from '../../helpers/league-list';
import { safeJsonParse } from '../../helpers/safe-json-parse';

export default function getOptions(req, renderProps) {
  const { leagueID } = renderProps.params;
  return {
    leagueID,
    leagueType: renderProps.location.query.leagueType,
    leaguesList: generateLeagues(safeJsonParse(req.cookies.league_list)),
    graphqlContext: {
      resources: req.resources,
    },
  };
}

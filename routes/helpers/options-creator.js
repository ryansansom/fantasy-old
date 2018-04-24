import { getLatestLeagueList } from '../../helpers/league-list';

export default function getOptions(req, renderProps) {
  const { leagueID } = renderProps.params;
  return {
    leagueID,
    leaguesList: getLatestLeagueList(req.cookies.league_list),
    graphqlContext: {
      resources: req.resources,
    },
  };
}

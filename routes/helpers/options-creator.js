import { getLatestLeagueList } from '../../helpers/league-list';

export default function getOptions(req, renderProps) {
  const { leagueID } = renderProps.params;
  return {
    leagueID,
    leagueType: renderProps.location.query.leagueType, // TODO: work out the best way for propagating this
    leaguesList: getLatestLeagueList(req.cookies.league_list),
    graphqlContext: {
      resources: req.resources,
    },
  };
}

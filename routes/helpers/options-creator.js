import { getLatestLeagueList } from '../../helpers/league-list';

export default function getOptions(req, renderProps) {
  const { leagueID } = renderProps.params;
  return {
    leagueID,
    isDraft: !!renderProps.location.query.draft, // TEMP - work out the best way for propagating this
    leaguesList: getLatestLeagueList(req.cookies.league_list),
    graphqlContext: {
      resources: req.resources,
    },
  };
}

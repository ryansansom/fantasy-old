export function leagueListCookie(req, data, leagueType) {
  // Read info from cookie, if error, set as blank rather than throw.

  // TODO: Get another way of storing this as it shouldn't really be in a cookie...
  // Could maybe split each league type into its own page? Would help cut down on cookie size as we could scope cookie to a path
  let parsedCookie;

  try {
    const leagueList = JSON.parse(req.cookies['league_list']);

    // For backwards-compatibility
    if (Array.isArray(leagueList)) {
      parsedCookie = {
        classic: leagueList,
        h2h: [],
        draft: []
      }
    } else {
      parsedCookie = leagueList;
    }
  } catch(e) {
    parsedCookie = {
      classic: [],
      h2h: [],
      draft: []
    };
  }

  if (data && ['classic', 'h2h', 'draft'].includes(leagueType)) {
    const { leagueId, leagueName } = data;

    // Check for duplicates, and remove if matched one that already exists
    const existIndex = parsedCookie[leagueType].findIndex(league => league.leagueId === leagueId);
    if (existIndex > -1) parsedCookie[leagueType].splice(existIndex, 1);

    // Add the league to the list
    parsedCookie[leagueType].unshift({ leagueId, leagueName });
  }

  return parsedCookie;
}

export function leagueListCookie(req, data) {
  // Read info from cookie, if error, set as blank rather than throw.
  let parsedCookie;
  try {
    parsedCookie = JSON.parse(req.cookies['league_list']);
  } catch(e) {
    parsedCookie = [];
  }

  if (data) {
    // Check for duplicates, and remove if matched one that already exists
    const existIndex = parsedCookie.findIndex(league => league.leagueId === data.leagueId);
    if (existIndex > -1) parsedCookie.splice(existIndex, 1);

    // Add the league to the list
    parsedCookie.unshift({leagueId: data.leagueId, leagueName: data.leagueName});
  }

  return parsedCookie;
}

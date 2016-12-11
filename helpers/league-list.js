export function leagueListCookie(req, res, data) {
  let parsedCookie;
  try {
    parsedCookie = JSON.parse(req.cookies['league_list']);
  } catch(e) {
    parsedCookie = [];
  }

  if (data) {
    // Check for duplicates, with replacements
    const existIndex = parsedCookie.findIndex(league => league.leagueID === data.leagueId);
    if (existIndex > -1) parsedCookie.splice(existIndex, 1);

    parsedCookie.unshift({leagueID: data.leagueId, leagueName: data.leagueName});
  }

  return parsedCookie;
}

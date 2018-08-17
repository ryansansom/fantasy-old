export function generateLeagues(currentLeagues, data) {
  const leagues = {
    classic: (currentLeagues && currentLeagues.classic) || [],
    h2h: (currentLeagues && currentLeagues.h2h) || [],
    draft: (currentLeagues && currentLeagues.draft) || [],
  };

  // If provided, it will use data to update the list
  if (data && !data.mock) {
    const { leagueId, leagueName } = data;

    // Provides fallback to classic league type
    const leagueType = Object.keys(leagues).includes(data.leagueType)
      ? data.leagueType
      : 'classic';

    // Check for duplicates, and remove if matched one that already exists
    const existIndex = leagues[leagueType].findIndex(league => league.leagueId === leagueId);
    if (existIndex > -1) leagues[leagueType].splice(existIndex, 1);

    // Add the league to the list
    leagues[leagueType].unshift({ leagueId, leagueName });
  }

  return leagues;
}

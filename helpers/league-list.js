export function getLatestLeagueList(rawLeagueList, data) {
  let leagueList;

  if (!Array.isArray(rawLeagueList)) {
    try {
      leagueList = JSON.parse(rawLeagueList);
    } catch (e) {
      leagueList = [];
    }
  } else {
    leagueList = [...rawLeagueList];
  }

  // If provided, it will use data to update the list
  if (data) {
    const { leagueId, leagueName } = data;

    // Check for duplicates, and remove if matched one that already exists
    const existIndex = leagueList.findIndex(league => league.leagueId === leagueId);
    if (existIndex > -1) leagueList.splice(existIndex, 1);

    // Add the league to the list
    leagueList.unshift({ leagueId, leagueName });
  }

  return leagueList;
}

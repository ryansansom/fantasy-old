export const position = {
  header: 'Position',
  func: (player, i) => i + 1,
};

export const playerName = {
  header: 'Player',
  func: player => player.player_name,
};

export const prevTotal = {
  header: 'Previous Total',
  func: player => player.prevTotal,
};

export const currPoints = {
  header: 'Current Points',
  func: player => player.currentPoints,
};

export const projPoints = {
  header: 'Projected Points',
  func: player => player.projectedPoints,
};

export const currTotal = {
  header: 'Current Total',
  func: player => player.prevTotal + player.currentPoints,
};

export const projTotal = {
  header: 'Projected Total',
  func: player => player.prevTotal + player.projectedPoints,
};

export const teamName = {
  header: 'Team Name',
  colSpan: 2,
  func: player => player.team_name,
};

export const eventCost = {
  header: 'Transfer Cost',
  func: player => -1 * player.event_transfers_cost,
};

export const captainChoice = {
  header: 'Captain',
  func: player => ((player.players.picks.find(pick => pick.is_captain) || player.players.subs.find(pick => pick.is_captain)) || {}).name || '',
};

export const viceChoice = {
  header: 'Vice Captain',
  func: player => ((player.players.picks.find(pick => pick.is_vice_captain) || player.players.subs.find(pick => pick.is_vice_captain)) || {}).name || '',
};

export const activeChip = {
  header: 'Active Chip',
  func: player => player.active_chip, // Need to map this when values known
};

export const playersPlayed = {
  header: 'Players Played',
  func: player => player.players.picks.filter(pick => !!pick.game_finished).length,
};

export const playersPlaying = {
  header: 'Players Playing',
  func: player => player.players.picks.filter(pick => pick.game_started && !pick.game_finished).length,
};

export const playersToPlay = {
  header: 'Players To Play',
  func: player => player.players.picks.filter(pick => !pick.game_started).length,
};

export const playersStatus = {
  header: 'Played status',
  func: (player) => {
    const toPlay = player.players.picks.filter(pick => !pick.game_started).length;
    const inPlay = player.players.picks.filter(pick => pick.game_started && !pick.game_finished).length;
    const played = player.players.picks.filter(pick => !!pick.game_finished).length;

    return `${played} / ${inPlay} / ${toPlay}`;
  },
};

export const teamExpectedPointsThis = {
  header: 'EP This',
  func: player => player.ep_this,
};

export const teamExpectedPointsNext = {
  header: 'EP Next',
  func: player => player.ep_next,
};

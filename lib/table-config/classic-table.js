export const position = {
  header: 'Position',
  func: (player, i) => i + 1
};

export const playerName = {
  header: 'Player',
  func: (player) => player.player_name
};

export const prevTotal = {
  header: 'Previous Total',
  func: (player) => player.prevTotal
};

export const currPoints = {
  header: 'Current Points',
  func: (player) => player.currentPoints
};

export const projPoints = {
  header: 'Projected Points',
  func: (player) => player.projectedPoints
};

export const currTotal = {
  header: 'Current Total',
  func: (player) => player.prevTotal + player.currentPoints
};

export const projTotal = {
  header: 'Projected Total',
  func: (player) => player.prevTotal + player.projectedPoints
};

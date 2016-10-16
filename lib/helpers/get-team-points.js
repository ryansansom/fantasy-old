export const acceptableFormations = [
  [1,2,2,2,2,2,3,3,4,4,4],
  [1,2,2,2,2,2,3,3,3,4,4],
  [1,2,2,2,2,2,3,3,3,3,4],
  [1,2,2,2,2,3,3,3,3,3,4],
  [1,2,2,2,2,3,3,3,3,4,4],
  [1,2,2,2,2,3,3,3,4,4,4],
  [1,2,2,2,3,3,3,3,3,4,4],
  [1,2,2,2,3,3,3,3,4,4,4]
];

export function autoSubs(players, active_chip, acceptableFormations) {
  if (active_chip === 'b_boost') return players; // Find out what active chip for bench boost is!!!!!
  if (active_chip === 'all_out_attack') acceptableFormations.push([1,2,2,3,3,3,3,3,4,4,4]);

  return players.filter(player => player.position <= 11); // Dumb version of players points - to be improved
}

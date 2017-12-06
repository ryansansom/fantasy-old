export const position = {
  header: 'Position',
  func: (player) => {
    switch (player.element_type) {
      case 1:
        return 'GK';
      case 2:
        return 'DEF';
      case 3:
        return 'MID';
      case 4:
        return 'FWD';
      default:
        return '';
    }
  },
};

export const playerName = {
  header: 'Player',
  colSpan: 2,
  func: (player) => {
    let appendName = '';
    if (player.is_captain) {
      appendName = ' (C)';
    } else if (player.is_vice_captain) {
      appendName = ' (V)';
    }

    return player.name + appendName;
  },
};

export const playerPoints = {
  header: 'Points',
  func: player => player.points * player.multiplier,
};

export const bonusPoints = {
  header: 'Bonus Points',
  func: (player) => {
    if (player.game_points_finalised) {
      return player.actual_bonus > 0 ? `${player.actual_bonus} (incl.)` : 0;
    } else if (player.actual_bonus) {
      return `${player.provisional_bonus + player.actual_bonus} (${player.actual_bonus} incl.)`;
    }
    return player.provisional_bonus;
  },
};

export const minsPlayed = {
  header: 'Min. Played',
  func: player => player.minutes_played,
};

export const autoSubs = {
  header: 'Auto Sub?',
  func: (player) => {
    if (player.autoSub_out) {
      return 'OUT';
    } else if (player.autoSub_in) {
      return 'IN';
    }
    return '';
  },
};

export const playerTeam = {
  header: 'Team',
  func: (player) => {
    switch (player.team) {
      case 1:
        return 'ARS';
      case 2:
        return 'BOU';
      case 3:
        return 'BRI';
      case 4:
        return 'BUR';
      case 5:
        return 'CHE';
      case 6:
        return 'CRY';
      case 7:
        return 'EVE';
      case 8:
        return 'HUD';
      case 9:
        return 'LEI';
      case 10:
        return 'LIV';
      case 11:
        return 'MNC';
      case 12:
        return 'MNU';
      case 13:
        return 'NEW';
      case 14:
        return 'SOU';
      case 15:
        return 'STK';
      case 16:
        return 'SWA';
      case 17:
        return 'TOT';
      case 18:
        return 'WAT';
      case 19:
        return 'WBA';
      case 20:
        return 'WHU';
      default:
        return '';
    }
  },
};

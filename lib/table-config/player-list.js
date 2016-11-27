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
    }
  }
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
  }
};

export const playerPoints = {
  header: 'Points',
  func: (player) => player.points * player.multiplier
};

export const bonusPoints = {
  header: 'Bonus Points',
  func: (player) => {
    if (player.game_points_finalised) {
      return player.actual_bonus > 0 ? player.actual_bonus + ' (incl.)' : 0;
    } else {
      return player.provisional_bonus;
    }
  }
};

export const minsPlayed = {
  header: 'Min. Played',
  func: (player) => player.minutes_played
};

export const autoSubs = {
  header: 'Auto Sub?',
  func: (player) => {
    if (player.autoSub_out) {
      return 'OUT';
    } else if (player.autoSub_in) {
      return 'IN';
    } else {
      return '';
    }
  }
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
        return 'BUR';
      case 4:
        return 'CHE';
      case 5:
        return 'CRY';
      case 6:
        return 'EVE';
      case 7:
        return 'HUL';
      case 8:
        return 'LEI';
      case 9:
        return 'LIV';
      case 10:
        return 'MNC';
      case 11:
        return 'MNU';
      case 12:
        return 'MID';
      case 13:
        return 'SOU';
      case 14:
        return 'STK';
      case 15:
        return 'SUN';
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
    }
  }
};

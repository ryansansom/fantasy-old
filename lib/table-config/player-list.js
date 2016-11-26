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

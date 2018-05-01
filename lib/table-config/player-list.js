import teams from '../../constants/teams';

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
  func: player => teams[player.team - 1] || '',
};

export const ExpectedPointsThis = {
  header: 'EP This',
  func: player => player.ep_this,
};

export const ExpectedPointsNext = {
  header: 'EP Next',
  func: player => player.ep_next,
};

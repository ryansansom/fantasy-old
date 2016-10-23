export function getPlayerBP(fixtureBonus, element) {
  const playerBonus = fixtureBonus.find(bonus => bonus.element === element);
  return playerBonus ? playerBonus.value : null;
}

export function formatFixtures(eventFixtures) {
  return eventFixtures.map(fixture => {
    const fixtureFormatted = {};
    fixtureFormatted.provisional_bonus = [];
    fixtureFormatted.actual_bonus = [];

    if (fixture.stats.length > 0) {
      const { bonus } = fixture.stats.find(stat => !!stat.bonus);
      const { bps } = fixture.stats.find(stat => !!stat.bps);

      const actualBonusPoints = bonus.a.concat(bonus.h).sort((a,b) => b.value - a.value);
      if (actualBonusPoints.length === 0 && (fixture.minutes >= 60 || fixture.finished_provisional)) {
        fixtureFormatted.provisional_bonus = formatProvisionalBPs(bps.a.concat(bps.h).sort((a,b) => b.value - a.value));
      } else {
        fixtureFormatted.actual_bonus = actualBonusPoints;
      }
    }

    fixtureFormatted.team_a = fixture.team_a;
    fixtureFormatted.team_h = fixture.team_h;
    fixtureFormatted.started = fixture.started;
    fixtureFormatted.finished_provisional = fixture.finished_provisional;
    fixtureFormatted.finished = fixture.finished;

    return fixtureFormatted;
  });
}

function formatProvisionalBPs(bonusArray) {
  bonusArray[0]['points'] = 3;

  for (let i = 1, len = bonusArray.length; i < len; i++) {
    if (bonusArray[i].value === bonusArray[i - 1].value) {
      bonusArray[i]['points'] = bonusArray[i - 1]['points'];
    } else {
      bonusArray[i]['points'] = (3 - i);
    }
  }

  return bonusArray
    .filter(bonus => bonus.points > 0)
    .map(bonus => {
      bonus.value = bonus.points;
      delete bonus.points;
      return bonus;
    });
}

export function applyAutoSubs(outfieldPlayers, outfieldSubs, active_chip) {
  // If bench boost
  if (outfieldSubs.length === 0) {
    const bboostedPlayers = outfieldPlayers.map(player => {
      player.autoSub_out = false;
      return player;
    });

    return {
      picks: bboostedPlayers,
      subs: []
    };
  }

  // all out attack
  const aoa = active_chip === 'aoa';

  // Extract GK and work separately
  const gk = outfieldPlayers.shift();
  const gkSub = outfieldSubs.shift();

  if (gk.minutes_played === 0 && gk.game_finished && gkSub.game_started && gkSub.minutes_played > 0) {
    gk.autoSub_out = true;
    gkSub.autoSub_in = true;
  } else {
    gk.autoSub_out = false;
    gkSub.autoSub_in = false;
  }

  // Work with autosubs for outfield players
  outfieldPlayers.forEach((player, x, outfieldPlayers) => {
    if (player.minutes_played === 0 && player.game_finished) {
      for (let i = 0, len = outfieldSubs.length; i < len; i++) {
        const sub = outfieldSubs[i];
        if (!sub.hasOwnProperty('autoSub_in') && sub.game_started && sub.minutes_played > 0 && validSubstitution(outfieldPlayers, outfieldSubs, player, sub, aoa)) {
          outfieldPlayers[x].autoSub_out = true;
          sub.autoSub_in = true;
          break;
        }

        // No matching sub
        if (i === len - 1) outfieldPlayers[x].autoSub_out = false;
      }
    } else {
      outfieldPlayers[x].autoSub_out = false;
    }
  });

  outfieldSubs.forEach((sub, j, outfieldSubs) => {
    if (!sub.hasOwnProperty('autoSub_in')) {
      sub.autoSub_in = false;
      outfieldSubs[j] = sub;
    }
  });

  return {
    picks: [gk, ...outfieldPlayers],
    subs: [gkSub, ...outfieldSubs]
  }
}

function validSubstitution(outfieldPlayers, outfieldSubs, player, sub, aoa = false) {
  const minElementTypes = {
    "1": 1,
    "2": 3,
    "3": 2,
    "4": 1
  };
  if (aoa) minElementTypes["2"] = 2;
  const players = outfieldPlayers.filter(player => !(player.autoSub_out === true)).concat(outfieldSubs.filter(player => player.autoSub_in === true));
  const playerElementType = player.element_type;
  if (playerElementType !== sub.element_type) {
    return !(players.filter(player => player.element_type === playerElementType).length === minElementTypes[playerElementType.toString()]);
  } else {
    return true;
  }
}

import { ALL_OUT_ATTACK } from '../../constants/active-chip';

function validSubstitution(outfieldPlayers, outfieldSubs, player, sub, aoa = false) {
  const minElementTypes = {
    1: 1,
    2: 3,
    3: 2,
    4: 1,
  };
  if (aoa) minElementTypes['2'] = 2;
  const players = outfieldPlayers.filter(plyr => !(plyr.autoSub_out === true)).concat(outfieldSubs.filter(plyr => plyr.autoSub_in === true));
  const playerElementType = player.element_type;
  if (playerElementType !== sub.element_type) {
    return !(players.filter(plyr => plyr.element_type === playerElementType).length === minElementTypes[playerElementType.toString()]);
  }
  return true;
}

function expectedElapsedTime(KOtime, elapsedTime = 55) {
  return Date.now() - new Date(KOtime) > elapsedTime * 60 * 1000;
}

function formatProvisionalBPs(bonusArray) {
  bonusArray[0].points = 3;

  for (let i = 1, len = bonusArray.length; i < len; i++) {
    if (bonusArray[i].value === bonusArray[i - 1].value) {
      bonusArray[i].points = bonusArray[i - 1].points;
    } else {
      bonusArray[i].points = (3 - i);
    }
  }

  return bonusArray
    .filter(bonus => bonus.points > 0)
    .map((bonus) => {
      bonus.value = bonus.points;
      delete bonus.points;
      return bonus;
    });
}

export function getPlayerBP(fixtureBonus = [], element) {
  const playerBonus = fixtureBonus.find(bonus => bonus.element === element);
  return playerBonus ? playerBonus.value : 0;
}

export function formatFixtures(eventFixtures) {
  return eventFixtures.map((fixture) => {
    const fixtureFormatted = {};
    fixtureFormatted.provisional_bonus = [];
    fixtureFormatted.actual_bonus = [];

    if (fixture.stats.length > 0) {
      const { bonus } = fixture.stats.find(stat => !!stat.bonus);
      const { bps } = fixture.stats.find(stat => !!stat.bps);

      const actualBonusPoints = bonus.a.concat(bonus.h).sort((a, b) => b.value - a.value);
      if (actualBonusPoints.length === 0 && (fixture.minutes >= 60 || fixture.finished_provisional || expectedElapsedTime(fixture.kickoff_time))) {
        fixtureFormatted.provisional_bonus = formatProvisionalBPs(bps.a.concat(bps.h).sort((a, b) => b.value - a.value));
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

export function applyAutoSubs(outfieldPlayers, outfieldSubs, activeChip) {
  // If bench boost
  if (outfieldSubs.length === 0) {
    const bboostedPlayers = outfieldPlayers.map((player) => {
      player.autoSub_out = false;
      return player;
    });

    return {
      picks: bboostedPlayers,
      subs: [],
    };
  }

  // all out attack
  const aoa = activeChip === ALL_OUT_ATTACK;

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
  outfieldPlayers.forEach((player, x) => {
    if (player.minutes_played === 0 && player.game_finished) {
      for (let i = 0, len = outfieldSubs.length; i < len; i++) {
        const sub = outfieldSubs[i];
        if (!Object.prototype.hasOwnProperty.call(sub, 'autoSub_in') && sub.game_started && sub.minutes_played > 0 && validSubstitution(outfieldPlayers, outfieldSubs, player, sub, aoa)) {
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

  outfieldSubs.forEach((sub, j) => {
    if (!Object.prototype.hasOwnProperty.call(sub, 'autoSub_in')) {
      sub.autoSub_in = false;
      outfieldSubs[j] = sub;
    }
  });

  return {
    picks: [gk, ...outfieldPlayers],
    subs: [gkSub, ...outfieldSubs],
  };
}

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
      if (actualBonusPoints.length === 0 && fixture.minutes >= 60) {
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

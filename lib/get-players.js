import { BENCH_BOOST } from '../constants/active-chip';
import { getElements, getEventLive, getEntryPicks } from './fetch-data';
import { applyAutoSubs, getPlayerBP, formatFixtures } from './helpers/get-players';

export default async(teamID = [], week = '', gwFinished = false) => {
  const [ allElements, eventLive, ...entries ] = await Promise.all([getElements(), getEventLive(week), ...teamID.map(id => getEntryPicks(id, week))]);
  const fixtures = formatFixtures(eventLive.fixtures);

  return entries.map(entryPicks => {
    const { picks, entry_history, active_chip } = entryPicks;

    // Add details from all elements
    picks.forEach((pick, i, picks) => {
      const playerStats = eventLive['elements'][pick.element.toString()]['stats'];
      const elementDetail = allElements.find(elmt => elmt.id == pick.element);
      const fixture = fixtures.find(game => (elementDetail.team == game.team_a || elementDetail.team == game.team_h)) || {};

      pick.team = elementDetail.team;
      pick.name = `${elementDetail.first_name} ${elementDetail.second_name}`;
      pick.element_type = elementDetail.element_type;
      pick.points = playerStats.total_points;
      pick.minutes_played = playerStats.minutes;
      pick.actual_bonus = getPlayerBP(fixture.actual_bonus || [], pick.element) || 0;
      pick.provisional_bonus = getPlayerBP(fixture.provisional_bonus || [], pick.element) || 0;
      pick.game_started = fixture.started;
      pick.game_finished = fixture.finished_provisional;
      pick.game_points_finalised = fixture.finished;

      picks[i] = pick;
    });

    // Switch multiplier for captain and vice. Should work even if already switched by underlying API
    const captain = picks.find(captainViceFind());
    const viceCaptain = picks.find(captainViceFind(true));

    if (captain.minutes_played === 0 && captain.game_started && captain.multiplier !== 1 && viceCaptain.minutes_played > 0) {
      // Im not sure of the behaviour if your vice gets minus points, if the captain wouldn't change in that situation,
      // then this wont account for it and will need to change
      const captainIndex = picks.findIndex(captainViceFind());
      const viceCaptainIndex = picks.findIndex(captainViceFind(true));

      viceCaptain.multiplier = captain.multiplier;
      captain.multiplier = 1;
      picks[captainIndex] = captain;
      picks[viceCaptainIndex] = viceCaptain;
    }

    const chosenPlayers = active_chip === BENCH_BOOST ? picks : picks.slice(0, 11);
    const subs = active_chip === BENCH_BOOST ? [] : picks.slice(-4);

    const players = applyAutoSubs(chosenPlayers, subs, active_chip);

    const entryDetail = {
      entry: entry_history.entry,
      active_chip,
      event_transfers_cost: entry_history.event_transfers_cost,
      players
    };

    if (gwFinished) entryDetail.prevTotal = entry_history.total_points - entry_history.points + entry_history.event_transfers_cost;

    return entryDetail;
  });
}

function captainViceFind(vice = false) {
  return (pick) => {
    const type = vice ? 'is_captain' : 'is_vice_captain';
    return pick[type] === true;
  };
}

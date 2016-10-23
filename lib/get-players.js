import { getElements, getEventLive, getEntryPicks } from './fetch-data';
import { applyAutoSubs, getPlayerBP, formatFixtures } from './helpers/get-players';

export default async(teamID = [], week = '') => {
  const [ allElements, eventLive, ...entries ] = await Promise.all([getElements(), getEventLive(week), ...teamID.map(id => getEntryPicks(id, week))]);
  const fixtures = formatFixtures(eventLive.fixtures);

  return entries.map(entryPicks => {
    const { picks, entry_history, active_chip } = entryPicks;

    // Add details from all elements
    picks.forEach((pick, i, picks) => {
      const playerStats = eventLive['elements'][pick.element.toString()]['stats'];
      const elementDetail = allElements.find(elmt => elmt.id == pick.element);
      const fixture = fixtures.find(game => (elementDetail.team == game.team_a || elementDetail.team == game.team_h));

      pick.team = elementDetail.team;
      pick.name = `${elementDetail.first_name} ${elementDetail.second_name}`;
      pick.element_type = elementDetail.element_type;
      pick.points = playerStats.total_points;
      pick.minutes_played = playerStats.minutes;
      pick.actual_bonus = getPlayerBP(fixture.actual_bonus, pick.element) || 0;
      pick.provisional_bonus = getPlayerBP(fixture.provisional_bonus, pick.element) || 0;
      pick.game_started = fixture.started;
      pick.game_finished = fixture.finished_provisional;
      pick.game_points_finalised = fixture.finished;

      picks[i] = pick;
    });

    const chosenPlayers = active_chip === 'b_boost' ? picks : picks.slice(0, 11);
    const subs = active_chip === 'b_boost' ? [] : picks.slice(-4);

    const players = applyAutoSubs(chosenPlayers, subs, active_chip);

    return {
      active_chip,
      event_transfers_cost: entry_history.event_transfers_cost,
      players
    };
  });
}

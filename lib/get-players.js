import { getElements, getEventLive, getEntryPicks } from './fetch-data';
import { getPlayerBP, formatFixtures } from './helpers/get-players';

export default async(teamID = '', week = '') => {
  const [ entryPicks, allElements, eventLive ] = await Promise.all([getEntryPicks(teamID, week), getElements(), getEventLive(week)]);
  const fixtures = formatFixtures(eventLive.fixtures);
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
    pick.bonus = getPlayerBP(fixture.actual_bonus, pick.element) || getPlayerBP(fixture.provisional_bonus, pick.element) || 0;
    pick.game_started = fixture.started;
    pick.game_finished = fixture.finished_provisional;
    pick.game_points_finalised = fixture.finished;

    picks[i] = pick;
  });

  return {
    active_chip,
    event_transfers_cost: entry_history.event_transfers_cost,
    picks
  };
}

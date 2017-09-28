import elements from './elements.json';
import entryId from './entry-id.json';
import entryEventPicks from './entry-id-event-week-picks.json';
import eventWeekLive from './event-week-live.json';
import events from './events.json';
import leagueClassicStandings from './league-classic-standings-id.json';
import leagueH2HStandings from './league-h2h-standings-id.json';
import leagueH2HMatches from './league-h2h-matches-id.json';
import me from './me.json';

export default function(endpoint) {
  if (/^\/elements$/.test(endpoint)) return elements;
  if (/^\/entry\/[0-9]+$/.test(endpoint)) return entryId;
  if (/^\/entry\/[0-9]+\/event\/[0-9]+\/picks$/.test(endpoint)) return entryEventPicks;
  if (/^\/event\/[0-9]+\/live$/.test(endpoint)) return eventWeekLive;
  if (/^\/events$/.test(endpoint)) return events;
  if (/^\/leagues-classic-standings\/[0-9]+$/.test(endpoint)) return leagueClassicStandings;
  if (/^\/leagues-h2h-standings\/[0-9]+$/.test(endpoint)) return leagueH2HStandings;
  if (/^\/leagues-h2h-matches\/[0-9]+$/.test(endpoint)) return leagueH2HMatches;
  if (/^\/me$/.test(endpoint)) return me;
}

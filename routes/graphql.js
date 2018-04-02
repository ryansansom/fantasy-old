import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import { getPlayerBP } from '../lib/helpers/get-players';

const numberSort = (a, b) => {
  if (a < b) return -1;
  return b < a ? 1 : 0;
};

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type ClassicLeagueInfo {
    id: Int
    leagueName: String
    gameweekEnded: Boolean
    lastUpdated: Float
  }
  
  type Player {
    id: ID
    points: Int
    team: String
    position: String
    name: String
    expectedPoints: Float
    expectedPointsNext: Float
    provisionalBonus: Int
    actualBonus: Int
    gamesStarted: Boolean
    gamesFinished: Boolean
    pointsFinalised: Boolean
    minutesPlayed: Int
  }
  
  type Entries {
    id: Int
    name: String
    teamName: String
    activeChip: String
    transferCost: Int
    previousTotal: Int
    players: [Int]
  }

  type ClassicLeague {
    leagueInfo: ClassicLeagueInfo
    entries: [Entries]
    players: [Player]
  }

  type Query {
    classicLeague(leagueId: Int!, week: Int): ClassicLeague
  }
`);

class RootClass {
  constructor(rootValue) {
    this.args = rootValue.args;
    this.resources = rootValue.resources;
  }
}

function getPosition(type) {
  switch (type) {
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
}

const teams = [
  'ARS',
  'BOU',
  'BRI',
  'BUR',
  'CHE',
  'CRY',
  'EVE',
  'HUD',
  'LEI',
  'LIV',
  'MNC',
  'MNU',
  'NEW',
  'SOU',
  'STK',
  'SWA',
  'TOT',
  'WAT',
  'WBA',
  'WHU',
];

class Player extends RootClass {
  constructor(rootValue, id) {
    super(rootValue);

    this.id = id;
  }

  get element() {
    if (!this._element) {
      this._element = this.resources.elements.getElementById(this.id);
    }

    return this._element;
  }

  async points() {
    const element = await this.element;

    return element.event_points;
  }

  async expectedPoints() {
    const element = await this.element;

    return element.ep_this;
  }

  async expectedPointsNext() {
    const element = await this.element;

    return element.ep_next;
  }

  async name() {
    const element = await this.element;

    return `${element.first_name} ${element.second_name}`;
  }

  async position() {
    const positionType = await this.positionType();

    return getPosition(positionType);
  }

  async teamId() {
    const element = await this.element;

    return element.team;
  }

  async positionType() {
    const element = await this.element;

    return element.element_type;
  }

  async team() {
    const teamId = await this.teamId();

    return teams[teamId - 1];
  }

  async getFixtures() {
    const teamId = await this.teamId();

    return (await this.resources.liveEvent.getFormattedFixtures(await this.resources.events.getWeek(this.args.week)))
      .filter(game => (teamId === game.team_a || teamId === game.team_h));
  }

  async getElementFixtureDetail() {
    return (await this.resources.liveEvent.getElements(await this.resources.events.getWeek(this.args.week)))[this.id.toString()];
  }

  async actualBonus() {
    const fixtures = await this.getFixtures();

    return fixtures.reduce((prev, fixture) => prev + getPlayerBP(fixture.actual_bonus, this.id), 0);
  }

  async provisionalBonus() {
    const fixtures = await this.getFixtures();

    return fixtures.reduce((prev, fixture) => prev + getPlayerBP(fixture.provisional_bonus, this.id), 0);
  }

  async gamesStarted() {
    const fixtures = await this.getFixtures();

    return fixtures.some(fixture => fixture.started) || fixtures.length === 0;
  }

  async gamesFinished() {
    const fixtures = await this.getFixtures();

    return fixtures.every(fixture => fixture.finished_provisional) || fixtures.length === 0;
  }

  async pointsFinalised() {
    const fixtures = await this.getFixtures();

    return fixtures.every(fixture => fixture.finished) || fixtures.length === 0;
  }

  async minutesPlayed() {
    const elementFixtureDetails = await this.getElementFixtureDetail()

    return elementFixtureDetails.stats.minutes;
  }
}

class Entry extends RootClass {
  constructor(rootValue, playerInfo) {
    super(rootValue);

    this.id = playerInfo.entry;
    this.name = playerInfo.player_name;
    this.teamName = playerInfo.entry_name;
  }

  async entryPicks(week) {
    return this.resources.entryPicks.getEntryPicks(
      this.id,
      await this.resources.events.getWeek(week),
    );
  }

  async currentEntryPicks() {
    return this.resources.entryPicks.getEntryPicks(
      this.id,
      await this.resources.events.getWeek(),
    );
  }

  async previousEntryPicks() {
    return this.resources.entryPicks.getEntryPicks(
      this.id,
      (await this.resources.events.getWeek()) - 1,
    );
  }

  async activeChip() {
    return (await this.entryPicks(this.args.week)).active_chip;
  }

  async transferCost() {
    return (await this.entryPicks(this.args.week)).entry_history.event_transfers_cost;
  }

  async previousTotal() {
    const gameweekEnded = await this.resources.events.gwEnded(this.args.week);

    if (gameweekEnded) return (await this.currentEntryPicks()).entry_history.total_points;

    return (await this.previousEntryPicks()).entry_history.total_points;
  }

  async players() {
    const { picks = [] } = await this.entryPicks(this.args.week);

    return picks.map(pick => pick.element);
  }
}

class ClassicLeagueInfo extends RootClass {
  id() {
    return this.resources.classicLeagueStandings.leagueId(this.args.leagueId);
  }

  leagueName() {
    return this.resources.classicLeagueStandings.leagueName(this.args.leagueId);
  }

  gameweekEnded() {
    return this.resources.events.gwEnded(this.args.week);
  }

  lastUpdated = () => Date.now(); // TODO: Change this to resolve at the end of all requests

  async players() {
    const players = await this.resources.classicLeagueStandings.getPlayersInfo(this.args.leagueId);

    return players.map(playerInfo => new Entry(this, playerInfo));
  }
}

class ClassicLeague extends RootClass {
  get classicLeagueInfo() {
    if (!this._classicLeagueInfo) {
      this._classicLeagueInfo = new ClassicLeagueInfo(this);
    }

    return this._classicLeagueInfo;
  }

  async leagueInfo() {
    return this.classicLeagueInfo;
  }

  entries() {
    return this.classicLeagueInfo.players();
  }

  async playerIds() {
    const entries = await this.classicLeagueInfo.players();
    const newEntries = await Promise.all([...entries.map(entry => entry.players())]);
    const rawPicks = newEntries.reduce((flattenedArray, currentValue) => flattenedArray.concat(currentValue), []);

    return Array.from(new Set(rawPicks))
      .sort(numberSort);
  }

  async players() {
    const picks = await this.playerIds();

    return picks.map(id => new Player(this, id));
  }
}

// The root provides the top-level API endpoints
const rootValue = {
  classicLeague(args, { resources }) {
    return new ClassicLeague({ args, resources });
  },
};

export default graphqlHTTP({
  schema,
  rootValue,
  graphiql: true,
});

import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import { getPlayerBP } from '../lib/helpers/get-players';
import {playerPoints} from "../lib/table-config/player-list";

const numberSort = (a, b) => {
  if (a < b) return -1;
  return b < a ? 1 : 0;
};

const minElementTypes = {
  1: 1,
  2: 3,
  3: 2,
  4: 1,
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
  
  type Projections {
    autoSubsOut: [Int]
    autoSubsIn: [Int]
    playerPointsMultiplied: Int
  }
  
  type Entries {
    id: Int
    name: String
    teamName: String
    activeChip: String
    transferCost: Int
    previousTotal: Int
    picks: [Int]
    subs: [Int]
    captain: Int
    viceCaptain: Int
    playerPointsMultiplied: Int
    multiplier: Int
    currentPoints: Int
    projections: Projections
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
    const elementFixtureDetails = await this.getElementFixtureDetail();

    return elementFixtureDetails.stats.total_points;
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
    const elementFixtureDetails = await this.getElementFixtureDetail();

    return elementFixtureDetails.stats.minutes;
  }

  async projectedPoints() {
    const [
      points,
      pointsFinalised,
    ] = await Promise.all([
      this.points(),
      this.pointsFinalised(),
    ]);

    const additionalPoints = pointsFinalised ? await this.provisionalBonus() : 0;

    return points + additionalPoints;
  }

  async didntPlay() {
    const [
      minutesPlayed,
      gamesFinished,
    ] = await Promise.all([
      this.minutesPlayed(),
      this.gamesFinished(),
    ]);

    return minutesPlayed === 0 && gamesFinished;
  }

  async playingOrDidPlay() {
    const [
      minutesPlayed,
      gamesStarted,
    ] = await Promise.all([
      this.minutesPlayed(),
      this.gamesStarted(),
    ]);

    return minutesPlayed > 0 && gamesStarted;
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

  async previousEntryPicks(week) {
    return this.resources.entryPicks.getEntryPicks(
      this.id,
      (await this.resources.events.getWeek(week)) - 1,
    );
  }

  async activeChip() {
    return (await this.entryPicks(this.args.week)).active_chip;
  }

  async transferCost() {
    return (await this.entryPicks(this.args.week)).entry_history.event_transfers_cost;
  }

  async previousTotal() {
    const [
      requestedWeek,
      currentWeek,
      gameweekEnded,
    ] = await Promise.all([
      this.resources.events.getWeek(this.args.week),
      this.resources.events.getCurrentWeek(),
      this.resources.events.gwEnded(this.args.week),
    ]);

    let promise;

    if (gameweekEnded) {
      promise = requestedWeek === currentWeek
        ? this.entryPicks(this.args.week)
        : this.previousEntryPicks(this.args.week);
    } else {
      promise = this.previousEntryPicks();
    }

    return (await promise).entry_history.total_points;
  }

  async players() {
    const { picks = [] } = await this.entryPicks(this.args.week);

    return picks;
  }

  async picksAndSubs() {
    const players = await this.players();
    const isBenchBoost = (await this.activeChip()) === 'bboost';

    if (isBenchBoost) {
      return {
        picks: players,
        subs: [],
      };
    }

    return {
      picks: players.slice(0, 11),
      subs: players.slice(-4),
    };
  }

  async picks() {
    const { picks } = await this.picksAndSubs();

    return picks.map(pick => pick.element);
  }

  async subs() {
    const { subs } = await this.picksAndSubs();

    return subs.map(pick => pick.element);
  }

  async captain() {
    const players = await this.players();

    return (players.find(player => player.is_captain) || {}).element;
  }

  async viceCaptain() {
    const players = await this.players();

    return (players.find(player => player.is_vice_captain) || {}).element;
  }

  async playerPointsMultiplied() {
    const { picks } = await this.picksAndSubs();

    return (picks.find(player => player.multiplier > 1) || {}).element;
  }

  async multiplier() {
    const activeChip = await this.activeChip();

    return activeChip === '3xc' ? 3 : 2;
  }

  async currentPoints() {
    const [
      picks,
      multiplier,
      playerMultiplied,
    ] = await Promise.all([
      this.picks(),
      this.multiplier(),
      this.playerPointsMultiplied(),
    ]);
    const multiplierIndex = picks.findIndex(pick => pick === playerMultiplied);
    const pointsArray = await Promise.all(picks.map(id => (new Player(this, id)).points()));

    return pointsArray.reduce((currentPoints, point, i) => {
      if (i === multiplierIndex) {
        return currentPoints + (multiplier * point);
      }

      return currentPoints + point;
    }, 0);
  }

  async projections() {
    const projections = {
      autoSubsOut: [],
      autoSubsIn: [],
      playerPointsMultiplied: null,
    };

    // If the gameweek is ended, the auto subs have already been applied, so it makes the entire check redundant
    if (await this.resources.events.gwEnded(this.args.week)) {
      return projections;
    }

    const [pickIds, subIds, captainId, viceCaptainId] = await Promise.all([this.picks(), this.subs(), this.captain(), this.viceCaptain()]);

    projections.playerPointsMultiplied = captainId;

    const captain = new Player(this, captainId);
    const viceCaptain = new Player(this, viceCaptainId);

    if (await captain.didntPlay() && await viceCaptain.playingOrDidPlay()) {
      projections.playerPointsMultiplied = viceCaptainId;
    }

    // If the subs length is 0, there are no subs to be made, so no need to check further
    if (subIds.length === 0) {
      return projections;
    }

    const picks = pickIds.map(id => new Player(this, id));
    const subs = subIds.map(id => new Player(this, id));

    // Much easier to work the logic of goalkeepers separately
    const gk = picks.shift();
    const gkSub = subs.shift();

    if ((await gk.didntPlay()) && await (gkSub.playingOrDidPlay())) {
      projections.autoSubsOut.push(gk.id);
      projections.autoSubsIn.push(gkSub.id);
    }

    // Now calculate autoSubs for remaining players
    picks.forEach(async (pick) => {
      // Ensure than the pick did not play their game
      if (await pick.didntPlay()) {
        const remainingSubs = subs.filter(sub => !projections.autoSubsIn.includes(sub.id));

        // If there are valid substitutions left
        if (remainingSubs.length > 0) {
          for (let i = 0, len = remainingSubs.length; i < len; i++) {
            const potentialSub = remainingSubs[i];

            // Check that the potential sub actually played, or is in play
            // eslint-disable-next-line no-await-in-loop
            if (await potentialSub.playingOrDidPlay()) {
              // eslint-disable-next-line no-await-in-loop
              const [pickPositionType, subPositionType] = await Promise.all([pick.positionType(), potentialSub.positionType()]);

              if (pickPositionType === subPositionType) {
                // This is clearly valid, so no need to work out rest
                projections.autoSubsOut.push(pick.id);
                projections.autoSubsIn.push(potentialSub.id);

                break;
              }

              const currentPicks = picks.filter(p => !projections.autoSubsOut.includes(p.id));
              const currentSubs = subs.filter(sub => !projections.autoSubsIn.includes(sub.id)); // Optimise?

              // eslint-disable-next-line no-await-in-loop
              const noOfPlayersInPosition = (await Promise.all(currentPicks.concat(currentSubs).map(player => player.positionType())))
                .filter(positionType => positionType === pickPositionType).length;

              if (noOfPlayersInPosition > minElementTypes[pickPositionType]) {
                // This is a valid sub, mark it as such and break the loop
                projections.autoSubsOut.push(pick.id);
                projections.autoSubsIn.push(potentialSub.id);
                break;
              }
            }
          }
        }
      }
    });

    return projections;
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
}

class ClassicLeague extends RootClass {
  leagueInfo() {
    return new ClassicLeagueInfo(this);
  }

  async entries() {
    const players = await this.resources.classicLeagueStandings.getPlayersInfo(this.args.leagueId);

    return players.map(playerInfo => new Entry(this, playerInfo));
  }

  async playerIds() {
    const entries = await this.entries();
    const newEntries = await Promise.all([
      ...entries.map(async entry => (await entry.players()).map(player => player.element)),
    ]);
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

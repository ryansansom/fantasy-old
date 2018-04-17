import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import { getPlayerBP, expectedElapsedTime } from '../lib/helpers/get-players';

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
    classicLeague(leagueId: Int!, week: Int, projectionMinute: Int): ClassicLeague
  }
`);

class RootClass {
  constructor(rootValue) {
    this.args = rootValue.args;
    this.resources = rootValue.resources;

    if (rootValue.allPlayers) {
      this.allPlayers = rootValue.allPlayers;
    }

    if (rootValue.allEntries) {
      this.allEntries = rootValue.allEntries;
    }
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

function returnPickIfDidntPlay(potentialSubs, projectionMinute) {
  return potentialSubs.map(pick => pick.didntPlay(projectionMinute)
    .then((didntPlay) => {
      if (!didntPlay) return null;

      return pick;
    }));
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

    this._minutesElapsedMap = new Map();
    this._didntPlayMap = new Map();
  }

  element() {
    if (!this._element) {
      this._element = this.resources.elements.getElementById(this.id);
    }

    return this._element;
  }

  points() {
    if (!this._points) {
      this._points = this.getElementFixtureDetail()
        .then(elementFixtureDetails => elementFixtureDetails.stats.total_points);
    }

    return this._points;
  }

  expectedPoints() {
    if (!this._expectedPoints) {
      this._expectedPoints = this.element()
        .then(element => element.ep_this);
    }

    return this._expectedPoints;
  }

  expectedPointsNext() {
    if (!this._expectedPointsNext) {
      this._expectedPointsNext = this.element()
        .then(element => element.ep_next);
    }

    return this._expectedPointsNext;
  }

  name() {
    if (!this._name) {
      this._name = this.element()
        .then(element => `${element.first_name} ${element.second_name}`);
    }

    return this._name;
  }

  position() {
    if (!this._position) {
      this._position = this.positionType()
        .then(getPosition);
    }

    return this._position;
  }

  teamId() {
    if (!this._teamId) {
      this._teamId = this.element()
        .then(element => element.team);
    }

    return this._teamId;
  }

  positionType() {
    if (!this._positionType) {
      this._positionType = this.element()
        .then(element => element.element_type);
    }

    return this._positionType;
  }

  team() {
    if (!this._team) {
      this._team = this.teamId()
        .then(teamId => teams[teamId - 1]);
    }

    return this._team;
  }

  getFixtures() {
    if (!this._fixtures) {
      this._fixtures = this._getFixtures();
    }

    return this._fixtures;
  }

  async _getFixtures() {
    const teamId = await this.teamId();

    return (await this.resources.liveEvent.getFormattedFixtures(await this.resources.events.getWeek(this.args.week)))
      .filter(game => (teamId === game.team_a || teamId === game.team_h));
  }

  getElementFixtureDetail() {
    if (!this._elementFixtureDetail) {
      this._elementFixtureDetail = this._getElementFixtureDetail();
    }

    return this._elementFixtureDetail;
  }

  async _getElementFixtureDetail() {
    return (await this.resources.liveEvent.getElements(await this.resources.events.getWeek(this.args.week)))[this.id.toString()];
  }

  actualBonus() {
    if (!this._actualBonus) {
      this._actualBonus = this.getFixtures()
        .then(fixtures => fixtures.reduce((prev, fixture) => prev + getPlayerBP(fixture.actual_bonus, this.id), 0));
    }

    return this._actualBonus;
  }

  provisionalBonus() {
    if (!this._provisionalBonus) {
      this._provisionalBonus = this.getFixtures()
        .then(fixtures => fixtures.reduce((prev, fixture) => prev + getPlayerBP(fixture.provisional_bonus, this.id), 0));
    }

    return this._provisionalBonus;
  }

  gamesStarted() {
    if (!this._gamesStarted) {
      this._gamesStarted = this.getFixtures()
        .then(fixtures => fixtures.some(fixture => fixture.started) || fixtures.length === 0);
    }

    return this._gamesStarted;
  }

  gamesFinished() {
    if (!this._gamesFinished) {
      this._gamesFinished = this.getFixtures()
        .then(fixtures => fixtures.every(fixture => fixture.finished_provisional) || fixtures.length === 0);
    }

    return this._gamesFinished;
  }

  pointsFinalised() {
    if (!this._pointsFinalised) {
      this._pointsFinalised = this.getFixtures()
        .then(fixtures => fixtures.every(fixture => fixture.finished) || fixtures.length === 0);
    }

    return this._pointsFinalised;
  }

  minutesPlayed() {
    if (!this._minutesPlayed) {
      this._minutesPlayed = this.getElementFixtureDetail()
        .then(elementFixtureDetails => elementFixtureDetails.stats.minutes);
    }

    return this._minutesPlayed;
  }

  projectedPoints() {
    if (!this._projectedPoints) {
      this._projectedPoints = this._getProjectedPoints();
    }

    return this._projectedPoints;
  }

  async _getProjectedPoints() {
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

  isXMinutesPastKickoff(minutesAfterKickoff) {
    if (!this._minutesElapsedMap.has(minutesAfterKickoff)) {
      this._minutesElapsedMap.set(
        minutesAfterKickoff,
        this.getFixtures()
          .then(fixtures => fixtures.every(fixture => expectedElapsedTime(fixture.kickoff_time, minutesAfterKickoff))),
      );
    }

    return this._minutesElapsedMap.get(minutesAfterKickoff);
  }

  didntPlay(minutesAfterKickoff) {
    if (!this._didntPlayMap.has(minutesAfterKickoff)) {
      this._didntPlayMap.set(
        minutesAfterKickoff,
        this._didntPlay(minutesAfterKickoff),
      );
    }

    return this._didntPlayMap.get(minutesAfterKickoff);
  }

  async _didntPlay(minutesAfterKickoff) {
    const hasSpecifiedTimeElapsedPromise = minutesAfterKickoff && parseInt(minutesAfterKickoff, 10) > 0
      ? this.isXMinutesPastKickoff(parseInt(minutesAfterKickoff, 10))
      : this.gamesFinished();

    const [
      minutesPlayed,
      hasSpecifiedTimeElapsed,
    ] = await Promise.all([
      this.minutesPlayed(),
      hasSpecifiedTimeElapsedPromise,
    ]);

    return minutesPlayed === 0 && hasSpecifiedTimeElapsed;
  }

  playingOrDidPlay() {
    if (!this._playingOrDidPlay) {
      this._playingOrDidPlay = Promise.all([
        this.minutesPlayed(),
        this.gamesStarted(),
      ])
        .then(([
          minutesPlayed,
          gamesStarted,
        ]) => minutesPlayed > 0 && gamesStarted);
    }

    return this._playingOrDidPlay;
  }
}

class Entry extends RootClass {
  constructor(rootValue, playerInfo) {
    super(rootValue);

    this.id = playerInfo.entry;
    this.name = playerInfo.player_name;
    this.teamName = playerInfo.entry_name;

    this._entryPicksMap = new Map();
    this._previousEntryPicksMap = new Map();
  }

  entryPicks(week) {
    if (!this._entryPicksMap.has(week)) {
      this._entryPicksMap.set(
        week,
        this.resources.events.getWeek(week)
          .then(weekNo => this.resources.entryPicks.getEntryPicks(this.id, weekNo)),
      );
    }

    return this._entryPicksMap.get(week);
  }

  previousEntryPicks(week) {
    if (!this._previousEntryPicksMap.has(week)) {
      this._previousEntryPicksMap.set(
        week,
        this.resources.events.getWeek(week)
          .then(weekNo => this.resources.entryPicks.getEntryPicks(this.id, weekNo - 1)),
      );
    }

    return this._previousEntryPicksMap.get(week);
  }

  activeChip() {
    if (!this._activeChip) {
      this._activeChip = this.entryPicks(this.args.week)
        .then(entryPicks => entryPicks.active_chip);
    }

    return this._activeChip;
  }

  transferCost() {
    if (!this._transferCost) {
      this._transferCost = this.entryPicks(this.args.week)
        .then(entryPicks => entryPicks.entry_history.event_transfers_cost);
    }

    return this._transferCost;
  }

  previousTotal() {
    if (!this._previousTotal) {
      this._previousTotal = this._getPreviousTotal();
    }

    return this._previousTotal;
  }

  async _getPreviousTotal() {
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

  players() {
    if (!this._players) {
      this._players = this.entryPicks(this.args.week)
        .then(({ picks = [] }) => picks);
    }

    return this._players;
  }

  picksAndSubs() {
    if (!this._picksAndSubs) {
      this._picksAndSubs = this._getPicksAndSubs();
    }

    return this._picksAndSubs;
  }

  async _getPicksAndSubs() {
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

  picks() {
    if (!this._picks) {
      this._picks = this.picksAndSubs()
        .then(({ picks }) => picks.map(pick => pick.element));
    }

    return this._picks;
  }

  subs() {
    if (!this._subs) {
      this._subs = this.picksAndSubs()
        .then(({ subs }) => subs.map(pick => pick.element));
    }

    return this._subs;
  }

  captain() {
    if (!this._captain) {
      this._captain = this.players()
        .then(players => (players.find(player => player.is_captain) || {}).element);
    }

    return this._captain;
  }

  viceCaptain() {
    if (!this._viceCaptain) {
      this._viceCaptain = this.players()
        .then(players => (players.find(player => player.is_vice_captain) || {}).element);
    }

    return this._viceCaptain;
  }

  playerPointsMultiplied() {
    if (!this._playerPointsMultiplied) {
      this._playerPointsMultiplied = this.players()
        .then(players => (players.find(player => player.multiplier > 1) || {}).element);
    }

    return this._playerPointsMultiplied;
  }

  multiplier() {
    if (!this._multiplier) {
      this._multiplier = this.activeChip()
        .then((activeChip) => {
          if (activeChip === '3xc') {
            return 3;
          }

          return 2;
        });
    }

    return this._multiplier;
  }

  currentPoints() {
    if (!this._currentPoints) {
      this._currentPoints = this._getCurrentPoints();
    }

    return this._currentPoints;
  }

  async _getCurrentPoints() {
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
    const pointsArray = await Promise.all(picks.map(id => (this.allPlayers(id)).points()));

    return pointsArray.reduce((currentPoints, point, i) => {
      if (i === multiplierIndex) {
        return currentPoints + (multiplier * point);
      }

      return currentPoints + point;
    }, 0);
  }

  projections() {
    if (!this._projections) {
      this._projections = this._getProjections();
    }

    return this._projections;
  }

  async _getProjections() {
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

    const captain = this.allPlayers(captainId);
    const viceCaptain = this.allPlayers(viceCaptainId);

    if (await captain.didntPlay(this.args.projectionMinute) && await viceCaptain.playingOrDidPlay()) {
      projections.playerPointsMultiplied = viceCaptainId;
    }

    // If the subs length is 0, there are no subs to be made, so no need to check further
    if (subIds.length === 0) {
      return projections;
    }

    const picks = pickIds.map(id => this.allPlayers(id));
    const subs = subIds.map(id => this.allPlayers(id));

    // Much easier to work the logic of goalkeepers separately
    const gk = picks.shift();
    const gkSub = subs.shift();

    if ((await gk.didntPlay(this.args.projectionMinute)) && await (gkSub.playingOrDidPlay())) {
      projections.autoSubsOut.push(gk.id);
      projections.autoSubsIn.push(gkSub.id);
    }

    const potentialSubsOut = await Promise.all(returnPickIfDidntPlay(picks, this.args.projectionMinute))
      .then(potentialSubs => potentialSubs.filter(potentialSub => !!potentialSub));

    for (let i = 0, picksLength = potentialSubsOut.length; i < picksLength; i++) {
      const pick = potentialSubsOut[i];

      const remainingSubs = subs.filter(sub => !projections.autoSubsIn.includes(sub.id));

      // If there are valid substitutions left
      if (remainingSubs.length > 0) {
        for (let j = 0, len = remainingSubs.length; j < len; j++) {
          const potentialSub = remainingSubs[j];

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

class RootClass2 extends RootClass {
  constructor(rootValue) {
    super(rootValue);

    this._allPlayers = new Map();
    this._allEntries = new Map();
  }

  allPlayers = (id) => {
    if (!this._allPlayers.has(id)) {
      this._allPlayers.set(id, new Player(this, id));
    }

    return this._allPlayers.get(id);
  };

  allEntries = (playerInfo) => {
    if (!this._allEntries.has(playerInfo.entry)) {
      this._allEntries.set(playerInfo.entry, new Entry(this, playerInfo));
    }

    return this._allEntries.get(playerInfo.entry);
  };
}

class ClassicLeague extends RootClass2 {
  leagueInfo() {
    return new ClassicLeagueInfo(this);
  }

  async entries() {
    if (!this._entries) {
      this._entries = this._getEntries();
    }

    return this._entries;
  }

  async _getEntries() {
    if (!this._entries) {
      const players = await this.resources.classicLeagueStandings.getPlayersInfo(this.args.leagueId);

      this._entries = players.map(playerInfo => this.allEntries(playerInfo));
    }

    return this._entries;
  }

  async playerIds() {
    const entries = await this.entries();
    const newEntries = await Promise.all(entries.map(async entry => (await entry.players()).map(player => player.element)));
    const rawPicks = newEntries.reduce((flattenedArray, currentValue) => flattenedArray.concat(currentValue), []);

    return Array.from(new Set(rawPicks))
      .sort(numberSort);
  }

  async players() {
    const picks = await this.playerIds();

    return picks.map(id => this.allPlayers(id));
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

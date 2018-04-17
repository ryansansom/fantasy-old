import RootValue from './base';
import { expectedElapsedTime, getPlayerBP } from '../helpers/get-players';

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

export default class Player extends RootValue {
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

import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import RootValue from './base';

function returnPickIfDidntPlay(potentialSubs, projectionMinute) {
  return potentialSubs.map(pick => pick.didntPlay(projectionMinute)
    .then((didntPlay) => {
      if (!didntPlay) return null;

      return pick;
    }));
}

const minElementTypes = {
  1: 1,
  2: 3,
  3: 2,
  4: 1,
};

const projectionType = new GraphQLObjectType({
  name: 'projection',
  fields: {
    autoSubsOut: { type: new GraphQLList(GraphQLInt) },
    autoSubsIn: { type: new GraphQLList(GraphQLInt) },
    playerPointsMultiplied: { type: GraphQLInt },
  },
});

export const entryType = new GraphQLObjectType({
  name: 'entry',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    teamName: { type: GraphQLString },
    activeChip: { type: GraphQLString },
    transferCost: { type: GraphQLInt },
    previousTotal: { type: GraphQLInt },
    picks: { type: new GraphQLList(GraphQLInt) },
    subs: { type: new GraphQLList(GraphQLInt) },
    captain: { type: GraphQLInt },
    viceCaptain: { type: GraphQLInt },
    playerPointsMultiplied: { type: GraphQLInt },
    multiplier: { type: GraphQLInt },
    currentPoints: { type: GraphQLInt },
    projections: { type: projectionType },
  },
});

export default class Entry extends RootValue {
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

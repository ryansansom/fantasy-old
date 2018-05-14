import { createSelector } from 'reselect';
import {
  FETCH_ERROR,
  COLUMNS,
  PAGE,
  LEAGUES,
  OPEN_MODAL,
  CLOSE_MODAL,
  UPDATE_CLASSIC_LEAGUE,
  CLASSIC_LEAGUE_UPDATING,
} from '../actions';
import * as playerListConfig from '../../lib/table-config/player-list';
import * as classicTableConfig from '../../lib/table-config/classic-table';
import teams from '../../constants/teams';

function updateClassicStandings(standings) {
  standings.updating = false;

  return {
    [standings.leagueId]: standings,
  };
}

function classicStandingsUpdating(classicLeagues, leagueId) {
  return {
    ...classicLeagues,
    [leagueId]: {
      ...classicLeagues[leagueId],
      updating: true,
    },
  };
}

function rootReducer(state, action) {
  switch (action.type) {
    case PAGE:
      return Object.assign({}, state, {
        fetchError: false,
        page: action.page,
      });
    case FETCH_ERROR:
      return Object.assign({}, state, {
        fetchError: true,
      });
    case CLASSIC_LEAGUE_UPDATING:
      return Object.assign({}, state, {
        classicLeagues: classicStandingsUpdating(state.classicLeagues, action.value),
      });
    case UPDATE_CLASSIC_LEAGUE:
      return Object.assign({}, state, {
        classicLeagues: {
          ...state.classicLeagues,
          ...updateClassicStandings(action.value),
        },
      });
    case COLUMNS: {
      const tableCols = action.value.tableCols
        ? {
          tableCols: [...action.value.tableCols],
        }
        : {};

      const playerCols = action.value.playerCols
        ? {
          playerCols: [...action.value.playerCols],
        }
        : {};

      return Object.assign({}, state, tableCols, playerCols);
    }
    case LEAGUES:
      return Object.assign({}, state, {
        leaguesList: action.value,
      });
    case OPEN_MODAL:
      return Object.assign({}, state, {
        modalOpen: action.name,
      });
    case CLOSE_MODAL:
      return Object.assign({}, state, {
        modalOpen: '',
      });
    default:
      return state;
  }
}

export default rootReducer;

function buildConfigFromProps(config, arr) {
  if (arr[0] && arr[0].func) return arr;
  return arr.map((cfg) => {
    const matchKey = Object.keys(config).find(cfgKey => config[cfgKey].header === cfg.header);
    return config[matchKey];
  });
}

const getPlayerColumns = state => state.playerCols;
const getTableColumns = state => state.tableCols;
export const getFetchError = state => state.fetchError;
export const getPage = state => state.page;
export const getLeagueStandings = (state, { leagueId }) => state.classicLeagues[leagueId] || {};
export const getEntryId = (state, { entryId }) => entryId;
export const getPlayerId = (state, { playerId }) => playerId;
export const getIndex = (state, { index }) => index;

export const getLastUpdated = createSelector(
  getLeagueStandings,
  standings => standings.lastUpdated,
);
export const getUpdatingStatus = createSelector(
  getLeagueStandings,
  standings => standings.updating,
);
export const getClassicLeagueName = createSelector(
  getLeagueStandings,
  standings => standings.leagueName,
);
export const getEntries = createSelector(
  getLeagueStandings,
  standings => (standings.players || []).sort((a, b) => (b.prevTotal + b.projectedPoints) - (a.prevTotal + a.projectedPoints)),
);
export const getEntriesIds = createSelector(
  getEntries,
  entries => entries.map(entry => entry.entry),
);
export const getEntry = createSelector(
  [getEntries, getEntryId],
  (entries, entryId) => entries.find(entry => entry.entry === entryId),
);
export const getEntryPlayerById = createSelector(
  [getEntry, getPlayerId],
  (entry, playerId) => entry.players.picks.concat(entry.players.subs).find(player => player.element === playerId),
);

export const hasEntries = createSelector(
  getEntries,
  entries => entries.length > 0,
);

export const getListConfig = createSelector(
  getPlayerColumns,
  playerCols => buildConfigFromProps(playerListConfig, playerCols),
);

export const getTableConfig = createSelector(
  getTableColumns,
  tableCols => buildConfigFromProps(classicTableConfig, tableCols),
);

const getTableConfigData = (entry, header, index = 0) => {
  switch (header) {
    case 'Position':
      return index + 1;
    case 'Player':
      return entry.player_name;
    case 'Previous Total':
      return entry.prevTotal;
    case 'Current Points':
      return entry.currentPoints;
    case 'Projected Points':
      return entry.projectedPoints;
    case 'Current Total':
      return entry.prevTotal + entry.currentPoints;
    case 'Projected Total':
      return entry.prevTotal + entry.projectedPoints;
    case 'Team Name':
      return entry.team_name;
    case 'Transfer Cost':
      return -1 * entry.event_transfers_cost;
    case 'Captain':
      return (entry.players.picks.find(pick => pick.is_captain) || entry.players.subs.find(pick => pick.is_captain)).name;
    case 'Vice Captain':
      return (entry.players.picks.find(pick => pick.is_vice_captain) || entry.players.subs.find(pick => pick.is_vice_captain)).name;
    case 'Active Chip':
      return entry.active_chip;
    case 'Players Played':
      return entry.players.picks.filter(pick => !!pick.game_finished).length;
    case 'Players Playing':
      return entry.players.picks.filter(pick => pick.game_started && !pick.game_finished).length;
    case 'Players To Play':
      return entry.players.picks.filter(pick => !pick.game_started).length;
    case 'Played status': {
      const toPlay = entry.players.picks.filter(pick => !pick.game_started).length;
      const inPlay = entry.players.picks.filter(pick => pick.game_started && !pick.game_finished).length;
      const played = entry.players.picks.filter(pick => !!pick.game_finished).length;

      return `${played} / ${inPlay} / ${toPlay}`;
    }
    case 'EP This':
      return entry.ep_this;
    case 'EP Next':
      return entry.ep_next;
    default:
      return null;
  }
};

const getPlayerConfigData = (player, header) => {
  switch (header) {
    case 'Position': {
      switch (player.element_type) {
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
    case 'Player': {
      let appendName = '';
      if (player.is_captain) {
        appendName = ' (C)';
      } else if (player.is_vice_captain) {
        appendName = ' (V)';
      }

      return player.name + appendName;
    }
    case 'Points':
      return player.points * player.multiplier;
    case 'Bonus Points': {
      if (player.game_points_finalised) {
        return player.actual_bonus > 0 ? `${player.actual_bonus} (incl.)` : 0;
      } else if (player.actual_bonus) {
        return `${player.provisional_bonus + player.actual_bonus} (${player.actual_bonus} incl.)`;
      }
      return player.provisional_bonus;
    }
    case 'Min. Played':
      return player.minutes_played;
    case 'Auto Sub?': {
      if (player.autoSub_out) {
        return 'OUT';
      } else if (player.autoSub_in) {
        return 'IN';
      }
      return '';
    }
    case 'Team':
      return teams[player.team - 1] || '';
    case 'EP This':
      return player.ep_this;
    case 'EP Next':
      return player.ep_next;
    default:
      return null;
  }
};

export const getTableConfigWithData = createSelector(
  [getTableConfig, getEntry, getIndex],
  (tableCols, entry, index) => tableCols.map(col => ({
    ...col,
    data: getTableConfigData(entry, col.header, index),
  })),
);

export const getPlayerConfigWithData = createSelector(
  [getListConfig, getEntryPlayerById],
  (listCols, player) => listCols.map(col => ({
    ...col,
    data: getPlayerConfigData(player, col.header),
  })),
);

export const getPlayers = createSelector(
  getEntry,
  entry => entry.players,
);

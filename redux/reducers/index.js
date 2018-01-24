import { createSelector } from 'reselect';
import {
  UPDATING,
  REAL_DATA,
  FETCH_ERROR,
  COLUMNS,
  PAGE,
  LEAGUES,
  OPEN_MODAL,
  CLOSE_MODAL,
} from '../actions';
import * as playerListConfig from '../../lib/table-config/player-list';
import * as classicTableConfig from '../../lib/table-config/classic-table';

function rootReducer(state, action) {
  switch (action.type) {
    case UPDATING:
      return Object.assign({}, state, {
        updating: true,
        fetchError: false,
        page: action.page,
      });
    case PAGE:
      return Object.assign({}, state, {
        updating: true,
        fetchError: false,
        page: action.page,
      });
    case FETCH_ERROR:
      return Object.assign({}, state, {
        fetchError: true,
      });
    case REAL_DATA:
      return Object.assign({}, state, {
        updating: false,
        standings: action.value,
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
        updating: false,
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

export const getListConfig = createSelector(
  getPlayerColumns,
  playerCols => buildConfigFromProps(playerListConfig, playerCols),
);

export const getTableConfig = createSelector(
  getTableColumns,
  tableCols => buildConfigFromProps(classicTableConfig, tableCols),
);

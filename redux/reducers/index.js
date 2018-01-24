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

import {
  UPDATING,
  REAL_DATA,
  FETCH_ERROR,
  COLUMNS,
  PAGE,
  LEAGUES,
} from '../actions';

function rootReducer(state, action) {
  switch (action.type) {
    case UPDATING:
      return Object.assign({}, state, {
        updating: true,
        fetchError: false,
        page: action.page,
        standings: {},
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
    case COLUMNS:
      return Object.assign({}, state, {
        columns: action.value,
      });
    case LEAGUES:
      return Object.assign({}, state, {
        updating: false,
        leaguesList: action.value,
      });
    default:
      return state;
  }
}

export default rootReducer;

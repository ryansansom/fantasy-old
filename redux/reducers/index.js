import {
  UPDATING,
  REAL_DATA,
  OPEN_MODAL,
  CLOSE_MODAL,
  FETCH_ERROR,
  COLUMNS,
  PAGE,
  LEAGUES
} from '../actions';

const initialState = {
  fetchError: false,
  updating: false
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATING:
      return Object.assign({}, state, {
        updating: true,
        fetchError: false,
        page: action.page
      });
    case PAGE:
      return Object.assign({}, state, {
        updating: true,
        fetchError: false,
        page: action.page
      });
    case FETCH_ERROR:
      return Object.assign({}, state, {
        fetchError: true
      });
    case REAL_DATA:
      return Object.assign({}, state, {
        updating: false,
        standings: action.value
      });
    case OPEN_MODAL:
      return Object.assign({}, state, {
        modalOpen: action.value
      });
    case CLOSE_MODAL:
      return Object.assign({}, state, {
        modalOpen: ''
      });
    case COLUMNS:
      return Object.assign({}, state, {
        columns: action.value
      });
    case LEAGUES:
      return Object.assign({}, state, {
        updating: false,
        leaguesList: action.value
      });
    default:
      return state
  }
}

export default rootReducer;

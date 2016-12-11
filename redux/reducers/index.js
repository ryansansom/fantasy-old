import { INCREMENT, DECREMENT, NEWCOUNT, UPDATING, REAL_DATA, OPEN_MODAL, CLOSE_MODAL, COLUMNS, PAGE, LEAGUES } from '../actions';

const initialState = {
  count: 0,
  updating: false
};

function counterApp(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return Object.assign({}, state, {
        count: state.count + 1,
        updating: false
      });
    case DECREMENT:
      return Object.assign({}, state, {
        count: state.count - 1,
        updating: false
      });
    case NEWCOUNT:
      return Object.assign({}, state, {
        count: action.value,
        updating: false
      });
    case UPDATING:
      return Object.assign({}, state, {
        updating: true,
        page: action.page
      });
    case PAGE:
      return Object.assign({}, state, {
        page: action.page
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

export default counterApp;

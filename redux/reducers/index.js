import { INCREMENT, DECREMENT, NEWCOUNT, UPDATING, REAL_DATA, OPEN_MODAL, CLOSE_MODAL, COLUMNS } from '../actions';

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
      console.log('RS2016', action.value);
      return Object.assign({}, state, {
        columns: action.value
      });
    default:
      return state
  }
}

export default counterApp;

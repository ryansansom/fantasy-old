import { INCREMENT, DECREMENT, NEWCOUNT } from '../actions'
import { combineReducers } from 'redux';

const initialState = {
  count: 0
};

function counterApp(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return Object.assign({}, state, {
        count: state.count + 1
      });
    case DECREMENT:
      return Object.assign({}, state, {
        count: state.count - 1
      });
    case NEWCOUNT:
      return Object.assign({}, state, {
        count: action.value
      });
    default:
      return state
  }
}

export default counterApp;

import { INCREMENT, DECREMENT, NEWCOUNT, UPDATING } from '../actions';

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
    default:
      return state
  }
}

export default counterApp;

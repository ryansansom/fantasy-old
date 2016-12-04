export const INCREMENT = 'increment';
export const DECREMENT = 'decrement';
export const NEWCOUNT = 'newcount';
export const UPDATING = 'updating';
export const REAL_DATA = 'realData';
export const OPEN_MODAL = 'openModal';
export const CLOSE_MODAL = 'closeModal';
export const COLUMNS = 'columns';

export function increment() {
  return { type: INCREMENT }
}

export function decrement() {
  return { type: DECREMENT }
}

export function modalState(modalName, type = 'OPEN', action) {
  return (dispatch) => {
    if (type === 'CLOSE') {
      dispatch({ type: CLOSE_MODAL });
    } else {
      dispatch({ type: OPEN_MODAL, value: modalName });
    }

    if (action) {
      action
        .then(cols => {
          dispatch({ type: COLUMNS, value: cols });
        });
    }
  };
}

export function mockFetch(method, page, real = false) {
  return (dispatch) => {
    dispatch({ type: UPDATING, page });
    return method
      .then(res => dispatch({
        type: real ? REAL_DATA : NEWCOUNT,
        value: res
      }));
  }
}

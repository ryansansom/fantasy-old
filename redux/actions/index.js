export const INCREMENT = 'increment';
export const DECREMENT = 'decrement';
export const NEWCOUNT = 'newcount';
export const UPDATING = 'updating';
export const REAL_DATA = 'realData';

export function increment() {
  return { type: INCREMENT }
}

export function decrement() {
  return { type: DECREMENT }
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

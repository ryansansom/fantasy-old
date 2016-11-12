export const INCREMENT = 'increment';
export const DECREMENT = 'decrement';
export const NEWCOUNT = 'newcount';
export const UPDATING = 'updating';

export function increment() {
  return { type: INCREMENT }
}

export function decrement() {
  return { type: DECREMENT }
}

export function mockFetch(method, page) {
  return (dispatch) => {
    dispatch({ type: UPDATING, page });
    return method
      .then(res => dispatch({
        type: NEWCOUNT,
        value: res
      }));
  }
}

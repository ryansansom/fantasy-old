export const INCREMENT = 'increment';
export const DECREMENT = 'decrement';
export const NEWCOUNT = 'newcount';

export function increment() {
  return { type: INCREMENT }
}

export function decrement() {
  return { type: DECREMENT }
}

export function mockFetch(method) {
  return (dispatch) => {
    return method
      .then(res => dispatch({
        type: NEWCOUNT,
        value: res
      }));
  }
}

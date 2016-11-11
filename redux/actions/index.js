export const INCREMENT = 'increment';
export const DECREMENT = 'decrement';
export const NEWCOUNT = 'newcount';

export function increment() {
  return { type: INCREMENT }
}

export function decrement() {
  return { type: DECREMENT }
}

export function mockFetch() {
  return (dispatch) => {
    return new Promise(function(resolve) {
      // A slow mock async action using setTimeout
      setTimeout(function() { resolve(10); }, 3000);
    })
      .then(res => dispatch({
        type: NEWCOUNT,
        value: res
      }));
  }
}

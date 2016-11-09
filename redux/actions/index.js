export const INCREMENT = 'increment';
export const DECREMENT = 'decrement';

export function increment() {
  return { type: INCREMENT }
}

export function decrement() {
  return { type: DECREMENT }
}

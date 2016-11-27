export function getLength(config) {
  return config.reduce((prev, curr) => prev + (curr.colSpan ? curr.colSpan : 1), 0);
}

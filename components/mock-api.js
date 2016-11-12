// Only a function to get a new instance of the promise each time - to be removed/used for testing.
export function mockAPI(value) {
  return new Promise(function(resolve) {
    // A slow mock async action using setTimeout
    setTimeout(function() { resolve(value); }, 3000);
  });
}

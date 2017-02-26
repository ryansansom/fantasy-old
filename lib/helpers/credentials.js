import fs from 'fs';
import path from 'path';

// Synchronously accessing the token via the file system does provide an overhead but as the only piece of mutable data,
// this is currently preferable to creating a DB or similar in the short term - one to revisit in future.

export function getAuthHeader() {
  return fs.readFileSync(path.resolve(__dirname, 'auth-token'), 'utf8');
}

export function updateAuthHeader(token) {
  fs.writeFileSync(path.resolve(__dirname, 'auth-token'), token);
}

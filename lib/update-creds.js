import bcrypt from 'bcrypt';
import fetch from 'isomorphic-fetch';
import fs from 'fs';
import path from 'path';

export default async function(login, password, authCode) {
  const compareHash = '$2a$08$mYIp34M8ML2bgbXNRGrhyObPzArgeUYBNaGqSRn7FjYbOt/5TaSau';
  const authCodeValid = await bcrypt.compare(authCode, compareHash);

  if (authCodeValid) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login,
        client_id: 'app-mobile-ios',
        client_secret: '70874be888c8497ebb69e8925701c8fdeb1495b658c442c790a6cea2efe59cf9e5c995f028f641e4b0c01f22208c7f0ff00d462fb7954ae2a787561066e48a9e',
        password,
      })
    };

    return fetch('https://users.premierleague.com/api/accounts/login/', options)
      .then(res => {
        if (res.status !== 200) {
          const statusError = new Error('Status code not expected. Expected 200, got '+ res.status);
          statusError.status = res.status;

          throw statusError;
        }
        return res.json();
      })
      .then((body = {}) => {
        if (body.access_token) {
          fs.writeFileSync(path.resolve(__dirname, 'helpers/test-creds.js'), newFileContents(body.access_token));
          return body.access_token;
        } else {
          const bodyError = new Error('Response body not as expected, got ' + body);
          bodyError.status = 400;

          throw bodyError;
        }
      });
  }

  const authError = new Error('Invalid authorisation code');
  authError.status = 403;

  throw authError;
}

function newFileContents(token) {
  return `export const authHeader = '${token}';\nexport const clientKey = '43f0c9a3e162417c9e6744032276c8d2';\n`;
}

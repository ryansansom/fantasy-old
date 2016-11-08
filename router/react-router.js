import { compile } from 'pug';
import fs from 'fs';
import path from 'path';

import React from 'react';
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router';

const layoutLoc = path.join(__dirname, '../views/new.pug');
const masterLayout = fs.readFileSync(layoutLoc, 'utf8');
const layoutFunc = compile(masterLayout, {filename: layoutLoc});
import newRoutes from './routes';

export default (req, res) => {
  let templateLocals = {};
  match({routes: newRoutes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      templateLocals.content = renderToString(<RouterContext {...renderProps} />);
      templateLocals.title = `Test`;

      res.status(200).send(layoutFunc(templateLocals));
    } else {
      templateLocals.title = 'Test not found';
      res.status(404).send('Not found')
    }
  })
}

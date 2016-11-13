import { compile } from 'pug';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import counterApp from '../../redux/reducers';

const layoutLoc = path.join(__dirname, '../../views/layout.pug');
const masterLayout = fs.readFileSync(layoutLoc, 'utf8');
const layoutFunc = compile(masterLayout, {filename: layoutLoc});

export default (req, res) => {
  let templateLocals = {};
  match({routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      const { components } = renderProps;
      let store = createStore(counterApp, applyMiddleware(thunkMiddleware));
      const options = { leagueID: renderProps.params.leagueID };
      components[components.length - 1].fetchData(store.dispatch, options)
        .then(() => {
          const state = store.getState();
          templateLocals.title = state.page; // Page title on server rendered page only
          templateLocals.reduxState = JSON.stringify(state);
          templateLocals.content = renderToString(
            <Provider store={store}>
              <RouterContext {...renderProps} />
            </Provider>);

          res.status(200).send(layoutFunc(templateLocals));
        });
    } else {
      templateLocals.title = 'Page not found';
      res.status(404).send('Page not found')
    }
  })
}

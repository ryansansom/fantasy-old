import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import rootReducer from '../../redux/reducers';

const content = document.getElementById('content');
const reduxState = JSON.parse(document.documentElement.getAttribute('redux-state'));
const composeEnhancers = process.env.NODE_ENV !== 'production'
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-underscore-dangle
  : compose;

const store = createStore(
  rootReducer,
  reduxState,
  composeEnhancers(applyMiddleware(thunkMiddleware)),
);

ReactDOM.hydrate(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  content,
);

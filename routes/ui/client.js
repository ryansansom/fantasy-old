import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import rootReducer from '../../redux/reducers';

const content = document.getElementById('content');
const reduxState = JSON.parse(document.documentElement.getAttribute('redux-state'));
const store = createStore(rootReducer, reduxState, applyMiddleware(thunkMiddleware));

ReactDOM.hydrate(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  content,
);

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import counterApp from '../../redux/reducers';
import thunkMiddleware from 'redux-thunk';

const content = document.getElementById('content');
const reduxState = JSON.parse(document.documentElement.getAttribute('redux-state'));
const store = createStore(counterApp, reduxState, applyMiddleware(thunkMiddleware));

ReactDOM.render(<Provider store={store}>
  <Router history={browserHistory} routes={routes} />
                </Provider>, content);

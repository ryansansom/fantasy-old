import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import counterApp from '../../redux/reducers';

let content = document.getElementById('content');
let store = createStore(counterApp);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>, content);

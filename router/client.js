import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import newRoutes from './routes';

// main contents </div>
let content = document.getElementById('content');

// Create application centralised data - include this when we have some app data
//import parseSafe from '../utils/parse-safe';
//let data = parseSafe(document.getElementById('initial-data').innerHTML, {});

// Start the client-side router using only `pushState`
// with the supplied routes

ReactDOM.render(<Router history={browserHistory} routes={newRoutes} />, content);

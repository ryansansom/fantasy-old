import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from '../../components/App';
import About from '../../components/pages/About';
import Home from '../../components/pages/Home';
import PickLeague from '../../components/pages/pick-league';
import Standings from '../../components/pages/Standings';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={PickLeague}/>
    <Route path="/first" component={Home}/>
    <Route path="/about" component={About}/>
    <Route path="/standings" component={Standings}/>
    <Route path="/standings/:leagueID" component={Standings}/>
  </Route>
)

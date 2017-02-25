import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from '../../components/App';
import PickLeague from '../../components/pages/pick-league';
import Standings from '../../components/pages/Standings';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={PickLeague}/>
    <Route path="/standings" component={Standings}/>
    <Route path="/standings/:leagueID" component={Standings}/>
  </Route>
)

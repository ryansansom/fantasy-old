import { Router } from 'express';
import errHandler from '../async-route-handler';
import getLeagues from '../../lib/get-leagues';
import getPlayers from '../../lib/get-players';
import getPlayerPoints from '../../lib/get-player-points';
import getStandings from '../../lib/get-standings';
import getDetailedStandings from '../../lib/get-detailed-standings';
import getTeamPoints from '../../lib/get-team-points';
import getTotalPoints from '../../lib/get-total-points';
import getNewTotal from '../../lib/get-new-total';
import getWeek from '../../lib/get-week';
import updateCredentials from '../../lib/update-creds';
import { getLatestLeagueList } from '../../helpers/league-list';
import { cookieOptions } from '../../constants/cookie-settings';

const router = Router();

router.get('/leagues', errHandler(async (req, res, next) => { // eslint-disable-line no-unused-vars
  const leagues = await getLeagues(req.query.teamID);
  return res.send(leagues);
}));

router.get('/week', errHandler(async (req, res, next) => { // eslint-disable-line no-unused-vars
  const week = await getWeek();
  return res.send(week);
}));

router.get('/new-classic-league-standings/:leagueID', errHandler(async (req, res, next) => { // eslint-disable-line no-unused-vars
  const detailedStandings = await getDetailedStandings(req.params.leagueID, req.query.week);

  const cookie = getLatestLeagueList(req.cookies.league_list, detailedStandings);
  res.cookie('league_list', JSON.stringify(cookie), cookieOptions);
  return res.send(detailedStandings);
}));

router.get('/classic-league-standings/:leagueID', errHandler(async (req, res, next) => { // eslint-disable-line no-unused-vars
  const standings = await getStandings(req.params.leagueID);
  return res.send(standings);
}));

router.get('/players/:teamID/:week', errHandler(async (req, res, next) => { // eslint-disable-line no-unused-vars
  const players = await getPlayers([req.params.teamID], req.params.week);
  return res.send(players);
}));

router.get('/player-points/:playerID', errHandler(async (req, res, next) => { // eslint-disable-line no-unused-vars
  const playerPoints = await getPlayerPoints([{ element: req.params.playerID, multiplier: 1 }, { element: 174, multiplier: 1 }]);
  return res.send(playerPoints);
}));

router.get('/team-points/:teamID/:week', errHandler(async (req, res, next) => { // eslint-disable-line no-unused-vars
  const teamPoints = await getTeamPoints(req.params.teamID, req.params.week);
  return res.send(teamPoints);
}));

router.get('/total-points/:teamID/:week', errHandler(async (req, res, next) => { // eslint-disable-line no-unused-vars
  const totalPoints = await getTotalPoints(req.params.teamID, req.params.week);
  return res.send(totalPoints);
}));

router.get('/new-total-points/:teamID/:week', errHandler(async (req, res, next) => { // eslint-disable-line no-unused-vars
  const totalPoints = await getNewTotal([req.params.teamID], { id: req.params.week, finished: true });
  return res.send(totalPoints);
}));

router.post('/refresh-credentials', (req, res) => {
  const { username, password, authCode } = req.body;
  updateCredentials(username, password, authCode)
    .then(() => {
      res.format({
        html() {
          return res.redirect('/');
        },
        json() {
          res.send({});
        },
      });
    })
    .catch((err) => {
      res.format({
        html() {
          return res.redirect('/refresh-credentials');
        },
        json() {
          res.send(err);
        },
      });
    });
});

export default router;

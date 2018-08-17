import { generateLeagues } from '../../helpers/league-list';
import classicStyleStandingsBackwardsCompatibility from '../../lib/helpers/classic-standings-backwards-compatibility';

export const FETCH_ERROR = 'fetchError';
export const COLUMNS = 'columns';
export const PAGE = 'page';
export const LEAGUES = 'leagueList';
export const OPEN_MODAL = 'openModal';
export const CLOSE_MODAL = 'closeModal';
export const UPDATE_CLASSIC_LEAGUE = 'updateClassicLeague';
export const CLASSIC_LEAGUE_UPDATING = 'classicLeagueUpdating';

export function updateCols(cols) {
  return (dispatch) => {
    dispatch({ type: COLUMNS, value: cols });
  };
}

export function updatePage(page) {
  return (dispatch) => {
    dispatch({ type: PAGE, page });
    return Promise.resolve();
  };
}

const classicStyleLeagueQuery = 'query ($leagueId: Int, $draft: Boolean) { classicStyleLeague(leagueId: $leagueId, draft: $draft) { leagueInfo { id name gameweekEnded lastUpdated } entries { id name teamName activeChip transferCost previousTotal picks subs captain viceCaptain playerPointsMultiplied multiplier currentPoints projections { autoSubsOut autoSubsIn playerPointsMultiplied } } players { id points team position name expectedPoints expectedPointsNext actualBonus provisionalBonus gamesStarted gamesFinished pointsFinalised minutesPlayed } } }';

export function fetchStandings(method, leagueId, leagueType) {
  return (dispatch, getState) => {
    dispatch({
      type: CLASSIC_LEAGUE_UPDATING,
      value: leagueId,
    });

    return method(classicStyleLeagueQuery, { leagueId, draft: leagueType === 'draft' })
      .then(classicStyleStandingsBackwardsCompatibility)
      .then((res) => {
        const { leaguesList } = getState();
        const returnValue = {
          leagueList: {
            leagueId: Number(leagueId),
            leagueType,
            leagueName: res.leagueName,
          },
        };

        if (leaguesList) {
          dispatch({
            type: LEAGUES,
            value: generateLeagues(leaguesList, returnValue.leagueList),
          });
        }

        dispatch({
          type: UPDATE_CLASSIC_LEAGUE,
          value: res,
        });

        return returnValue;
      })
      .catch(() => dispatch({ type: FETCH_ERROR }));
  };
}

export function leagueList(method) {
  return dispatch => method
    .then(res => dispatch({
      type: LEAGUES,
      value: res,
    }))
    .catch(() => dispatch({ type: FETCH_ERROR }));
}

export function openModal(name) {
  return (dispatch) => {
    dispatch({ type: OPEN_MODAL, name });
  };
}

export function closeModal() {
  return (dispatch) => {
    dispatch({ type: CLOSE_MODAL });
  };
}

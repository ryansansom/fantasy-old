export const UPDATING = 'updating';
export const REAL_DATA = 'realData';
export const FETCH_ERROR = 'fetchError';
export const COLUMNS = 'columns';
export const PAGE = 'page';
export const LEAGUES = 'leagueList';

export function updateCols(cols) {
  return { type: COLUMNS, value: cols }
}

export function updatePage(page) {
  return (dispatch) => {
    dispatch({ type: PAGE, page });
    return Promise.resolve();
  }
}

export function fetchStandings(method, page) {
  return (dispatch) => {
    dispatch({ type: UPDATING, page });
    return method
      .then(res => {
        return dispatch({
          type: REAL_DATA,
          value: res
        })
      })
      .catch(() => dispatch({ type: FETCH_ERROR }));
  }
}

export function leagueList(method, page) {
  return (dispatch) => {
    dispatch({ type: PAGE, page });
    return method
      .then(res => dispatch({
        type: LEAGUES,
        value: res
      }))
      .catch(() => dispatch({ type: FETCH_ERROR }));
  }
}

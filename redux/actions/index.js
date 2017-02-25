export const UPDATING = 'updating';
export const REAL_DATA = 'realData';
export const OPEN_MODAL = 'openModal';
export const CLOSE_MODAL = 'closeModal';
export const FETCH_ERROR = 'fetchError';
export const COLUMNS = 'columns';
export const PAGE = 'page';
export const LEAGUES = 'leagueList';

export function updateCols(cols) {
  return { type: COLUMNS, value: cols }
}

export function modalState(modalName, type = 'OPEN', action) {
  return (dispatch) => {
    if (type === 'CLOSE') {
      dispatch({ type: CLOSE_MODAL });
    } else {
      dispatch({ type: OPEN_MODAL, value: modalName });
    }

    if (action) {
      action
        .then(() => true)
        .catch(err => err);
    }
  };
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

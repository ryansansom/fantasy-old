export const UPDATING = 'updating';
export const REAL_DATA = 'realData';
export const FETCH_ERROR = 'fetchError';
export const COLUMNS = 'columns';
export const PAGE = 'page';
export const LEAGUES = 'leagueList';
export const OPEN_MODAL = 'openModal';
export const CLOSE_MODAL = 'closeModal';

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

export function fetchStandings(method, page) {
  return (dispatch) => {
    dispatch({ type: UPDATING, page });
    return method
      .then(res => dispatch({
        type: REAL_DATA,
        value: res,
      }))
      .catch(() => dispatch({ type: FETCH_ERROR }));
  };
}

export function leagueList(method, page) {
  return (dispatch) => {
    dispatch({ type: PAGE, page });
    return method
      .then(res => dispatch({
        type: LEAGUES,
        value: res,
      }))
      .catch(() => dispatch({ type: FETCH_ERROR }));
  };
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

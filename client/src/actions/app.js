import {createAction} from 'redux-actions';
import axios from 'axios';

export const FETCH_APP_REQUEST = 'FETCH_APP_REQUEST';
export const FETCH_APP_SUCCESS = 'FETCH_APP_SUCCESS';
export const FETCH_APP_FAILURE = 'FETCH_APP_FAILURE';

export const RESET_STORE_AT_KEY = 'RESET_STORE_AT_KEY';

const fetchIndexRequest = createAction(FETCH_APP_REQUEST);
const fetchIndexSuccess = createAction(FETCH_APP_SUCCESS);
const fetchIndexFailure = createAction(FETCH_APP_FAILURE);

export const fetchApp = () => async (dispatch) => {
  dispatch(fetchIndexRequest());

  let response;

  try {
    response = await axios.get('/v1/index');
  } catch (err) {
    const reducedAction = (err instanceof Error) ? fetchIndexFailure(err) : fetchIndexFailure(err.response);

    return dispatch(reducedAction);
  }

  return dispatch(fetchIndexSuccess(response.data));
};

export const resetStoreAtKey = (key, initialState) => (dispatch) => {
  const resetStoreAtKeyAction = createAction(RESET_STORE_AT_KEY);

  return dispatch(resetStoreAtKeyAction({key, initialState}));
};

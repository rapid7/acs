import {handleActions} from 'redux-actions';
import {
  FETCH_APP_REQUEST,
  FETCH_APP_SUCCESS,
  FETCH_APP_FAILURE
} from '../actions/app';

const appRequest = (state, action) => ({
  ...state,
  request: action
});

const appSuccess = (state, {payload}) => ({
  ...state,
  success: payload
});

const appFailure = (state, {payload}) => ({
  ...state,
  failure: payload
});

export const APP_INITIAL_STATE = {
  request: {},
  success: {},
  failure: {}
};

export default handleActions({
  [FETCH_APP_REQUEST]: appRequest,
  [FETCH_APP_SUCCESS]: appSuccess,
  [FETCH_APP_FAILURE]: appFailure
}, APP_INITIAL_STATE);

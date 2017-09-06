import {handleActions} from 'redux-actions';
import {
  SUBMIT_KMS_SECRET_REQUEST,
  SUBMIT_KMS_SECRET_SUCCESS,
  SUBMIT_KMS_SECRET_FAILURE,
  KMS_INITIAL_STATE
} from './../actions/kms';

const kmsRequest = (state, {payload}) => {
  let keys = payload.keys;

  if (!(keys instanceof Array)) {
    keys = [JSON.parse(keys)];
  }

  return {
    ...state,
    request: {
      ...keys,
      secret: payload.secret
    }
  };
};

const kmsSuccess = (state, {payload}) => {
  const error = payload.filter((key) => key.status === 'ERROR');
  const success = payload.filter((key) => key.status === 'SUCCESS');

  return {
    ...state,
    error,
    success
  };
};

const kmsRequestFailure = (state, {payload}) => {
  const error = {
    text: payload.data,
    status: 'ERROR'
  };

  return {
    ...state,
    failure: [error]
  };
};

export default handleActions({
  [SUBMIT_KMS_SECRET_REQUEST]: kmsRequest,
  [SUBMIT_KMS_SECRET_FAILURE]: kmsRequestFailure,
  [SUBMIT_KMS_SECRET_SUCCESS]: kmsSuccess
}, KMS_INITIAL_STATE);

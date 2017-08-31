import {handleActions} from 'redux-actions';
import {
  SUBMIT_VAULT_SECRET_FAILURE,
  SUBMIT_VAULT_SECRET_REQUEST,
  SUBMIT_VAULT_SECRET_SUCCESS,
  VAULT_INITIAL_STATE
} from '../actions/vault';

const vaultRequest = (state, {payload}) => ({
  ...state,
  request: payload
});

export const vaultSuccess = (state, {payload}) => {
  const data = {
    ...state
  };

  switch (payload.status) {
    case 'SUCCESS':
      data.success = payload;
      break;
    case 'ERROR':
      data.error = payload;
      break;
    default:
      return state;
  }

  return data;
};

const vaultFailure = (state, {payload}) => {
  // Normalize the error coming from Vault/ACS
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
  [SUBMIT_VAULT_SECRET_REQUEST]: vaultRequest,
  [SUBMIT_VAULT_SECRET_SUCCESS]: vaultSuccess,
  [SUBMIT_VAULT_SECRET_FAILURE]: vaultFailure
}, VAULT_INITIAL_STATE);

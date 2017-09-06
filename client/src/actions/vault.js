import {createAction} from 'redux-actions';
import {requestSecret} from './generic';

export const SUBMIT_VAULT_SECRET_REQUEST = 'SUBMIT_VAULT_SECRET_REQUEST';
export const SUBMIT_VAULT_SECRET_SUCCESS = 'SUBMIT_VAULT_SECRET_SUCCESS';
export const SUBMIT_VAULT_SECRET_FAILURE = 'SUBMIT_VAULT_SECRET_FAILURE';

const submitVaultSecretRequest = createAction(SUBMIT_VAULT_SECRET_REQUEST);
const submitVaultSecretSuccess = createAction(SUBMIT_VAULT_SECRET_SUCCESS);
const submitVaultSecretFailure = createAction(SUBMIT_VAULT_SECRET_FAILURE);

export const requestVaultSecret = requestSecret('/v1/vault', submitVaultSecretRequest, submitVaultSecretSuccess, submitVaultSecretFailure);

export const VAULT_INITIAL_STATE = {
  failure: {},
  success: {},
  request: {},
  error: {}
};

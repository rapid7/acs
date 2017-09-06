import {createAction} from 'redux-actions';
import {requestSecret} from './generic';

export const SUBMIT_KMS_SECRET_REQUEST = 'SUBMIT_KMS_SECRET_REQUEST';
export const SUBMIT_KMS_SECRET_SUCCESS = 'SUBMIT_KMS_SECRET_SUCCESS';
export const SUBMIT_KMS_SECRET_FAILURE = 'SUBMIT_KMS_SECRET_FAILURE';

const submitSecretRequest = createAction(SUBMIT_KMS_SECRET_REQUEST);
const submitSecretSuccess = createAction(SUBMIT_KMS_SECRET_SUCCESS);
const submitSecretFailure = createAction(SUBMIT_KMS_SECRET_FAILURE);

export const requestKmsSecret = requestSecret('/v1/kms', submitSecretRequest, submitSecretSuccess, submitSecretFailure);

export const KMS_INITIAL_STATE = {
  failure: {},
  success: {},
  request: {},
  error: {}
};

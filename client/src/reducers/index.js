import {combineReducers} from 'redux';
import kmsReducer from './kms';
import vaultReducer from './vault';
import appReducer from './app';
import {RESET_STORE_AT_KEY} from '../actions/app';

const appReducers = combineReducers({
  kms: kmsReducer,
  app: appReducer,
  vault: vaultReducer
});

export default (state, action) => {
  if (action.type === RESET_STORE_AT_KEY) {
    const key = action.payload.key;
    const initialState = action.payload.initialState;

    return {
      ...state,
      [key]: initialState
    };
  }

  return appReducers(state, action);
};

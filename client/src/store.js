import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';
import reducers from './reducers';

const configureStore = (preloadedState) => createStore(
  reducers,
  preloadedState,
  composeWithDevTools(
    applyMiddleware(thunk, logger)
  )
);

export default configureStore;

import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
import reducers from './reducers';

const configureStore = (preloadedState) => createStore(
  reducers,
  preloadedState,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
);

export default configureStore;

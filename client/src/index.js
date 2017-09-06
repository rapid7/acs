import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import configureStore from './store';
import App from './App';

let store = configureStore({});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

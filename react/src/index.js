import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'cv-lib/assets/css/flexboxgrid.min.css';
import 'cv-lib/assets/css/git-pull.css';
import App from './components/App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoApp from './reducers';
import registerServiceWorker from './registerServiceWorker';
import { ACTORS, ACTIVITIES } from 'cv-lib/constants';

let store = createStore(todoApp, {
  actors: ACTORS,
  activities: ACTIVITIES
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();

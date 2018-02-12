import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger'
import 'cv-lib/assets/css/flexboxgrid.min.css';
import 'cv-lib/assets/css/git-pull.css';
import 'cv-lib/assets/css/cv.css';
import App from './components/App';
import cvReducers from './reducers';
import registerServiceWorker from './registerServiceWorker';
import { ACTORS, ACTIVITIES } from 'cv-lib/constants';
import { availableLanguages, availableActivityTypes } from 'cv-lib/storage';


const logger = createLogger({
  // ...options
});

let store = createStore(cvReducers, {
  actors: ACTORS,
  activities: ACTIVITIES,
  selectedActors: [],
  languages: availableLanguages(ACTIVITIES),
  selectedLanguages: [],
  activityTypes: availableActivityTypes(ACTIVITIES),
  selectedActivityTypes: [],
}, applyMiddleware(logger));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();

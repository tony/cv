import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger'
import 'cv-lib/assets/css/flexboxgrid.min.css';
import 'cv-lib/assets/css/git-pull.css';
import 'cv-lib/assets/css/cv.css';
import 'cv-lib/assets/favicon.ico';
import App from './components/App';
import cvReducers from './reducers';
import registerServiceWorker from './registerServiceWorker';
import { INITIAL_DATA, DEFAULT_SELECTED_FILTERS } from 'cv-lib/constants';
import { activityTypes } from 'cv-lib/constants';
import { filterMap } from 'cv-lib/selectors';


const logger = createLogger({
  // ...options
});

let store = createStore(cvReducers, {
  ...INITIAL_DATA.entities,
  activityTypes: activityTypes,
  selectedActors: [],
  selectedActivityTypes: [],
  selectedFilters: DEFAULT_SELECTED_FILTERS,
  selectedLanguages: [],
  filters: filterMap,

}, applyMiddleware(logger));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();

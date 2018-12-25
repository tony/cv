import React, { Component } from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import "./App.scss";
import { CVActivity } from "./lib/types";
import cvReducers from "./reducers";

import {
  activityTypes,
  INITIAL_DATA,
  DEFAULT_SELECTED_FILTERS
} from "./lib/constants";
import { filterMap } from "./lib/selectors";

const myActivities: Array<CVActivity> = require("./data/my_activities.json");

const logger = createLogger({
  // ...options
});
let store = createStore(
  cvReducers,
  {
    ...INITIAL_DATA.entities,
    activityTypes,
    selectedActors: [],
    selectedActivityTypes: [],
    selectedFilters: DEFAULT_SELECTED_FILTERS,
    selectedLanguages: [],
    filters: filterMap
  },
  applyMiddleware(logger)
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <p>Tony Narlock's CV</p>
            {myActivities.length}
            {myActivities.map((activity, idx) => (
              <p key={idx}>
                On {activity.created_date} Tony {activity.title}
              </p>
            ))}
          </header>
        </div>
      </Provider>
    );
  }
}

export default App;

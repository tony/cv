import React, { Component } from "react";
import { connect } from "react-redux";

import "./App.scss";
import { DEFAULT_SELECTED_FILTERS } from "./lib/constants";
import { CVState, CVActivity } from "./lib/types";

interface IAppState {
  selectedActivityTypes: Array<string>;
  selectedFilters: Array<string>;
  selectedLanguages: Array<string>;
}

class App extends Component<{ activities: Array<CVActivity> }, IAppState> {
  static initialState = {
    selectedActors: [],
    selectedActivityTypes: [],
    selectedFilters: DEFAULT_SELECTED_FILTERS,
    selectedLanguages: []
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Tony Narlock's CV</p>
          {Object.values(this.props.activities).length}
          {Object.values(this.props.activities).map((activity, idx) => (
            <p key={idx}>
              On {activity.created_date} Tony {activity.title}
            </p>
          ))}
        </header>
      </div>
    );
  }
}

export default connect(({ activities }: CVState) => ({
  activities
}))(App);

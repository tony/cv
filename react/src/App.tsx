import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";

import "./App.scss";
import { DEFAULT_SELECTED_FILTERS } from "./lib/constants";
import {
  CVState,
  CVActivity,
  CVActivityType,
  CVActor,
  CVLanguage
} from "./lib/types";

interface IAppState {
  selectedActivityTypes: Array<string>;
  selectedFilters: Array<string>;
  selectedLanguages: Array<string>;
}

interface IAppProps {
  activities: Array<CVActivity>;
  activityTypes: Array<CVActivityType>;
  actors: Array<CVActor>;
  languages: Array<CVLanguage>;
}

class App extends Component<IAppProps, IAppState> {
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
          <Select
            options={Object.values(this.props.languages).map(({ name }) => ({
              value: name,
              label: name
            }))}
            placeholder="Filter by Programming Language(s)"
            isMulti
          />
          <Select
            options={Object.values(this.props.activityTypes).map(
              ({ name }) => ({
                value: name,
                label: name
              })
            )}
            placeholder="Filter by Activity Type(s)"
            isMulti
          />
          <Select
            options={Object.values(this.props.actors).map(({ name }) => ({
              value: name,
              label: name
            }))}
            placeholder="Filter by Place/Organization/Project"
            isMulti
          />

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

export default connect(
  ({ activities, activityTypes, actors, languages }: CVState) => ({
    activities,
    activityTypes,
    actors,
    languages
  })
)(App);

import React, { Component } from "react";
import "./App.scss";
import { CVActivity } from "./lib/types";
import cvReducers from "./reducers";

const myActivities: Array<CVActivity> = require("./data/my_activities.json");

class App extends Component {
  render() {
    return (
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
    );
  }
}

export default App;

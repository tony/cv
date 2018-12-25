import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.scss";
import { CVActivity } from "./lib/types";
import cvReducers from "./reducers";
const path = require("path");
const process = require("process");

const myActivities: Array<CVActivity> = require("./data/my_activities.json");
console.log({ myActivities });

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Tony Narlock's CV</p>
          {myActivities.length}
          {myActivities.map(activity => (
            <p>
              On {activity.created_date} Tony {activity.title}
            </p>
          ))}
        </header>
      </div>
    );
  }
}

export default App;

import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.scss";
const path = require("path");
const process = require("process");

interface IActivity {
  id: string;
  component_name: string;
  created_date: string;
  title: string;
  actor: Number;
}

const myActivities: Array<IActivity> = require("./data/my_activities.json");
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

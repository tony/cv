import React, { Component } from "react";
import { Provider } from "react-redux";

import "./App.scss";
import { CVActivity } from "./lib/types";
import { store } from "./store";

const myActivities: Array<CVActivity> = require("./data/my_activities.json");

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

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

(async () => {
  try {
    const { myActivities } = await import(
      /* webpackChunkName: "myData" */ "../../lib/data"
    );

    console.log({ myActivities });
  } catch (e) {
    console.error(e);
  }
})();

ReactDOM.render(<App />, document.getElementById("root"));

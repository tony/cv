import React from "react";

import { Search } from "../../lib/search";
import { IActivity } from "../../lib/types";

interface IState {
  myActivities: IActivity[];
}

const search = new Search();

const App: React.FC<IState> = () => {
  const [activities, setActivities] = React.useState<IActivity[] | null>([]);
  const fetchActivities = async () => {
    const {
      myActivities,
      myActors,
      myLanguages,
      myActorTypes,
      myActivityTypes
    } = await import(/* webpackChunkName: "myData" */ "../../lib/data");
    setActivities(myActivities as IActivity[]);

    search.setState({
      activities: myActivities,
      activityTypes: myActivityTypes,
      actorTypes: myActorTypes,
      actors: myActors,
      languages: myLanguages
    });
  };
  React.useEffect(() => {
    fetchActivities();
  });

  console.log("renderState", { activities });
  console.log("search data", { searchState: search.data });

  return (
    <div>
      <header>
        {activities &&
          activities.map((activity, idx) => (
            <div key={idx}>{activity.title}</div>
          ))}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;

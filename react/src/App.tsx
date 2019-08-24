import React from "react";
import Select, { Option } from "react-select";

import { Search } from "../../lib/search";
import { IActivity } from "../../lib/types";

interface IState {
  myActivities: IActivity[];
}

const search = new Search();

const useAsyncEffect = (
  effect: (isCanceled: () => boolean) => Promise<void>,
  dependencies?: any[]
) =>
  React.useEffect(() => {
    let canceled = false;
    effect(() => canceled);
    return () => {
      canceled = true;
    };
  }, dependencies);

const App: React.FC<IState> = () => {
  const [activities, setActivities] = React.useState<IActivity[]>([]);
  const fetchActivities = async () => {
    return import(/* webpackChunkName: "myData" */ "../../lib/data");
  };
  useAsyncEffect(async () => {
    const {
      myActivities,
      myActors,
      myLanguages,
      myActorTypes,
      myActivityTypes
    } = await fetchActivities();
    search.setState({
      activities: myActivities,
      activityTypes: myActivityTypes,
      actorTypes: myActorTypes,
      actors: myActors,
      languages: myLanguages
    });
    setActivities(myActivities as IActivity[]);
  });

  if (!activities.length) {
    return (
      <div>
        <header>Loading CV Data</header>
      </div>
    );
  }

  const languageOptions = (((search || {}).data || {}).languages || []).length
    ? (search.data.languages.map(language => ({
        label: language,
        value: language
      })) as Option[])
    : [];
  return (
    <div>
      <header>
        <Select options={languageOptions} />
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

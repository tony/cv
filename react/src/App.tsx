import React from "react";
import Select from "react-select";
import { ActionMeta, OptionProps, ValueType } from "react-select/src/types"; // tslint:disable-line no-submodule-imports

import { Search } from "../../lib/search";
import { ActorLanguage, ActorName, IActivity, IActor } from "../../lib/types";
import { getSelectOptions, onSelectChange } from "./react-select";

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
  const [languages, setLanguages] = React.useState<ActorLanguage[]>([]);
  const [actors, setActors] = React.useState<ActorName[]>([]);
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

    if (languages.length && myActors !== undefined) {
      const updated =
        search.setLenses("languages", languages) ||
        search.setLenses("actors", actors);

      if (updated) {
        setActivities(search.getResults().activities as IActivity[]);
      }
    } else {
      setActivities(myActivities as IActivity[]);
    }
  });

  if (!activities.length) {
    return (
      <div>
        <header>Loading CV Data</header>
      </div>
    );
  }

  const onLanguageChange = onSelectChange(setLanguages);
  const onActorChange = onSelectChange(setActors);

  return (
    <div>
      <header>Tony Narlock's CV</header>
      <Select
        options={getSelectOptions(search.data.languages as string[])}
        isMulti={true}
        onChange={onLanguageChange}
      />
      <Select
        options={getSelectOptions(Object.keys(search.data.actors))}
        isMulti={true}
        onChange={onActorChange}
      />

      {activities &&
        activities.map((activity, idx) => (
          <div key={idx}>{activity.title}</div>
        ))}
    </div>
  );
};

export default App;

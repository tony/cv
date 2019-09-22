import React from "react";
import Select from "react-select";
import { ActionMeta, OptionProps, ValueType } from "react-select/src/types"; // tslint:disable-line no-submodule-imports

import { Search } from "../../lib/search";
import { ActorLanguage, ActorName, IActivity, IActor } from "../../lib/types";
import { getSelectOptions, onSelectChange } from "./react-select";
import { useAsyncEffect } from "./utils";

import "./style.scss";

const search = new Search();

const App: React.FC = () => {
  const [results, setResults] = React.useState<IActivity[]>([]);
  const [selectedLanguages, setSelectedLanguages] = React.useState<
    ActorLanguage[]
  >([]);
  const [selectedActors, setSelectedActors] = React.useState<ActorName[]>([]);
  const fetchActivities = async () => {
    return import(/* webpackChunkName: "myData" */ "../../lib/data");
  };

  useAsyncEffect(async () => {
    const {
      activities,
      actors,
      languages,
      actorTypes,
      activityTypes
    } = await fetchActivities();
    search.setState({
      activities,
      activityTypes,
      actorTypes,
      actors,
      languages
    });

    if (selectedLanguages.length && actors !== undefined) {
      const updated =
        search.setLenses("languages", selectedLanguages as string[]) ||
        search.setLenses("actors", selectedActors);

      if (updated) {
        setResults(search.getResults().activities as IActivity[]);
      }
    } else {
      setResults(activities as IActivity[]);
    }
  });

  if (!results.length) {
    return (
      <div>
        <header>Loading CV Data</header>
      </div>
    );
  }

  const onLanguageChange = onSelectChange(setSelectedLanguages);
  const onActorChange = onSelectChange(setSelectedActors);

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

      {results &&
        results.map((activity, idx) => (
          <div key={idx} className="card">
            {activity.title}
          </div>
        ))}
    </div>
  );
};

export default App;

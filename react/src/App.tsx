import React from "react";
import Select from "react-select";

import { Search } from "../../lib/search";
import {
  ActivityType,
  ActorLanguage,
  ActorName,
  IActivity,
  IActor
} from "../../lib/types";
import { getSelectOptions, onSelectChange } from "./react-select";
import { useAsyncEffect } from "./utils";

import "./style.scss";

const search = new Search();

interface IActivityCardProps {
  activity: IActivity;
  actor: IActor;
}

const ActivityCard: React.FC<IActivityCardProps> = ({ activity, actor }) => (
  <div className="card">
    <a href={actor && actor.url ? actor.url : "#"} title={activity.title}>
      {activity.title}
    </a>
    {actor &&
      actor.languages &&
      actor.languages.map((language, idx) => (
        <div key={idx} className="language fr">
          {language}
        </div>
      ))}
  </div>
);

const App: React.FC = () => {
  const [results, setResults] = React.useState<IActivity[]>([]);
  const [selectedLanguages, setSelectedLanguages] = React.useState<
    ActorLanguage[]
  >([]);
  const [selectedActors, setSelectedActors] = React.useState<ActorName[]>([]);
  const [selectedActivityTypes, setSelectedActivityTypes] = React.useState<
    ActivityType[]
  >([]);
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

    if (
      actors !== undefined &&
      (selectedLanguages.length ||
        selectedActors.length ||
        selectedActivityTypes.length)
    ) {
      const updated =
        search.setSearches("languages", selectedLanguages as string[]) ||
        search.setSearches("actors", selectedActors) ||
        search.setSearches("activityTypes", selectedActivityTypes);

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
  const onActivityTypeChange = onSelectChange(setSelectedActivityTypes);

  const resultsCount = results ? results.length : 0;

  return (
    <div>
      <header className="site-name">Tony Narlock's CV</header>
      <Select
        options={getSelectOptions(search.data.languages as string[])}
        isMulti={true}
        onChange={onLanguageChange}
        className="react-select"
        placeholder="Filter by Programming Language(s) - e.g. Python, JavaScript, C++"
      />
      <Select
        options={getSelectOptions(Object.keys(search.data.actors))}
        isMulti={true}
        onChange={onActorChange}
        className="react-select"
        placeholder="Filter by Place / project / company - e.g. tmuxp, Social Amp, The Tao of tmux"
      />
      <Select
        options={getSelectOptions(search.data.activityTypes)}
        isMulti={true}
        onChange={onActivityTypeChange}
        className="react-select"
        placeholder="Filter by Type of Activity - e.g. Work, Open Source, Website, Volunteering"
      />

      {Array.from(search.availableSearches.activityTypes).map(activityType => (
        <>{activityType}</>
      ))}

      <div>Found {resultsCount}</div>

      {results &&
        results.map((activity, idx) => (
          <ActivityCard
            activity={activity}
            actor={search.data.actors[activity.actorId]}
            key={idx}
          />
        ))}
    </div>
  );
};

export default App;

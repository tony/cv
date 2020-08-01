import React from "react";
import Select from "react-select";

import { Search } from "../../lib/search";
import {
  ActivityType,
  OrgLanguage,
  OrgName,
  IActivity,
  IOrg,
} from "../../lib/types";
import { getSelectOptions, onSelectChange } from "./react-select";
import { useAsyncEffect } from "./utils";

import "./style.scss";

const search = new Search();

interface IActivityCardProps {
  activity: IActivity;
  org: IOrg;
}

const ActivityCard: React.FC<IActivityCardProps> = ({ activity, org }) => (
  <div className="card">
    <a href={org && org.url ? org.url : "#"} title={activity.title}>
      {activity.title}
    </a>
    {org &&
      org.languages &&
      org.languages.map((language, idx) => (
        <div key={idx} className="language fr">
          {language}
        </div>
      ))}
  </div>
);

const App: React.FC = () => {
  const [results, setResults] = React.useState<IActivity[]>([]);
  const [selectedLanguages, setSelectedLanguages] = React.useState<
    OrgLanguage[]
  >([]);
  const [selectedOrgs, setSelectedOrgs] = React.useState<OrgName[]>([]);
  const [selectedActivityTypes, setSelectedActivityTypes] = React.useState<
    ActivityType[]
  >([]);
  const fetchActivities = async () => {
    return import(/* webpackChunkName: "myData" */ "../../lib/data");
  };

  useAsyncEffect(async () => {
    const {
      activities,
      orgs,
      languages,
      orgTypes,
      activityTypes,
    } = await fetchActivities();
    search.setState({
      activities,
      activityTypes,
      orgTypes,
      orgs,
      languages,
    });

    if (
      orgs !== undefined &&
      (selectedLanguages.length ||
        selectedOrgs.length ||
        selectedActivityTypes.length)
    ) {
      const updated =
        search.setSearches("languages", selectedLanguages as string[]) ||
        search.setSearches("orgs", selectedOrgs) ||
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
  const onOrgChange = onSelectChange(setSelectedOrgs);
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
        options={getSelectOptions(Object.keys(search.data.orgs))}
        isMulti={true}
        onChange={onOrgChange}
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

      {Array.from(search.availableSearches.activityTypes).map(
        (activityType) => (
          <>{activityType}</>
        )
      )}

      <div>Found {resultsCount}</div>

      {results &&
        results.map((activity, idx) => (
          <ActivityCard
            activity={activity}
            org={search.data.orgs[activity.orgId]}
            key={idx}
          />
        ))}
    </div>
  );
};

export default App;

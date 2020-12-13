import React from "react";
import Select from "react-select";
import type { Subscription, Observable } from "rxjs";
import { ActionMeta, OptionProps, ValueType } from "react-select/src/types"; // tslint:disable-line no-submodule-imports
import {
  ActivityType,
  LanguageName,
  OrgName,
  IActivity,
  IOrg,
} from "../../lib/types";
import {
  activityTypesStore,
  activitiesStore,
  activitiesQuery,
  activityTypesQuery,
  orgsStore,
  orgTypesStore,
  orgsQuery,
  orgTypesQuery,
  cvStore,
  search,
  query,
  languagesStore,
  languagesQuery,
} from "../../lib/hub";
import { getSelectOptions, onSelectChange } from "./react-select";
import type { ISelectOption, IOptionType } from "./react-select";
import { useAsyncEffect } from "./utils";

import "./style.scss";

interface IActivityCardProps {
  activity: IActivity;
  org: IOrg;
}

function onEmit<T>(
  source$: Observable<T>,
  nextFn: (value: T) => void
): Subscription {
  return source$.subscribe(nextFn, console.error);
}

const ActivityCard: React.FC<IActivityCardProps> = ({ activity, org }) => (
  <div className="card">
    <a href={org && org.url ? org.url : "#"} title={activity.title}>
      {activity.title}
    </a>
    {org &&
      org.languages &&
      org.languages.map((language, idx) => (
        <div
          key={idx}
          className="language fr"
          style={{
            backgroundColor: languagesQuery.getEntity(language)?.color,
            color: languagesQuery.getEntity(language)?.textColor,
          }}
        >
          {language}
        </div>
      ))}
  </div>
);

const App: React.FC = () => {
  const [results, setResults] = React.useState<IActivity[]>([]);

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
    if (
      !languages ||
      orgsStore.getValue().entities.length ||
      cvStore.getValue()?.activities?.length
    ) {
      return;
    }
    console.log("setting storage");
    cvStore.update({
      activities,
      activityTypes,
      orgTypes,
      orgs,
      languages,
    });
    orgsStore.set(orgs);
    orgTypesStore.set(orgTypes);
    languagesStore.set(languages);
    activityTypesStore.set(activityTypes);
    activitiesStore.set(activities);
    if (!results.length) {
      setResults(activitiesQuery.getAll() as IActivity[]);
    }
  });

  React.useEffect(() => {
    const subscriptions: Subscription[] = [
      onEmit<IActivity[]>(query.activities$(), (resultsUpdated) => {
        console.log("results updated", resultsUpdated);

        if (
          resultsUpdated != results &&
          resultsUpdated.length != results.length
        ) {
          setResults(resultsUpdated);
        }
      }),
    ];

    return () => subscriptions.map((it) => it.unsubscribe());
  }, [results]);

  if (!results.length) {
    return (
      <div>
        <header>Loading CV Data</header>
      </div>
    );
  }

  const onLanguageChange = (
    value: ValueType<IOptionType, boolean>,
    _: ActionMeta<IOptionType>
  ) => {
    if (value) {
      languagesStore.setActive(
        (value as IOptionType[]).map(({ value: v }) => v)
      );
    } else {
      languagesStore.setActive([]);
    }
  };
  const onOrgChange = (
    value: ValueType<IOptionType, boolean>,
    _: ActionMeta<IOptionType>
  ) => {
    console.log("onOrgChange", value);
    if (value) {
      orgsStore.setActive((value as IOptionType[]).map(({ label }) => label));
    } else {
      orgsStore.setActive([]);
    }
  };
  const onActivityTypeChange = (
    value: ValueType<IOptionType, boolean>,
    _: ActionMeta<IOptionType>
  ) => {
    if (value) {
      activityTypesStore.setActive(
        (value as IOptionType[]).map(({ value: v }) => v)
      );
    } else {
      activityTypesStore.setActive([]);
    }
  };

  const resultsCount = results ? results.length : 0;

  return (
    <div>
      <header className="site-name">Tony Narlock's CV</header>
      <Select
        options={getSelectOptions(
          Object.values(languagesQuery.getValue().entities).map(
            (lang) => lang.id as string
          )
        )}
        isMulti={true}
        onChange={onLanguageChange}
        className="react-select"
        placeholder="Filter by Programming Language(s) - e.g. Python, JavaScript, C++"
      />
      <Select
        options={
          orgsQuery.getAll().map((org) => ({
            label: org.name,
            value: org.id,
          })) as ISelectOption[]
        }
        isMulti={true}
        onChange={onOrgChange}
        className="react-select"
        placeholder="Filter by Place / project / company - e.g. tmuxp, Social Amp, The Tao of tmux"
      />
      <Select
        options={
          activityTypesQuery.getAll().map((a) => ({
            label: a.name,
            value: a.id,
          })) as ISelectOption[]
        }
        isMulti={true}
        onChange={onActivityTypeChange}
        className="react-select"
        placeholder="Filter by Type of Activity - e.g. Work, Open Source, Website, Volunteering"
      />

      {Array.from(activityTypesQuery.getAll()).map((activityType) => (
        <>{activityType.name}</>
      ))}

      <div>Found {resultsCount}</div>

      {results &&
        results.map((activity, idx) => {
          const org = orgsQuery.getEntity(activity.orgId);
          if (!org) return;
          return <ActivityCard activity={activity} org={org} key={idx} />;
        })}
    </div>
  );
};

export default App;

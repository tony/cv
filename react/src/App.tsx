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
  search,
  query,
  languagesStore,
  languagesQuery,
} from "../../lib/hub";
import { getSelectOptions, languagesStyles, OrgOption } from "./react-select";
import type { ISelectOption, IOptionType } from "./react-select";
import { useAsyncEffect } from "./utils";

import "./style.scss";

function onEmit<T>(
  source$: Observable<T>,
  nextFn: (value: T) => void
): Subscription {
  return source$.subscribe(nextFn, console.error);
}

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

interface ReducerState {
  activities: IActivity[];
  languages: Language[];
  ui: {
    isLoading: boolean;
  };
}

enum ActionType {
  SetResults,
  IsLoading,
}
type Action =
  | { type: ActionType.SetResults; activities: IActivity[] }
  | { type: ActionType.IsLoading; isLoading: boolean };
const reducer = (state: ReducerState, action: Action) => {
  switch (action.type) {
    case ActionType.SetResults: {
      return {
        ...state,
        ...action,
      };
    }
    case ActionType.IsLoading: {
      return {
        ...state,
        ui: {
          ...state.ui,
          isLoading: action.isLoading,
        },
      };
    }
    default:
      return state;
  }
};

const DEFAULT_STORE: ReducerState = {
  activities: [],
  languages: [],
  ui: { isLoading: false },
};

const App: React.FC = () => {
  const [results, dispatch] = React.useReducer(reducer, DEFAULT_STORE);

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
      !!Object.keys(orgsStore.getValue().entities).length ||
      !!Object.keys(activitiesStore.getValue().entities).length
    ) {
      if (activitiesStore.getValue().ui.isLoading) {
        activitiesStore.setLoading(false);
      }
      return;
    }
    activitiesStore.setLoading(true);
    console.log("setting storage");
    orgsStore.set(orgs);
    orgTypesStore.set(orgTypes);
    languagesStore.set(languages);
    activityTypesStore.set(activityTypes);
    activitiesStore.set(activities);
    activitiesStore.setLoading(false);
    if (!results?.activities.length) {
      dispatch({
        type: ActionType.SetResults,
        activities: activitiesQuery.getAll() as IActivity[],
      });
    }
  });

  React.useEffect(() => {
    const subscriptions: Subscription[] = [
      onEmit<IActivity[]>(query.visibleActivities$(), (resultsUpdated) => {
        console.log("results updated", resultsUpdated);

        if (
          resultsUpdated != results &&
          resultsUpdated.length != results.length
        ) {
          dispatch({
            type: ActionType.SetResults,
            activities: resultsUpdated,
          });
        }
      }),
      onEmit<Language[]>(query.visibleLanguages$(), (languagesUpdated) => {
        console.log("languages updated", languagesUpdated, results);

        if (
          languagesUpdated != results &&
          languagesUpdated.length != results.length
        ) {
          dispatch({
            type: ActionType.SetResults,
            languages: languagesUpdated,
          });
        }
      }),
      onEmit<Language[]>(activitiesQuery.selectLoading$(), (isLoading) => {
        console.log("isLoading", isLoading);
        dispatch({
          type: ActionType.IsLoading,
          isLoading,
        });
      }),
    ];

    return () => subscriptions.map((it) => it.unsubscribe());
  }, []);

  if (results.ui.isLoading) {
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

  const resultsCount = results?.activities ? results.activities.length : 0;

  return (
    <div>
      <header className="site-name">Tony Narlock's CV</header>
      <Select
        options={getSelectOptions(
          Object.values(languagesQuery.getValue().entities).map(
            (lang) => lang.id as string
          )
        )}
        isMulti
        onChange={onLanguageChange}
        className="react-select"
        placeholder="Filter by Programming Language(s) - e.g. Python, JavaScript, C++"
        styles={languagesStyles}
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
        components={{ Option: OrgOption }}
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
        <React.Fragment key={activityType.id}>
          {activityType.name}
        </React.Fragment>
      ))}

      <div>Found {resultsCount}</div>

      {results.activities &&
        results.activities.map((activity, idx) => {
          const org = orgsQuery.getEntity(activity.orgId);
          if (!org) return;
          return <ActivityCard activity={activity} org={org} key={idx} />;
        })}
    </div>
  );
};

export default App;

import React from "react";
import Select from "react-select";
import type { Subscription, Observable } from "rxjs";
import type { ValueType } from "react-select/src/types";

import type { IActivity } from "../../lib/types";
import {
  activityTypesStore,
  activitiesStore,
  activitiesQuery,
  activityTypesQuery,
  loadStores,
  orgsStore,
  orgTypesStore,
  orgsQuery,
  query,
  languagesStore,
  languagesQuery,
} from "../../lib/hub";
import { ActivityCard } from "./Card";
import {
  getSelectOptions,
  languagesStyles,
  LanguageOption,
  OrgOption,
} from "./react-select";
import type { ISelectOption, IOptionType } from "./react-select";
import { useAsyncEffect } from "./utils";

import "./style.scss";

function onEmit<T>(
  source$: Observable<T>,
  nextFn: (value: T) => void
): Subscription {
  return source$.subscribe(nextFn, console.error);
}

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
    return import(/* webpackChunkName: "myData" */ "../../lib/data/raw");
  };
  useAsyncEffect(async () => {
    const data = await fetchActivities();
    if (
      !data.languages ||
      !!Object.keys(orgsStore.getValue().entities).length ||
      !!Object.keys(activitiesStore.getValue().entities).length
    ) {
      if (activitiesStore.getValue().ui.isLoading) {
        activitiesStore.setLoading(false);
      }
      return;
    }

    loadStores(data);
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

  const onLanguageChange = (value: ValueType<IOptionType, boolean>) => {
    if (value) {
      languagesStore.setActive(
        (value as IOptionType[]).map(({ value: v }) => v)
      );
    } else {
      languagesStore.setActive([]);
    }
  };
  const onOrgChange = (value: ValueType<IOptionType, boolean>) => {
    console.log("onOrgChange", value);
    if (value) {
      orgsStore.setActive((value as IOptionType[]).map(({ label }) => label));
    } else {
      orgsStore.setActive([]);
    }
  };
  const onActivityTypeChange = (value: ValueType<IOptionType, boolean>) => {
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
      <header className="site-name">Tony Narlock{"'"}s CV</header>
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
        components={{ Option: LanguageOption }}
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

      <div className="resultsMessage">Found {resultsCount} results</div>

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

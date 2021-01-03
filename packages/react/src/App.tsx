import React from "react";
import Select from "react-select";
import type { Subscription } from "rxjs";
import type { ValueType } from "react-select/src/types";
import equal from "fast-deep-equal";

import type { IActivity, Language } from "@tony/cv-lib/data/types";
import {
  activityTypesStore,
  activitiesStore,
  activitiesQuery,
  activityTypesQuery,
  loadStores,
  orgsStore,
  orgsQuery,
  query,
  languagesStore,
  languagesQuery,
} from "@tony/cv-lib/hub";
import { difference } from "@tony/cv-lib/utils";
import type { ActivityCount, LanguageCount } from "@tony/cv-lib/search/query";
import type { fetchDataFn } from "@tony/cv-lib/data/fetch";
import { ActivityCard } from "./Card";
import {
  getSelectOptions,
  languagesStyles,
  LanguageOption,
  OrgOption,
} from "./react-select";
import type { ISelectOption, IOptionType } from "./react-select";
import { onEmit, useAsyncEffect } from "./utils";

import christmasTreeSvg from "@tony/cv-data/img/icons/christmas-tree.svg";

import "./style.scss";

interface ReducerState {
  activities: IActivity[];
  languages: Language[];

  // Counts
  languageCount: LanguageCount;
  activityCount: ActivityCount;

  // UX
  ui: {
    isLoading: boolean;
  };
}

enum ActionType {
  SetResults,
  IsLoading,
}

type Action =
  | {
      type: ActionType.SetResults;
      activities?: IActivity[];
      languages?: Language[];

      // Counts
      activityCount?: ActivityCount;
      languageCount?: LanguageCount;
    }
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

  // Counts
  languageCount: {},
  activityCount: {},
  ui: { isLoading: false },
};

const fetchData: fetchDataFn = async () => {
  return import(/* webpackChunkName: "cvData" */ "../../lib/data/raw");
};

const App: React.FC = () => {
  const [results, dispatch] = React.useReducer(reducer, DEFAULT_STORE);

  useAsyncEffect(async () => {
    const data = await fetchData();
    if (
      !data.languages ||
      !!Object.keys(orgsStore.getValue().entities ?? {}).length ||
      !!Object.keys(activitiesStore.getValue().entities ?? {}).length
    ) {
      if (activitiesStore.getValue().ui.isLoading) {
        activitiesStore.setLoading(false);
      }
      return void 0;
    }

    loadStores(data);
    if (!results?.activities.length) {
      dispatch({
        type: ActionType.SetResults,
        activities: activitiesQuery.getAll() as IActivity[],
        languageCount: (await query.getVisibleLanguageCount()) as LanguageCount,
        activityCount: (await query.getVisibleActivityYearCount()) as ActivityCount,
      });
    }
    return void 0;
  });

  React.useEffect(() => {
    const subscriptions: Subscription[] = [
      onEmit<IActivity[]>(query.visibleActivities$(), (newValue) => {
        const isChanged = !equal(newValue, results.activities);
        console.log("results updated", newValue, { isChanged });

        if (isChanged) {
          dispatch({
            type: ActionType.SetResults,
            activities: newValue,
          });
        }
      }),
      onEmit<Language[]>(query.visibleLanguages$(), (newValue) => {
        const isChanged = !equal(newValue, results.languages);
        console.log("languages updated", newValue, results, { isChanged });

        if (isChanged) {
          dispatch({
            type: ActionType.SetResults,
            languages: newValue,
          });
        }
      }),
      onEmit<LanguageCount>(query.visibleLanguageCount$(), (newValue) => {
        const isChanged = !equal(newValue, results.languageCount);
        console.log(
          "language counts updated",
          newValue,
          results.languageCount,
          { isChanged }
        );

        if (isChanged) {
          dispatch({
            type: ActionType.SetResults,
            languageCount: newValue,
          });
        }
      }),
      onEmit<ActivityCount>(query.visibleActivityYearCount$(), (newValue) => {
        const isChanged = !equal(newValue, results.activityCount);
        console.log(
          "activity year count updated",
          newValue,
          results.activityCount,
          { isChanged }
        );

        if (isChanged) {
          dispatch({
            type: ActionType.SetResults,
            activityCount: newValue,
          });
        }
      }),
      onEmit<boolean>(activitiesQuery.selectLoading$(), (isLoading) => {
        console.log("isLoading", isLoading);

        dispatch({
          type: ActionType.IsLoading,
          isLoading,
        });
      }),
    ];

    return () => {
      subscriptions.map((it) => it.unsubscribe());
    };
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

      <div className="chartRow">
        <div className="chartRow--donut"></div>
        <div className="chartRow--line"></div>
      </div>

      <div className="dropdownRow">
        <Select
          options={getSelectOptions(
            Object.values(languagesQuery?.getValue()?.entities ?? {}).map(
              (lang) => lang.id as string
            )
          )}
          isMulti
          onChange={onLanguageChange}
          className="react-select"
          placeholder="Programming Language - e.g. Python, JavaScript, C++"
          styles={languagesStyles}
          components={{ Option: LanguageOption }}
        />
        <Select
          options={
            activityTypesQuery.getAll().map((a) => ({
              label: a.name,
              value: a.id,
            })) as ISelectOption
          }
          isMulti={true}
          onChange={onActivityTypeChange}
          className="react-select"
          placeholder="Activity type - e.g. Work, Open Source, Website, Volunteering"
        />
        <Select
          options={
            orgsQuery.getAll().map((org) => ({
              label: org.name,
              value: org.id?.toString() ?? org.id,
            })) as ISelectOption
          }
          isMulti={true}
          onChange={onOrgChange}
          className="react-select"
          placeholder="Place / project / company - e.g. tmuxp, Social Amp, The Tao of tmux"
          components={{ Option: OrgOption }}
        />
      </div>

      <div className="resultsMessage">
        Found {resultsCount} results <img src={christmasTreeSvg} width="16" />
      </div>

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

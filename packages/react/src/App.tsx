import React from "react";
import type { Subscription } from "rxjs";
import equal from "fast-deep-equal";

import type { IActivity, Language } from "@tony/cv-data/types";
import { activitiesStore, loadStores, query } from "@tony/cv-lib/hub";
import type {
  ActivityCount,
  LanguageCount,
  Results as ReducerState,
} from "@tony/cv-lib/search/query";
import { DEFAULT_RESULTS } from "@tony/cv-lib/search/query";
import type { fetchDataFn } from "@tony/cv-data/fetch";
import { onEmit, useAsyncEffect } from "./utils";

import { Results, ResultsHeader } from "./Results";
import { Settings, SettingsContextProvider } from "./Settings";
import { Charts } from "./Charts";

import "@tony/cv-nav";
import "@tony/cv-ui/styles/style.scss";
import "./style.scss";

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

const fetchData: fetchDataFn = async () => {
  return import(/* webpackChunkName: "cvData" */ "@tony/cv-data/raw");
};

const AppContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <cv-nav />
      {children}
    </div>
  );
};

const App: React.FC = () => {
  const [results, dispatch] = React.useReducer(reducer, DEFAULT_RESULTS);

  useAsyncEffect(async () => {
    const data = await fetchData();
    if (Object.keys(activitiesStore.getValue().entities ?? {}).length) {
      return void 0;
    }

    loadStores(data);
    if (!results?.activities.length) {
      dispatch({
        type: ActionType.SetResults,
        // activities: activitiesQuery.getAll() as IActivity[],

        // Counts
        languageCount: (await query.getVisibleLanguageCount()) as LanguageCount,
        activityCount:
          (await query.getVisibleActivityYearCount()) as ActivityCount,
      });
    }
    return void 0;
  });

  React.useEffect(() => {
    const subscriptions: Subscription[] = [
      onEmit<ReducerState>(query.subResults$(), (newResults) => {
        const isChanged = !equal(newResults, results);
        console.log("results published", newResults, results, { isChanged });

        if (isChanged) {
          dispatch({
            type: ActionType.SetResults,
            ...newResults,
          });
        }
      }),
    ];

    return () => {
      subscriptions.map((it) => it.unsubscribe());
    };
  }, []);

  return (
    <AppContainer>
      <SettingsContextProvider>
        {results.ui.isLoading ? (
          <div id="loading-screen">Loading CV Data</div>
        ) : (
          <>
            <Settings results={results} />
            <Charts results={results} />
            <ResultsHeader results={results} />
            <Results results={results} />
          </>
        )}
      </SettingsContextProvider>
    </AppContainer>
  );
};

export default App;

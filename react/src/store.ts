import {
  activityTypes,
  INITIAL_DATA,
  DEFAULT_SELECTED_FILTERS
} from "./lib/constants";
import { filterMap } from "./lib/selectors";
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import cvReducers from "./reducers";

const logger = createLogger({
  // ...options
});

export var store = createStore(
  cvReducers,
  {
    ...INITIAL_DATA.entities,
    activityTypes,
    filters: filterMap
  },
  applyMiddleware(logger)
);

import { AnyAction } from "redux";

const selectedFilters = (state = [], action: AnyAction) => {
  switch (action.type) {
    case "CHANGE_SELECTED_FILTERS":
      return action.value;
    default:
      return state;
  }
};

export default selectedFilters;

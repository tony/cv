import { AnyAction } from "redux";
import { CVActivity } from "../lib/types";

const selectedActivityTypes = (
  state: Array<CVActivity> = [],
  action: AnyAction
) => {
  switch (action.type) {
    case "CHANGE_SELECTED_ACTIVITY_TYPES":
      return action.value;
    default:
      return state;
  }
};

export default selectedActivityTypes;

import { AnyAction } from "redux";
import { CVActor } from "../lib/types";

const selectedActors = (state: Array<CVActor> = [], action: AnyAction) => {
  switch (action.type) {
    case "CHANGE_SELECTED_ACTORS":
      return action.value;
    default:
      return state;
  }
};

export default selectedActors;

import { AnyAction } from "redux";
import { CVActivity } from "../lib/types";

const activities = (state: Array<CVActivity> = [], action: AnyAction) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default activities;

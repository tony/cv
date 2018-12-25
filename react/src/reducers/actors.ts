import { AnyAction } from "redux";
import { CVActor } from "../lib/types";

const actors = (state: Array<CVActor> = [], action: AnyAction) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default actors;

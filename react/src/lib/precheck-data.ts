/**
 * Functions for prechecking the structure of the data on startup.
 */
import { CVActorRaw } from "./types";

function validateActor(item: CVActorRaw): void {
  console.assert("name" in item, "name not in item", [item]);
  console.assert("url" in item, "url not in item", [item]);
}

export const validateActors = (list: CVActorRaw[]): void => {
  list.forEach(item => validateActor(item));
};

export default validateActors;

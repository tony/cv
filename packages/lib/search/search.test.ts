import { expect } from "@jest/globals";
import { values } from "mobx";

import { CVState, INITIAL_SEARCH_OPTIONS } from "@tony/cv-lib/search/mobx";

describe("CVState", () => {
  test("init", () => {
    const s = CVState.create();
    expect(values(s.searchOptions)).toEqual(INITIAL_SEARCH_OPTIONS);
  });
});

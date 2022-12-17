import type { IData } from "@tony/cv-data/fetch";
import { DEFAULT_FILTERS } from "@tony/cv-lib/search/query";

import { ActivitiesStore, CVStore } from "./store";

describe("CVStore", () => {
  test("init", () => {
    const s = new CVStore();
    expect(s.getValue()).toStrictEqual(DEFAULT_FILTERS);
  });
});

describe("ActivitiesStore", () => {
  test("init", () => {
    const s = new ActivitiesStore();
    expect(s.getValue().activities).toBeUndefined();
  });

  test("init with data", async () => {
    const data: IData = await import("@tony/cv-data/raw");
    const s = new ActivitiesStore();
    s.set(data.activities);
    expect(s.getValue()).not.toStrictEqual([]);
  });
});

describe("test with data", () => {
  beforeEach(async () => {
    const data: IData = await import("@tony/cv-data/raw");
    const { loadStores } = await import("../../lib/hub");
    loadStores(data);
  });

  test("has data loaded for beforeEach", async () => {
    const { activitiesQuery } = await import("../../lib/hub");
    expect(activitiesQuery.getCount()).toBeGreaterThan(10);
  });
});

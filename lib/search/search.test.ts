import { Search } from "./search";

test("init", () => {
  const s = new Search();
  expect(s.data.activities).toStrictEqual([]);
});

test("fetch", async () => {
  const fetchActivities = async () => {
    return import(/* webpackChunkName: "myData" */ "../../lib/data");
  };
  const {
    activities,
    actors,
    languages,
    actorTypes,
    activityTypes
  } = await fetchActivities();

  const s = new Search();
  s.setState({
    activities,
    activityTypes,
    actorTypes,
    actors,
    languages
  });
  expect(s.data.activities).not.toStrictEqual([]);
});

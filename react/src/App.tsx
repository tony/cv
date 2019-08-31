import React from "react";
import Select from "react-select";
import { ActionMeta, OptionProps, ValueType } from "react-select/src/types"; // tslint:disable-line no-submodule-imports

import { Search } from "../../lib/search";
import { ActorLanguage, IActivity } from "../../lib/types";

interface IState {
  myActivities: IActivity[];
}

type ISelectOption = Pick<OptionProps, "label" | "value">;
interface IOptionType {
  label: string;
  value: string;
}

const search = new Search();

const useAsyncEffect = (
  effect: (isCanceled: () => boolean) => Promise<void>,
  dependencies?: any[]
) =>
  React.useEffect(() => {
    let canceled = false;
    effect(() => canceled);
    return () => {
      canceled = true;
    };
  }, dependencies);

const App: React.FC<IState> = () => {
  const [activities, setActivities] = React.useState<IActivity[]>([]);
  const [languages, setLanguages] = React.useState<ActorLanguage[]>([]);
  const fetchActivities = async () => {
    return import(/* webpackChunkName: "myData" */ "../../lib/data");
  };
  useAsyncEffect(async () => {
    const {
      myActivities,
      myActors,
      myLanguages,
      myActorTypes,
      myActivityTypes
    } = await fetchActivities();
    search.setState({
      activities: myActivities,
      activityTypes: myActivityTypes,
      actorTypes: myActorTypes,
      actors: myActors,
      languages: myLanguages
    });
    if (languages.length && myActors !== undefined) {
      search.filter(activity => {
        const actor = myActors.find(({ id }) => id === activity.actor);
        return languages.some(
          language =>
            actor &&
            actor.languages &&
            actor.languages.length &&
            actor.languages.includes(language)
        );
      });
    }
    setActivities(myActivities as IActivity[]);
  });

  if (!activities.length) {
    return (
      <div>
        <header>Loading CV Data</header>
      </div>
    );
  }

  const languageOptions = (((search || {}).data || {}).languages || []).length
    ? (search.data.languages.map(language => ({
        label: language,
        value: language
      })) as ISelectOption[])
    : [];
  const onLanguageChange = (value: ValueType<IOptionType>, _: ActionMeta) => {
    setLanguages(
      (value as IOptionType[])
        .filter(lang => lang && lang.value)
        .map(lang => lang.value as ActorLanguage)
    );
  };

  return (
    <div>
      <header>Tony Narlock's CV</header>
      <Select
        options={languageOptions}
        isMulti={true}
        onChange={onLanguageChange}
      />
      {activities &&
        activities.map((activity, idx) => (
          <div key={idx}>{activity.title}</div>
        ))}
    </div>
  );
};

export default App;

import React from "react";
import Select from "react-select";
import { ActionMeta, OptionProps, ValueType } from "react-select/src/types"; // tslint:disable-line no-submodule-imports

import { Search } from "../../lib/search";
import { ActorLanguage, ActorName, IActivity, IActor } from "../../lib/types";

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
  const [actors, setActors] = React.useState<IActor["name"]>([]);
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
      const updated =
        search.setLenses("languages", languages) ||
        search.setLenses("actors", actors);

      if (updated) {
        setActivities(search.getResults().activities as IActivity[]);
      }
    } else {
      setActivities(myActivities as IActivity[]);
    }
  });

  if (!activities.length) {
    return (
      <div>
        <header>Loading CV Data</header>
      </div>
    );
  }

  const languageOptions = search.data.languages.map(language => ({
    label: language,
    value: language
  })) as ISelectOption[];

  const onLanguageChange = (value: ValueType<IOptionType>, _: ActionMeta) => {
    if (value) {
      setLanguages(
        (value as IOptionType[]).map(({ value: v }) => v as ActorLanguage)
      );
    } else {
      setLanguages([]);
    }
  };

  const actorOptions = Object.keys(search.data.actors).map(actorName => ({
    label: actorName,
    value: actorName
  })) as ISelectOption[];

  const onActorChange = (value: ValueType<IOptionType>, _: ActionMeta) => {
    if (value) {
      setActors((value as IOptionType[]).map(({ value: v }) => v as ActorName));
    } else {
      setActors([]);
    }
  };

  return (
    <div>
      <header>Tony Narlock's CV</header>
      <Select
        options={languageOptions}
        isMulti={true}
        onChange={onLanguageChange}
      />
      <Select options={actorOptions} isMulti={true} onChange={onActorChange} />

      {activities &&
        activities.map((activity, idx) => (
          <div key={idx}>{activity.title}</div>
        ))}
    </div>
  );
};

export default App;

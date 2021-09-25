import type { CSSObject } from "@emotion/serialize";
import React from "react";
import type { Subscription } from "rxjs";

import {
  components as ReactSelectComponents,
  Options,
  OptionProps,
  PropsValue,
  StylesConfig,
  MultiValueGenericProps,
} from "react-select";

import chroma from "chroma-js";

import {
  activityTypesQuery,
  languagesQuery,
  orgsQuery,
  query,
  languagesStore,
  orgsStore,
  activityTypesStore,
} from "@tony/cv-lib/hub";
import type { LanguageCount } from "@tony/cv-lib/search/query";
import { ActivityTypeEmojiMap } from "@tony/cv-data/constants";
import { LanguageTag, OrgTypeTag } from "./Tag";
import { onEmit } from "./utils";

export interface IOptionType {
  label: string;
  value: string;
}
export interface StyleOption extends IOptionType {
  color: string;
  isFixed?: boolean;
  isDisabled?: boolean;
}
export type ISelectOption = Options<IOptionType>;

export const onLanguageChange = (value: PropsValue<IOptionType>): void => {
  if (value) {
    languagesStore.setActive((value as IOptionType[]).map(({ value: v }) => v));
  } else {
    languagesStore.setActive([]);
  }
};
export const onOrgChange = (value: PropsValue<IOptionType>): void => {
  console.log("onOrgChange", value);
  if (value) {
    orgsStore.setActive((value as IOptionType[]).map(({ value }) => value));
  } else {
    orgsStore.setActive([]);
  }
};
export const onActivityTypeChange = (value: PropsValue<IOptionType>): void => {
  if (value) {
    activityTypesStore.setActive(
      (value as IOptionType[]).map(({ value: v }) => v)
    );
  } else {
    activityTypesStore.setActive([]);
  }
};

export const getSelectOptions = (items: string[]): ISelectOption =>
  items.map((actorName) => ({
    label: actorName,
    value: actorName,
  })) as ISelectOption;

export const OrgOption: React.FC<OptionProps<IOptionType, boolean>> = ({
  children,
  ...props
}) => {
  const org = orgsQuery.getEntity(props.data?.value);
  return (
    <ReactSelectComponents.Option {...props} className="df">
      {children}{" "}
      {org?.orgType && (
        <div className="topicTags">
          <OrgTypeTag
            orgTypeName={org.orgType}
            style={{
              marginLeft: "0.75rem",
            }}
          >
            {org.orgType}
          </OrgTypeTag>

          {org.languages.map((languageId) => (
            <LanguageTag
              languageName={languageId}
              key={languageId}
              className="tag"
              style={{
                marginLeft: ".5rem",
              }}
            />
          ))}
        </div>
      )}
    </ReactSelectComponents.Option>
  );
};

export const LanguageOption: React.FC<OptionProps<IOptionType, boolean>> = ({
  data,
  ...props
}) => {
  const languageName = data?.value;

  const [availableActivitiesCount, setAvailableActivitiesCount] =
    React.useState<number>(0);
  const [totalActivitiesCount, setTotalActivitiesCount] =
    React.useState<number>(0);
  if (!languageName) {
    console.warn(`${languageName} missing from option`);
    return null;
  }
  React.useEffect(() => {
    const subscriptions: Subscription[] = [
      onEmit<LanguageCount>(query.visibleLanguageCount$(), (languageCounts) => {
        const count = languageCounts[languageName];
        if (count != availableActivitiesCount) {
          setAvailableActivitiesCount(count);
        }
      }),
      onEmit<LanguageCount>(query.languageCount$(), (languageCounts) => {
        const count = languageCounts[languageName];
        if (count != totalActivitiesCount) {
          setTotalActivitiesCount(count);
        }
      }),
    ];

    return () => {
      subscriptions.map((it) => it.unsubscribe());
    };
  }, []);

  return (
    <ReactSelectComponents.Option {...props} data={data} className="df">
      <LanguageTag
        languageName={languageName}
        key={languageName}
        className="tag ml0"
      />
      <div className="activityCount">{totalActivitiesCount} results</div>
    </ReactSelectComponents.Option>
  );
};

export const languagesStyles: StylesConfig<IOptionType, boolean> = {
  option: (styles: CSSObject, { data, isFocused, isSelected }) => {
    const language = languagesQuery.getEntity(data.value);
    if (!language?.ui?.backgroundColor || !language?.ui?.color) {
      return styles;
    }
    const backgroundColor = chroma(language.ui.backgroundColor)
      .alpha(0.8)
      .css();
    const highlightStyle = {
      backgroundColor,
      color: chroma(backgroundColor).get("lab.l") > 80 ? "black" : "white",
    };

    return {
      ...styles,
      ...(isFocused || isSelected ? highlightStyle : {}),
      "&:hover": highlightStyle,
    };
  },

  multiValueLabel: (styles, { data }) => {
    const language = languagesQuery.getEntity(data.value);

    if (!language?.ui) {
      return styles;
    }

    return {
      ...styles,
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
      paddingRight: "4px",
      ...language.ui,
    };
  },
  multiValueRemove: (styles, { data = {} }) => {
    const language = languagesQuery.getEntity(data.value);
    if (!language?.ui?.backgroundColor) {
      return styles;
    }

    const backgroundColor =
      chroma(language.ui.backgroundColor).get("lab.l") > 80
        ? chroma(language.ui.backgroundColor).brighten(0.2)
        : chroma(language.ui.backgroundColor).brighten(0.4);
    const highlightStyle = {
      backgroundColor: backgroundColor.css(),
      color: chroma(backgroundColor).get("lab.l") > 80 ? "black" : "white",
    };

    return {
      ...styles,
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
      ...language.ui,
      ":hover": highlightStyle,
    };
  },
};

export const activityTypeStyles: StylesConfig<IOptionType, boolean> = {
  option: (styles: CSSObject, { data, isFocused, isSelected }) => {
    const activityType = activityTypesQuery.getEntity(data.value);
    if (!activityType?.ui?.backgroundColor || !activityType?.ui?.color) {
      return styles;
    }
    const backgroundColor = chroma(activityType.ui.backgroundColor)
      .alpha(0.8)
      .css();
    const highlightStyle = {
      backgroundColor,
      color: chroma(backgroundColor).get("lab.l") > 80 ? "black" : "white",
    };

    return {
      ...styles,
      ...(isFocused || isSelected ? highlightStyle : {}),
      "&:hover": highlightStyle,
    };
  },

  multiValueLabel: (styles, { data }) => {
    const activityType = activityTypesQuery.getEntity(data.value);
    if (!activityType?.ui) {
      return styles;
    }
    return {
      ...styles,
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
      paddingRight: "4px",
      display: "flex",
      placeItems: "center",
      fontSize: "85%",
      ...activityType.ui,
    };
  },
  multiValueRemove: (styles, { data = {} }) => {
    const activityType = activityTypesQuery.getEntity(data.value);
    if (!activityType?.ui?.backgroundColor) {
      return styles;
    }

    const backgroundColor =
      chroma(activityType.ui.backgroundColor).get("lab.l") > 80
        ? chroma(activityType.ui.backgroundColor).brighten(0.2)
        : chroma(activityType.ui.backgroundColor).brighten(0.4);
    const highlightStyle = {
      backgroundColor: backgroundColor.css(),
      color: chroma(backgroundColor).get("lab.l") > 80 ? "black" : "white",
    };

    return {
      ...styles,
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
      ...activityType.ui,
      ":hover": highlightStyle,
    };
  },
};

export const ActivityTypeOption: React.FC<OptionProps<IOptionType, boolean>> =
  ({ children, ...props }) => {
    const activityType = activityTypesQuery.getEntity(props.data?.value);
    if (!activityType) {
      console.warn(`activityType ${props?.data?.value} could not be found`);
      return null;
    }
    return (
      <ReactSelectComponents.Option
        {...props}
        className="dropdownActivityTypeOption"
      >
        {activityType.id && <>{ActivityTypeEmojiMap[activityType.id]}</>}{" "}
        {children}
      </ReactSelectComponents.Option>
    );
  };

export const ActivityMultiValueLabel: React.FC<MultiValueGenericProps> = ({
  children,
  ...props
}) => {
  const activityType = activityTypesQuery.getEntity(props.data?.value);
  if (!activityType) {
    console.warn(`activityType ${props?.data?.value} could not be found`);
    return null;
  }
  return (
    <ReactSelectComponents.MultiValueLabel {...props}>
      {ActivityTypeEmojiMap[activityType.id]} {children}
    </ReactSelectComponents.MultiValueLabel>
  );
};

import React from "react";
import {
  MultiValueGenericProps,
  OptionProps,
  Options,
  components as ReactSelectComponents,
  StylesConfig,
} from "react-select";

import type { CSSObject } from "@emotion/serialize";
import chroma from "chroma-js";

import { ActivityTypeEmojiMap } from "@tony/cv-data/constants";

import { useMst } from "./mobx";
import { LanguageTag, OrgTypeTag } from "./Tag";

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

export const getSelectOptions = (items: string[]): ISelectOption =>
  items.map((actorName) => ({
    label: actorName,
    value: actorName,
  })) as ISelectOption;

export const OrgOption: React.FC<OptionProps<IOptionType, boolean>> = ({
  children,
  ...props
}) => {
  const cvState = useMst();
  const org = cvState.orgs.find(({ id }) => id === props.data?.value);
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

          {/*org.languages.map((languageId) => (
            <LanguageTag
              languageName={languageId}
              key={languageId}
              className="tag"
              style={{
                marginLeft: ".5rem",
              }}
            />
          ))*/}
        </div>
      )}
    </ReactSelectComponents.Option>
  );
};

export const LanguageOption: React.FC<OptionProps<IOptionType, boolean>> = ({
  data,
  ...props
}) => {
  const cvState = useMst();
  const languageName = data?.value;

  if (!languageName) {
    console.warn(`${languageName} missing from option`);
    return null;
  }
  return (
    <ReactSelectComponents.Option {...props} data={data} className="df">
      <LanguageTag
        languageName={languageName}
        key={languageName}
        className="tag ml0"
      />
      <div className="activityCount">
        {cvState.languageYearMap[languageName]} results
      </div>
    </ReactSelectComponents.Option>
  );
};

export const languagesStyles: StylesConfig<IOptionType, boolean> = {
  option: (styles: CSSObject, { data, isFocused, isSelected }) => {
    const cvState = useMst();
    const language = cvState.languages.find(({ id }) => id === data.value);
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
    const cvState = useMst();
    const language = cvState.languages.find(({ id }) => id === data.value);

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
    const cvState = useMst();
    const language = cvState.languages.find(({ id }) => id === data.value);
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
    const cvState = useMst();
    const activityType = cvState.activityTypes.find(
      ({ id }) => id === data.value,
    );
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
    const cvState = useMst();
    const activityType = cvState.activityTypes.find(
      ({ id }) => id === data.value,
    );
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
    const cvState = useMst();
    const activityType = cvState.activityTypes.find(
      ({ id }) => id === data.value,
    );
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

export const ActivityTypeOption: React.FC<
  OptionProps<IOptionType, boolean>
> = ({ children, ...props }) => {
  const cvState = useMst();
  const activityType = cvState.activityTypes.find(
    ({ id }) => id === props.data?.value,
  );
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
  const cvState = useMst();
  const activityType = cvState.activityTypes.find(
    ({ id }) => id === props.data?.value,
  );
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

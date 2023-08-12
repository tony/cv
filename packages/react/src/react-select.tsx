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

import { CategoryEmojiMap } from "@tony/cv-data/constants";

import { useMst } from "./mobx";
import { LanguageTag, OrgTypeTag } from "./Tag";

export interface OptionType {
  readonly label: string;
  readonly value: string;
}
export interface StyleOption extends OptionType {
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}
export type SelectOption = Options<OptionType>;

export const getSelectOptions = (items: string[]): SelectOption =>
  items.map((actorName) => ({
    label: actorName,
    value: actorName,
  })) as SelectOption;

export const orgStyles: StylesConfig<StyleOption, true> = {
  option: (styles: CSSObject, _props) => {
    return {
      ...styles,
      fontSize: "0.8rem",
      wordWrap: "break-word",
      wordBreak: "break-all",
      alignItems: "center",
    };
  },
};

export const OrgOption: React.FC<OptionProps<StyleOption, true>> = ({
  children,
  isSelected,
  ...props
}) => {
  const cvState = useMst();
  const org = cvState.orgs.find(({ id }) => id === props.data?.value);
  return (
    <ReactSelectComponents.Option
      {...props}
      className={`df dropdownLanguageOption ${isSelected ? "selected" : ""}`}
      isSelected={isSelected}
    >
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

export const LanguageOption: React.FC<OptionProps<StyleOption, true>> = ({
  data,
  isSelected,
  ...props
}) => {
  const cvState = useMst();
  const languageName = data?.value;

  if (!languageName) {
    console.warn(`${languageName} missing from option`);
    return null;
  }
  return (
    <ReactSelectComponents.Option
      {...props}
      data={data}
      isSelected={isSelected}
      className={`df dropdownLanguageOption ${isSelected ? "selected" : ""}`}
    >
      <LanguageTag
        languageName={languageName}
        key={languageName}
        className="tag ml0"
      />
      <div className="activityCount">
        {cvState.languageUsageStats[languageName]} results
      </div>
    </ReactSelectComponents.Option>
  );
};

export const languageStyles: StylesConfig<StyleOption, true> = {
  option: (styles: CSSObject, { data, isFocused, isSelected }) => {
    const cvState = useMst();
    const language = cvState.languages.find(({ id }) => id === data.value);
    if (!language?.ui?.backgroundColor || !language?.ui?.color) {
      return styles;
    }
    const hoverBackgroundColor = chroma(language.ui.backgroundColor)
      .alpha(0.8)
      .css();
    const selectedBackgroundColor = chroma(hoverBackgroundColor)
      .alpha(0.6)
      .css();
    const hoverStyle = {
      backgroundColor: hoverBackgroundColor,
      color: chroma(hoverBackgroundColor).get("lab.l") > 80 ? "black" : "white",
    };

    return {
      ...styles,
      fontSize: "0.8rem",
      wordWrap: "break-word",
      wordBreak: "break-all",
      ...(isFocused || isSelected ? hoverStyle : {}),
      "&:hover": hoverStyle,
      "&.selected": {
        ...hoverStyle,
        backgroundColor: selectedBackgroundColor,
        fontWeight: "bold",
      },
      "&.selected:hover": {
        backgroundColor: hoverBackgroundColor,
      },
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

    const hoverBackgroundColor =
      chroma(language.ui.backgroundColor).get("lab.l") > 80
        ? chroma(language.ui.backgroundColor).brighten(0.2)
        : chroma(language.ui.backgroundColor).brighten(0.4);
    const selectedBackgroundColor = chroma(hoverBackgroundColor)
      .alpha(0.6)
      .css();
    const hoverStyle = {
      backgroundColor: hoverBackgroundColor,
      color: chroma(hoverBackgroundColor).get("lab.l") > 80 ? "black" : "white",
    };

    return {
      ...styles,
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
      ...language.ui,
      ":hover": hoverStyle,
      "&.selected": {
        ...hoverStyle,
        backgroundColor: selectedBackgroundColor,
        fontWeight: "bold",
      },
      "&.selected:hover": {
        backgroundColor: hoverBackgroundColor,
      },
    };
  },
};

export const categoriestyles: StylesConfig<StyleOption, true> = {
  option: (styles: CSSObject, { data, isFocused, isSelected }) => {
    const cvState = useMst();
    const category = cvState.categories.find(({ id }) => id === data.value);
    if (!category?.ui?.backgroundColor || !category?.ui?.color) {
      return styles;
    }
    const hoverBackgroundColor = chroma(category.ui.backgroundColor)
      .alpha(0.8)
      .css();
    const selectedBackgroundColor = chroma(hoverBackgroundColor)
      .alpha(0.6)
      .css();
    const hoverStyle = {
      backgroundColor: hoverBackgroundColor,
      color: chroma(hoverBackgroundColor).get("lab.l") > 80 ? "black" : "white",
    };
    return {
      ...styles,
      ...(isFocused || isSelected ? hoverStyle : {}),
      fontSize: "0.8rem",
      wordWrap: "break-word",
      wordBreak: "break-all",
      "&:hover": hoverStyle,
      "&.selected": {
        ...hoverStyle,
        backgroundColor: selectedBackgroundColor,
        fontWeight: "bold",
      },
      "&.selected:hover": {
        backgroundColor: hoverBackgroundColor,
        color:
          chroma(hoverBackgroundColor).get("lab.l") > 80 ? "black" : "white",
      },
    };
  },

  multiValueLabel: (styles, { data }) => {
    const cvState = useMst();
    const category = cvState.categories.find(({ id }) => id === data.value);
    if (!category?.ui) {
      return styles;
    }
    return {
      ...styles,
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
      paddingRight: "4px",
      display: "flex",
      placeItems: "center",
      ...category.ui,
    };
  },
  multiValueRemove: (styles, { data = {} }) => {
    const cvState = useMst();
    const category = cvState.categories.find(({ id }) => id === data.value);
    if (!category?.ui?.backgroundColor) {
      return styles;
    }

    const hoverBackgroundColor =
      chroma(category.ui.backgroundColor).get("lab.l") > 80
        ? chroma(category.ui.backgroundColor).brighten(0.2)
        : chroma(category.ui.backgroundColor).brighten(0.4);
    const hoverStyle = {
      backgroundColor: hoverBackgroundColor.css(),
      color: chroma(hoverBackgroundColor).get("lab.l") > 80 ? "black" : "white",
    };

    return {
      ...styles,
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
      ...category.ui,
      ":hover": hoverStyle,
    };
  },
};

export const CategoryOption: React.FC<OptionProps<StyleOption, true>> = ({
  children,
  isSelected,
  ...props
}) => {
  const cvState = useMst();
  const category = cvState.categories.find(
    ({ id }) => id === props.data?.value,
  );
  if (!category) {
    console.warn(`category ${props?.data?.value} could not be found`);
    return null;
  }
  return (
    <ReactSelectComponents.Option
      {...props}
      isSelected={isSelected}
      className={`dropdownCategoryOption ${isSelected ? "selected" : ""}`}
    >
      {category.id && <>{CategoryEmojiMap[category.id]}</>} {children}
    </ReactSelectComponents.Option>
  );
};

export const ActivityMultiValueLabel: React.FC<MultiValueGenericProps> = ({
  children,
  ...props
}) => {
  const cvState = useMst();
  const category = cvState.categories.find(
    ({ id }) => id === props.data?.value,
  );
  if (!category) {
    console.warn(`category ${props?.data?.value} could not be found`);
    return null;
  }
  return (
    <ReactSelectComponents.MultiValueLabel {...props}>
      {CategoryEmojiMap[category.id]} {children}
    </ReactSelectComponents.MultiValueLabel>
  );
};

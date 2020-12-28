import React from "react";

import { components as ReactSelectComponents } from "react-select";
import { SelectComponentsProps } from "react-select";
import type { StylesConfig } from "react-select";
import type { OptionProps, ValueType } from "react-select/src/types";

import chroma from "chroma-js";

import { languagesQuery, orgsQuery } from "../../lib/hub";
import { LanguageTag, OrgTypeTag } from "./Card";

export type ISelectOption = Pick<OptionProps, "label" | "value">;

export interface IOptionType {
  label: string;
  value: string;
}

export const getSelectOptions = (items: string[]): ISelectOption[] =>
  items.map((actorName) => ({
    label: actorName,
    value: actorName,
  })) as ISelectOption[];

export const onSelectChange = (setState: () => void): void => (
  value: ValueType<IOptionType, boolean>
) => {
  if (value) {
    setState((value as IOptionType[]).map(({ value: v }) => v));
  } else {
    setState([]);
  }
};

export const OrgOption: React.FC<SelectComponentsProps> = ({
  children,
  data,
  ...props
}) => {
  const org = orgsQuery.getEntity(data?.value);
  return (
    <ReactSelectComponents.Option {...props}>
      {children}{" "}
      {org?.orgType && (
        <>
          <OrgTypeTag orgTypeName={org.orgType}>{org.orgType}</OrgTypeTag>

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
        </>
      )}
    </ReactSelectComponents.Option>
  );
};

export const LanguageOption: React.FC<SelectComponentsProps> = ({
  data,
  ...props
}) => {
  const languageName = data?.value;
  if (!languageName) {
    console.warn(`${languageName} missing from option`);
    return null;
  }
  return (
    <ReactSelectComponents.Option {...props} data={data}>
      <LanguageTag
        languageName={languageName}
        key={languageName}
        className="tag"
      />
    </ReactSelectComponents.Option>
  );
};

export const languagesStyles: StylesConfig = {
  option: (styles, { data, isFocused, isSelected }) => {
    const language = languagesQuery.getEntity(data.value);
    if (!language?.ui?.backgroundColor && !language?.ui?.color) {
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

  multiValue: (styles, { data }) => {
    const language = languagesQuery.getEntity(data.value);
    return {
      ...styles,
      backgroundColor: language?.ui?.backgroundColor,
    };
  },
  multiValueLabel: (styles, { data }) => {
    const language = languagesQuery.getEntity(data.value);
    return {
      ...styles,
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
      ...(language?.ui?.backgroundColor && language?.ui?.color
        ? {
            backgroundColor: language?.ui?.backgroundColor ?? "white",
            color: language?.ui?.color ?? "white",
            borderRight: "rgba(0,0,0, .1) 1px solid",
          }
        : {}),
    };
  },
  multiValueRemove: (styles, { data }) => {
    const language = languagesQuery.getEntity(data.value);
    return {
      ...styles,
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
      ...(language?.ui?.backgroundColor && language?.ui?.color
        ? {
            backgroundColor: language?.ui?.backgroundColor ?? "white",
            color: language?.ui?.color ?? "white",
          }
        : {}),
    };
  },
};

import React from "react";

import { components as ReactSelectComponents } from "react-select";
import { SelectComponentsProps } from "react-select";
import type { StylesConfig } from "react-select";
import type { OptionProps, ValueType } from "react-select/src/types";

import chroma from "chroma-js";

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
  const org = $$queries.orgs.getEntity(data?.value);
  return (
    <ReactSelectComponents.Option {...props}>
      {children}{" "}
      {org?.orgType && (
        <>
          <div
            style={{
              display: "inline-flex",
              fontSize: ".75rem",
              lineHeight: 1.5,
              whiteSpace: "nowrap",
              color: "#4a4a4a",
              backgroundColor: "#f5f5f5",
              padding: ".3rem .5rem",
              borderRadius: ".3rem",
            }}
          >
            {org.orgType}
          </div>

          {org.languages.map((languageId) => {
            const language = $$queries.languages.getEntity(languageId);
            if (!language) {
              return null;
            }
            return (
              <div
                key={languageId}
                className="tag"
                style={{
                  color: language?.ui?.backgroundColor
                    ? chroma(language?.ui?.backgroundColor).get("lab.l") > 70
                      ? "black"
                      : "white"
                    : "#4a4a4a",
                  backgroundColor: language?.ui?.backgroundColor ?? "#f5f5f5",
                  marginLeft: ".5rem",
                }}
              >
                {languageId}
              </div>
            );
          })}
        </>
      )}
    </ReactSelectComponents.Option>
  );
};

export const languagesStyles: StylesConfig = {
  option: (styles, { data }) => {
    const language = $$queries.languages.getEntity(data.value);
    if (!language?.ui?.backgroundColor && !language?.ui?.textColor) {
      return styles;
    }
    const backgroundColor = chroma(language.ui.backgroundColor)
      .alpha(0.8)
      .css();
    return {
      ...styles,
      backgroundColor,
      color: chroma(backgroundColor).get("lab.l") > 80 ? "black" : "white",
      "&:hover": {
        backgroundColor: "#DEEBFF",
        color: "black",
      },
    };
  },

  multiValue: (styles, { data }) => {
    const language = $$queries.languages.getEntity(data.value);
    return {
      ...styles,
      backgroundColor: language?.ui?.backgroundColor,
    };
  },
  multiValueLabel: (styles, { data }) => {
    const language = $$queries.languages.getEntity(data.value);
    return {
      ...styles,
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
      ...(language?.ui?.backgroundColor && language?.ui?.textColor
        ? {
            backgroundColor: language?.ui?.backgroundColor ?? "white",
            color: language?.ui?.textColor ?? "white",
            borderRight: "rgba(0,0,0, .1) 1px solid",
          }
        : {}),
    };
  },
  multiValueRemove: (styles, { data }) => {
    const language = $$queries.languages.getEntity(data.value);
    return {
      ...styles,
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
      ...(language?.ui?.backgroundColor && language?.ui?.textColor
        ? {
            backgroundColor: language?.ui?.backgroundColor ?? "white",
            color: language?.ui?.textColor ?? "white",
          }
        : {}),
    };
  },
};

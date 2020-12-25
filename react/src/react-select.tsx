import React from "react";

import { components as ReactSelectComponents } from "react-select";
import { ActionMeta, OptionProps, ValueType } from "react-select/src/types"; // tslint:disable-line no-submodule-imports
import type { EntityStore, MultiActiveState, Store } from "@datorama/akita";
import chroma from "chroma-js";

export type ISelectOption = Pick<OptionProps, "label" | "value">;

export interface IOptionType {
  label: string;
  value: string;
}

export const getSelectOptions = (items: string[]) =>
  items.map((actorName) => ({
    label: actorName,
    value: actorName,
  })) as ISelectOption[];

export const onSelectChange = (setState: (_: any) => void) => (
  value: ValueType<IOptionType, boolean>,
  _: ActionMeta<IOptionType>
) => {
  if (value) {
    setState((value as IOptionType[]).map(({ value: v }) => v));
  } else {
    setState([]);
  }
};

export const OrgOption = ({ children, data, ...props }) => {
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
                style={{
                  display: "inline-flex",
                  fontSize: ".75rem",
                  lineHeight: 1.5,
                  whiteSpace: "nowrap",
                  color: language?.color
                    ? chroma(language?.color).get("lab.l") > 70
                      ? "black"
                      : "white"
                    : "#4a4a4a",
                  backgroundColor: language?.color ?? "#f5f5f5",
                  padding: ".3rem .5rem",
                  marginLeft: ".5rem",
                  borderRadius: ".3rem",
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

export const languagesStyles = {
  option: (styles, { data }) => {
    const language = $$queries.languages.getEntity(data.value);
    if (!language?.color && !language?.textColor) {
      return styles;
    }
    const backgroundColor = chroma(language.color).alpha(0.5).css();
    return {
      ...styles,
      backgroundColor,
      color: chroma(backgroundColor).get("lab.l") > 80 ? "black" : "white",
      "&:hover": {
        backgroundColor: "#DEEBFF",
      },
    };
  },

  multiValue: (styles, { data }) => {
    const language = $$queries.languages.getEntity(data.value);
    // const color = chroma(data.color);
    return {
      ...styles,
      // backgroundColor: color.alpha(0.1).css(),
      backgroundColor: language.color,
    };
  },
  multiValueLabel: (styles, { data }) => {
    const language = $$queries.languages.getEntity(data.value);
    return {
      ...styles,
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
      ...(language?.color && language?.textColor
        ? {
            backgroundColor: language?.color ?? "white",
            color: language?.textColor ?? "white",
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
      ...(language?.color && language?.textColor
        ? {
            backgroundColor: language?.color ?? "white",
            color: language?.textColor ?? "white",
          }
        : {}),
    };
  },
};

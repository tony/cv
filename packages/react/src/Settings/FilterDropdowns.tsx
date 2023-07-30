import React from "react";
import Select, {
  components as ReactSelectComponents,
  type GroupBase,
  type MultiValueProps,
  type Props,
  type PropsValue,
} from "react-select";

import { useMst } from "../mobx";
import {
  ActivityMultiValueLabel,
  ActivityTypeOption,
  activityTypeStyles,
  getSelectOptions,
  LanguageOption,
  languagesStyles,
  OrgOption,
  type IOptionType,
  type ISelectOption,
} from "../react-select";

function CustomSelect<
  Option extends IOptionType,
  IsMulti extends boolean = true,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: Props<Option, IsMulti, Group>) {
  return (
    <Select {...props} theme={(theme) => ({ ...theme, borderRadius: 0 })} />
  );
}

const EllipsisLabel: React.FC<{ items: string[] }> = ({ items }) => {
  const style = {
    marginLeft: "auto",
    borderRadius: ".1rem",
    fontSize: ".7rem",
    padding: ".1rem",
    order: 5,
  };

  const title = items.join(", ");
  const itemsSelectedCount = items.length;
  const label = `+ ${itemsSelectedCount} selected item${
    itemsSelectedCount !== 1 ? "s" : ""
  }`;

  return (
    <div style={style} title={title}>
      {label}
    </div>
  );
};

const MultiValue: React.FC<
  MultiValueProps & { itemsSelectCountMax: number }
> = ({ index, getValue, itemsSelectCountMax = 3, ...props }) => {
  const overflow = getValue()
    .slice(itemsSelectCountMax)
    .map((x) => x.label);

  return index < itemsSelectCountMax ? (
    <ReactSelectComponents.MultiValue {...props} />
  ) : index === itemsSelectCountMax ? (
    <EllipsisLabel items={overflow} />
  ) : null;
};

export const FilterDropdowns: React.FC = () => {
  const cvState = useMst();
  return (
    <div className="dropdownRow">
      <CustomSelect
        options={getSelectOptions(
          Object.values(cvState.languages ?? {}).map(({ id }) => id as string),
        )}
        isMulti
        onChange={(value: PropsValue<IOptionType>): void => {
          cvState.setLanguages(
            (value as IOptionType[]).map(({ value: v }) => v),
          );
        }}
        className="react-select"
        placeholder="Language"
        styles={languagesStyles}
        components={{ Option: LanguageOption, MultiValue }}
      />
      <CustomSelect
        options={
          cvState.activityTypes.map((a) => ({
            label: a.name,
            value: a.id,
          })) as ISelectOption
        }
        isMulti={true}
        onChange={(value: PropsValue<IOptionType>): void => {
          cvState.setActivityTypes(
            (value as IOptionType[]).map(({ value: v }) => v),
          );
        }}
        className="react-select"
        placeholder="Event type"
        styles={activityTypeStyles}
        components={{
          Option: ActivityTypeOption,
          MultiValueLabel: ActivityMultiValueLabel,
          MultiValue,
        }}
      />
      <CustomSelect
        options={
          cvState.orgs.map((org) => ({
            label: org.name,
            value: org.id?.toString() ?? org.id,
          })) as ISelectOption
        }
        isMulti={true}
        onChange={(value: PropsValue<IOptionType>): void => {
          cvState.setOrgs((value as IOptionType[]).map(({ value: v }) => v));
        }}
        className="react-select"
        placeholder="Topic"
        components={{ Option: OrgOption, MultiValue }}
      />
    </div>
  );
};

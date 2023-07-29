import React from "react";
import Select, {
  type GroupBase,
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
        components={{ Option: LanguageOption }}
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
        components={{ Option: OrgOption }}
      />
    </div>
  );
};

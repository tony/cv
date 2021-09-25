import React from "react";
import Select from "react-select";
import type { GroupBase, Props } from "react-select";

import {
  activityTypesQuery,
  languagesQuery,
  orgsQuery,
} from "@tony/cv-lib/hub";

import {
  ActivityMultiValueLabel,
  activityTypeStyles,
  getSelectOptions,
  languagesStyles,
  LanguageOption,
  ActivityTypeOption,
  OrgOption,
  onLanguageChange,
  onOrgChange,
  onActivityTypeChange,
} from "../react-select";
import type { IOptionType, ISelectOption } from "../react-select";

function CustomSelect<
  Option extends IOptionType,
  IsMulti extends boolean = true,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
  return (
    <Select {...props} theme={(theme) => ({ ...theme, borderRadius: 0 })} />
  );
}

export const FilterDropdowns: React.FC = () => {
  return (
    <div className="dropdownRow">
      <CustomSelect
        options={getSelectOptions(
          Object.values(languagesQuery?.getValue()?.entities ?? {}).map(
            (lang) => lang.id as string
          )
        )}
        isMulti
        onChange={onLanguageChange}
        className="react-select"
        placeholder="Language"
        styles={languagesStyles}
        components={{ Option: LanguageOption }}
      />
      <CustomSelect
        options={
          activityTypesQuery.getAll().map((a) => ({
            label: a.name,
            value: a.id,
          })) as ISelectOption
        }
        isMulti={true}
        onChange={onActivityTypeChange}
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
          orgsQuery.getAll().map((org) => ({
            label: org.name,
            value: org.id?.toString() ?? org.id,
          })) as ISelectOption
        }
        isMulti={true}
        onChange={onOrgChange}
        className="react-select"
        placeholder="Topic"
        components={{ Option: OrgOption }}
      />
    </div>
  );
};

import React from "react";
import Select from "react-select";

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
import type { ISelectOption } from "../react-select";

export const FilterDropdowns: React.FC = () => {
  const languageSelectRef = React.useRef<Select>(null);
  return (
    <div className="dropdownRow">
      <Select
        options={getSelectOptions(
          Object.values(languagesQuery?.getValue()?.entities ?? {}).map(
            (lang) => lang.id as string
          )
        )}
        ref={languageSelectRef}
        isMulti
        onChange={onLanguageChange}
        className="react-select"
        placeholder="Language"
        styles={languagesStyles}
        components={{ Option: LanguageOption }}
      />
      <Select
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
      <Select
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

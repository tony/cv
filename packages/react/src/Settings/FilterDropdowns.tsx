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
  orgStyles,
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

declare module "react-select/dist/declarations/src/Select" {
  export interface Props<
    Option,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    IsMulti extends boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Group extends GroupBase<Option>,
  > {
    maxItemsSelectCount?: number;
    objectLabelSingular?: string;
    objectLabelPlural?: string;
  }
}

const EllipsisLabel: React.FC<{
  items: string[];
  objectLabelSingular?: string;
  objectLabelPlural?: string;
}> = ({ items, objectLabelSingular = "item", objectLabelPlural = "items" }) => {
  const style = {
    marginLeft: "auto",
    borderRadius: ".1rem",
    fontSize: ".7rem",
    padding: ".1rem",
    order: 5,
  };

  const title = items.join(", ");
  const itemsSelectedCount = items.length;
  const label = `+ ${itemsSelectedCount} selected ${
    itemsSelectedCount !== 1 ? objectLabelPlural : objectLabelSingular
  }`;

  return (
    <div style={style} title={title}>
      {label}
    </div>
  );
};

const MAX_ITEMS_CUTOFF_COUNT = 3;

export const MultiValue: React.FC<MultiValueProps<IOptionType>> = ({
  index,
  getValue,
  ...props
}) => {
  /**
   * Shows count only.
   *
   * Assume:
   * - [ item 1, item 2, item 3, item 4, item 5 ]
   * - Defaults for objectLabelSingular ("item") and objectLabelPlural ("items") and
   *   maxItemsSelectCount (MAX_ITEMS_CUTOFF_COUNT).
   *
   * If selected: [ item 1 ], then:
   * Renders: [ item 1 ]
   *
   * If selected: [ item 1, item 2, item 3, item 4 ], then:
   * Renders: [ item 1, item 2, item 3, item 4 ] + 1 selected item
   *
   * If selected: [ item 1, item 2, item 3, item 4, item 5 ], then:
   * Renders: [ item 1, item 2, item 3, item 4 ] + 2 selected items
   */
  const {
    maxItemsSelectCount = MAX_ITEMS_CUTOFF_COUNT,
    objectLabelSingular,
    objectLabelPlural,
  } = props.selectProps;
  const overflow = getValue()
    .slice(maxItemsSelectCount)
    .map((x) => x.label);

  return index < maxItemsSelectCount ? (
    <ReactSelectComponents.MultiValue
      index={index}
      getValue={getValue}
      {...props}
    />
  ) : index === maxItemsSelectCount ? (
    <EllipsisLabel
      items={overflow}
      objectLabelSingular={objectLabelSingular}
      objectLabelPlural={objectLabelPlural}
    />
  ) : null;
};

const MultiValueCount: React.FC<MultiValueProps<IOptionType>> = ({
  index,
  getValue,
  selectProps,
}) => {
  /**
   * Shows count only.
   *
   * Assume:
   * - [ item 1, item 2, item 3, item 4 ]
   * - Defaults for objectLabelSingular ("item") and objectLabelPlural ("items")
   *
   * If selected: [ item 1 ], then:
   * Renders: 2 selected item
   *
   * If selected: [ item 1, item 2, item 3], then:
   * Renders: 2 selected items
   */
  const {
    maxItemsSelectCount = MAX_ITEMS_CUTOFF_COUNT,
    objectLabelSingular,
    objectLabelPlural,
  } = selectProps;
  const overflow = getValue()
    .slice(maxItemsSelectCount)
    .map((x) => x.label);
  const style = {
    marginRight: "auto",
    borderRadius: ".1rem",
    fontSize: ".9rem",
    padding: ".1rem",
    order: 5,
  };

  const title = overflow.join(", ");
  const itemsSelectedCount = overflow.length + 1;
  const label = `${itemsSelectedCount} selected ${
    itemsSelectedCount !== 1 ? objectLabelPlural : objectLabelSingular
  }`;

  return index === 0 ? (
    <div style={style} title={title}>
      {label}
    </div>
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
        components={{ Option: LanguageOption, MultiValue: MultiValueCount }}
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        blurInputOnSelect={false}
        maxItemsSelectCount={1}
        objectLabelSingular="language"
        objectLabelPlural="languages"
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
          MultiValue: MultiValueCount,
        }}
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        blurInputOnSelect={false}
        maxItemsSelectCount={1}
        objectLabelSingular="event type"
        objectLabelPlural="event types"
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
        placeholder="Organization and projects"
        styles={orgStyles}
        components={{ Option: OrgOption, MultiValue: MultiValueCount }}
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        blurInputOnSelect={false}
        maxItemsSelectCount={1}
        objectLabelSingular="org / project"
        objectLabelPlural="orgs / projects"
      />
    </div>
  );
};

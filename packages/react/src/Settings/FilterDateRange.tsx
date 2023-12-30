import React from "react";

import CSS from "csstype";

import Select, {
  components as ReactSelectComponents,
  type Props,
  type PropsValue,
  type StylesConfig,
  type SingleValueProps,
  type Options,
  type OptionProps,
  type SingleValue as SingleValueType,
  type GroupBase,
} from "react-select";

import { INITIAL_SEARCH_OPTIONS } from "@tony/cv-lib/search/mobx";

import { useMst } from "../mobx";
import type { OptionType, StyleOption } from "../react-select";

import { DEFAULT_REACT_SELECT_PROPS, colourStyles } from "./FilterDropdowns";

import "./FilterDateRange.css";

export interface YearOptionType {
  readonly label: string;
  readonly value: number;
}
const minYear = INITIAL_SEARCH_OPTIONS.startYear;
const maxYear = INITIAL_SEARCH_OPTIONS.endYear;
const initialRange = [minYear, maxYear];
const YEAR_RANGE = Array.from<number, number>(
  { length: maxYear - minYear + 1 },
  (_, yearNotch) => minYear + yearNotch,
);

const dateRangeStyles: StylesConfig<StyleOption, true> = {
  option: (styles, _props) => {
    return {
      ...styles,
      fontSize: "0.8rem",
      wordWrap: "break-word",
      wordBreak: "break-all",
      alignItems: "center",
    };
  },
};

const YearOption: React.FC<OptionProps<OptionType>> = (props) => {
  const ref = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    props.isSelected &&
      (ref?.current as unknown as HTMLDivElement | undefined)?.scrollIntoView?.(
        {
          block: "nearest",
          inline: "start",
        },
      );
  }, [props.isSelected, ref]);

  return <ReactSelectComponents.Option {...props} innerRef={ref} />;
};

export const SingleValue: React.FC<SingleValueProps<YearOptionType>> = ({
  children,
  ...props
}) => {
  return (
    <ReactSelectComponents.SingleValue {...props}>
      {children === maxYear ? "Present" : children}
    </ReactSelectComponents.SingleValue>
  );
};

const onMenuOpen = () => {
  setTimeout(() => {
    const selectedEl = document.getElementsByClassName(
      "react-select__option--is-selected",
    )[0];
    if (selectedEl) {
      selectedEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, 15);
};

export const FilterDateRange: React.FC = () => {
  const cvState = useMst();

  return (
    <div id="year-range">
      <Select<OptionType, false, GroupBase<OptionType>>
        options={
          YEAR_RANGE.map((year: number) => ({
            label: `${year}`,
            value: `${year}`,
          }))
        }
        onChange={(value: SingleValueType<OptionType>): void => {
          if (value?.value) {
            cvState.setYears({
              startYear: parseInt(value.value),
              endYear: cvState.searchOptions.endYear,
            });
          }
        }}
        styles={{ ...colourStyles, ...dateRangeStyles }}
        placeholder="Start year"
        defaultValue={{
          label: `${minYear}`,
          value: minYear,
        }}
        isOptionDisabled={({ value: year }: YearOptionType) => {
          return year > cvState.searchOptions.endYear;
        }}
        components={{ SingleValue }}
        onMenuOpen={onMenuOpen}
        menuShouldScrollIntoView
        {...DEFAULT_REACT_SELECT_PROPS}
        isSearchable={false}
      />
      <div className="date-range-separator">-</div>
      <Select
        options={YEAR_RANGE.map(
          (year) =>
            ({
              label: year === maxYear ? "Present" : year,
              value: year,
            }) as StyleOption,
        )}
        onChange={(value: PropsValue<OptionType>): void => {
          cvState.setYears({
            startYear: cvState.searchOptions.startYear,
            endYear: parseInt(value.value),
          });
        }}
        styles={{ ...colourStyles, ...dateRangeStyles }}
        placeholder="End year"
        defaultValue={{
          label: "Present",
          value: maxYear,
        }}
        isOptionDisabled={({ value: year }: OptionType) => {
          return year < cvState.searchOptions.startYear;
        }}
        components={{ SingleValue, Option: YearOption }}
        menuShouldScrollIntoView
        {...DEFAULT_REACT_SELECT_PROPS}
        isSearchable={false}
      />
    </div>
  );
};

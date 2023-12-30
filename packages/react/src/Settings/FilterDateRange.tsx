import React from "react";

import CSS from "csstype";

import { useMst } from "../mobx";

import { INITIAL_SEARCH_OPTIONS } from "@tony/cv-lib/search/mobx";
import Select, {
  components as ReactSelectComponents,
  type Props,
  type PropsValue,
  type StylesConfig,
  type SingleValueProps,
  type Options,
  type OptionProps,
} from "react-select";

import { CustomSingleSelect, colourStyles } from "./FilterDropdowns";
import type { OptionType, StyleOption } from "../react-select";

import "./FilterDateRange.css";

const minYear = INITIAL_SEARCH_OPTIONS.startYear;
const maxYear = INITIAL_SEARCH_OPTIONS.endYear;
const initialRange = [minYear, maxYear];
const YEAR_RANGE = Array.from(
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

export const SingleValue: React.FC<SingleValueProps<OptionType>> = ({
  children,
  ...props
}) => {
  return (
    <ReactSelectComponents.SingleValue {...props}>
      {children}
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

export const FilterDateRange: React.FC<{
  lineColor: CSS.Properties["backgroundColor"];
}> = ({ lineColor }) => {
  const cvState = useMst();

  return (
    <div id="year-range">
      <CustomSingleSelect
        options={YEAR_RANGE.map(
          (year) =>
            ({
              label: year,
              value: year,
            }) as StyleOption,
        )}
        onChange={(value: PropsValue<OptionType>): void => {
          cvState.setYears({
            startYear: parseInt(value.value),
            endYear: cvState.searchOptions.endYear,
          });
        }}
        styles={{ ...colourStyles, ...dateRangeStyles }}
        placeholder="Start year"
        defaultValue={{
          label: minYear,
          value: minYear,
        }}
        isOptionDisabled={({ value: year }: OptionType) => {
          return year > cvState.searchOptions.endYear;
        }}
        components={{ SingleValue }}
        onMenuOpen={onMenuOpen}
        menuShouldScrollIntoView
      />
      <div className="date-range-separator">-</div>
      <CustomSingleSelect
        options={YEAR_RANGE.map(
          (year) =>
            ({
              label: year,
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
          label: maxYear,
          value: maxYear,
        }}
        isOptionDisabled={({ value: year }: OptionType) => {
          return year < cvState.searchOptions.startYear;
        }}
        components={{ SingleValue, Option: YearOption }}
        menuShouldScrollIntoView
      />
    </div>
  );
};

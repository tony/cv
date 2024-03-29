import React from "react";

import CSS from "csstype";

import Select, {
  type OptionProps,
  type Options,
  type Props,
  type PropsValue,
  type SingleValueProps,
  type StylesConfig,
  components as ReactSelectComponents,
} from "react-select";

import { INITIAL_SEARCH_OPTIONS } from "@tony/cv-lib/search/mobx";

import { useMst } from "../mobx";
import type { OptionType, StyleOption } from "../react-select";

import { DEFAULT_REACT_SELECT_PROPS, colourStyles } from "./FilterDropdowns";

import { action } from "mobx";
import { observer } from "mobx-react-lite";
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
  }, [props.isSelected]);

  return <ReactSelectComponents.Option {...props} innerRef={ref} />;
};

export const SingleValue: React.FC<SingleValueProps<OptionType>> = ({
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

export const FilterDateRange: React.FC = observer(() => {
  const cvState = useMst();

  return (
    <div id="year-range">
      <Select
        options={YEAR_RANGE.map(
          (year) =>
            ({
              label: year === maxYear ? "Present" : year,
              value: year,
            }) as StyleOption,
        )}
        onChange={action((value: PropsValue<OptionType>): void => {
          cvState.setYears({
            startYear: Number.parseInt(value.value),
            endYear: cvState.searchOptions.endYear,
          });
        })}
        styles={{ ...colourStyles, ...dateRangeStyles }}
        placeholder="Start year"
        defaultValue={{
          label: minYear,
          value: minYear,
        }}
        isOptionDisabled={action(({ value: year }: OptionType) => {
          return year > cvState.searchOptions.endYear;
        })}
        components={{ SingleValue }}
        onMenuOpen={onMenuOpen}
        menuShouldScrollIntoView
        {...DEFAULT_REACT_SELECT_PROPS}
        isSearchable={false}
      />
      <div className="date-range-separator px-2">-</div>
      <Select
        options={YEAR_RANGE.map(
          (year) =>
            ({
              label: year === maxYear ? "Present" : year,
              value: year,
            }) as StyleOption,
        )}
        onChange={action((value: PropsValue<OptionType>): void => {
          cvState.setYears({
            startYear: cvState.searchOptions.startYear,
            endYear: Number.parseInt(value.value),
          });
        })}
        styles={{ ...colourStyles, ...dateRangeStyles }}
        placeholder="End year"
        defaultValue={{
          label: "Present",
          value: maxYear,
        }}
        isOptionDisabled={action(({ value: year }: OptionType) => {
          return year < cvState.searchOptions.startYear;
        })}
        components={{ SingleValue, Option: YearOption }}
        menuShouldScrollIntoView
        {...DEFAULT_REACT_SELECT_PROPS}
        isSearchable={false}
      />
    </div>
  );
});

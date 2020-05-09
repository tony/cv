import { ActionMeta, OptionProps, ValueType } from "react-select/src/types"; // tslint:disable-line no-submodule-imports

type ISelectOption = Pick<OptionProps, "label" | "value">;

interface IOptionType {
  label: string;
  value: string;
}

export const getSelectOptions = (items: string[]) =>
  items.map((actorName) => ({
    label: actorName,
    value: actorName,
  })) as ISelectOption[];

export const onSelectChange = (setState: (_: any) => void) => (
  value: ValueType<IOptionType>,
  _: ActionMeta<IOptionType>
) => {
  if (value) {
    setState((value as IOptionType[]).map(({ value: v }) => v));
  } else {
    setState([]);
  }
};

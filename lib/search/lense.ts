export type PredicateFn<ValueT> = (value: ValueT) => boolean;

export interface ILense<T> {
  filterFn: PredicateFn<T>;
  label: string;
}

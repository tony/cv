export const difference = (
  left: Set<unknown> | unknown[],
  right: Set<unknown> | unknown[]
): unknown[] => {
  const a = new Set(left);
  const b = new Set(right);
  return Array.from(a).filter((x) => !b.has(x));
};

export const hasAny = (
  left: Set<unknown> | unknown[],
  right: Set<unknown> | unknown[]
): unknown[] => {
  const a = new Set(left);
  const b = new Set(right);
  return Array.from(a).filter((x) => b.has(x));
};

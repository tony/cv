/** Credit: @juliencrn/usehooks-ts
 * Repo: https://github.com/juliencrn/usehooks-ts
 * License: https://github.com/juliencrn/usehooks-ts/blob/master/LICENSE
 */
import React from "react";

// https://usehooks-ts.com/react-hook/use-isomorphic-layout-effect
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

// MediaQueryList Event based useEventListener interface
function useEventListener<K extends keyof MediaQueryListEventMap>(
  eventName: K,
  handler: (event: MediaQueryListEventMap[K]) => void,
  element: React.RefObject<MediaQueryList>,
  options?: boolean | AddEventListenerOptions,
): void;

// Window Event based useEventListener interface
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions,
): void;

// Element Event based useEventListener interface
function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement,
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: React.RefObject<T>,
  options?: boolean | AddEventListenerOptions,
): void;

// Document Event based useEventListener interface
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: React.RefObject<Document>,
  options?: boolean | AddEventListenerOptions,
): void;

// Credit: https://usehooks-ts.com/react-hook/use-event-listener
// License: MIT
export function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  KM extends keyof MediaQueryListEventMap,
  // biome-ignore lint: lint/suspicious/noConfusingVoidType
  T extends HTMLElement | MediaQueryList | void = void,
>(
  eventName: KW | KH | KM,
  handler: (
    event:
      | WindowEventMap[KW]
      | HTMLElementEventMap[KH]
      | MediaQueryListEventMap[KM]
      | Event,
  ) => void,
  element?: React.RefObject<T>,
  options?: boolean | AddEventListenerOptions,
) {
  // Create a ref that stores handler
  const savedHandler = React.useRef(handler);

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  React.useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current ?? window;

    if (!targetElement?.addEventListener) return;

    // Create event listener that calls handler function stored in ref
    const listener: typeof handler = (event) => savedHandler.current(event);

    targetElement.addEventListener(eventName, listener, options);

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, listener, options);
    };
  }, [savedHandler, eventName, handler, element, options]);
}

interface Size {
  width: number;
  height: number;
}

// Credit: https://usehooks-ts.com/react-hook/use-element-size
// License: MIT
export function useElementSize<T extends HTMLElement = HTMLDivElement>(): [
  (node: T | null) => void,
  Size,
] {
  // Mutable values like 'ref.current' aren't valid dependencies
  // because mutating them doesn't re-render the component.
  // Instead, we use a state as a ref to be reactive.
  const [ref, setRef] = React.useState<T | null>(null);
  const [size, setSize] = React.useState<Size>({
    width: 0,
    height: 0,
  });

  // Prevent too many rendering using useCallback
  const handleSize = React.useCallback(() => {
    setSize({
      width: ref?.offsetWidth || 0,
      height: ref?.offsetHeight || 0,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.offsetHeight, ref?.offsetWidth, setSize]);

  useEventListener("resize", handleSize);

  useIsomorphicLayoutEffect(() => {
    handleSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.offsetHeight, ref?.offsetWidth]);

  return [setRef, size];
}

import React from "react";

//@ts-ignore
import { Switch as SimpleSwitch } from "a-simple-switch";
import "./switcher.css";

type UnpackCustomEvent<T> = T extends CustomEvent<infer U> ? U : never;

// Define custom event types and details here
// Thanks: https://gist.github.com/difosfor/ceeb01d03a8db7dc68d5cd4167d60637
// via https://github.com/Polymer/lit-element/issues/808#issuecomment-566684982
export interface CustomEventMap {
  /**
   * Dispatched when initialized.
   */
  "change.one": CustomEvent<{ checked: boolean }>;
}

export interface CombinedEventMap extends HTMLElementEventMap, CustomEventMap {}

// Add strict event type support to addEventListener etc.
export interface Switcher {
  addEventListener<K extends keyof CombinedEventMap>(
    type: K,
    listener: (this: Switcher, ev: CombinedEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof CombinedEventMap>(
    type: K,
    listener: (this: Switcher, ev: CombinedEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const useForwardRef = <T,>(ref: React.ForwardedRef<T>, initialValue: any = null) => {
  /* Credit: https://github.com/facebook/react/issues/24722#issuecomment-1250855671
   * Changes: Needed to change the else -> else if to satisfy TypeScript
   */
  const targetRef = React.useRef<T>(initialValue);

  React.useEffect(() => {
    if (!ref) return;

    if (typeof ref === "function") {
      ref(targetRef.current);
    } else if (ref?.current) {
      targetRef.current = ref.current;
    }
  }, [ref]);

  return targetRef;
};

type SwitcherProps = React.ComponentPropsWithoutRef<"input">;

export const Switcher = React.forwardRef<HTMLInputElement, SwitcherProps>((props, _ref) => {
  const ref = useForwardRef<HTMLInputElement>(_ref);

  const switcher = React.useMemo(() => {
    if (!ref || !ref?.current) {
      return null;
    }
    return new SimpleSwitch({ element: ref?.current, material: false });
  }, [ref?.current]);

  React.useEffect(() => {
    console.log({ switcher });

    if (!switcher) {
      return;
    }
    const el = switcher.element;

    const handleCheckboxChange = (e: Event) => {
      console.log(e);
      e.preventDefault();
      const event = new CustomEvent("change.one", {
        detail: { checked: (e.target as HTMLInputElement).checked },
        composed: true,
      });
      e.target?.dispatchEvent(event);
    };

    new Promise((r) => setTimeout(r, 0));
    el.addEventListener("change", handleCheckboxChange);

    return () => {
      el?.removeEventListener?.("change", handleCheckboxChange);
    };
  }, [switcher]);

  return (
    <label {...(switcher ? {} : { style: { display: "none" } })}>
      <input type="checkbox" id="switch" name="switch" ref={ref} /> {props.children}
    </label>
  );
});

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.css" {
  const content: any;
  export default content;
}

declare module "*.scss" {
  const content: any;
  export default content;
}

declare module "*.html" {
  const content: any;
  export default content;
}

declare namespace JSX {
  interface IntrinsicElements {
    "simple-switcher": any;
  }
}

declare module "!!raw-loader!*" {
  const contents: string;
  export = contents;
}

declare module "a-simple-switch" {
  interface Config {
    element?: HTMLElement;
    selector?: string;
    material?: boolean;
    matchSizeToFont?: boolean;
  }
  declare class Switch {
    constructor(config: Config);
    setup(): void;
    updateSize(): void;
    bind(): void;
    checkboxFocused(e: FocusEvent): void;
    checkboxBlurred(e: BlurEvent): void;
    trackClicked(e: ClickEvent): void;
    checkboxToggled(e: ClickEvent): void;
    checkboxDisabled(disabled: boolean): void;
    toggle(): void;
    syncState(): void;
    handleTrackClick(e: ClickEvent): void;
    handleElementFocus(e: FocusEvent): void;
    handleElementBlur(e: BlurEvent): void;
    handleElementClick(e: ClickEvent): void;
    handleMutation(mutations: MutationEvent[]): void;
    static get CHECKED_CLASS_NAME(): "on";
    static get FOCUSED_CLASS_NAME(): "focus";
    static get DISABLED_CLASS_NAME(): "_simple-switch_disabled";
  }

  export { Switch };
}

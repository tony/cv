import { CSSResult, LitElement, TemplateResult, css, html, unsafeCSS } from "lit";
import { customElement, query } from "lit/decorators.js";

//@ts-ignore
import { Switch as SimpleSwitch } from "a-simple-switch";
import style from "!!raw-loader!sass-loader!a-simple-switch/src/sass/SimpleSwitch.scss";

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

// Add custom element to TypeScript's map (defined by @customElement below)
declare global {
  interface HTMLElementTagNameMap {
    "simple-switcher": Switcher;
  }
}

@customElement("simple-switcher")
export class Switcher extends LitElement {
  private dispatch<K extends keyof CustomEventMap>(type: K, detail: UnpackCustomEvent<CustomEventMap[K]>) {
    return this.dispatchEvent(new CustomEvent(type, { detail }));
  }

  static get styles(): CSSResult[] {
    return [
      css`
        ${unsafeCSS(style)}

        ._simple-switch-track {
          margin-right: 0.25rem;
        }

        ._simple-switch-track .handle {
          z-index: 0;
        }

        ::slotted(*) {
          margin-left: 0.25rem;
        }
      `,
    ];
  }

  // @ts-ignore
  @query("input") switch_el: HTMLInputElement;

  private switcher!: SimpleSwitch;

  async firstUpdated(): Promise<void> {
    this.switcher = new SimpleSwitch({ element: this.switch_el, material: false });

    if (this.switch_el) {
      await new Promise((r) => setTimeout(r, 0));
      this.switch_el.addEventListener("change", this.handleCheckboxChange);
    }
  }

  handleCheckboxChange(e: Event): void {
    e.preventDefault();
    const event = new CustomEvent("change.one", {
      detail: { checked: (e.target as HTMLInputElement).checked },
      composed: true,
    });

    this.dispatchEvent(event);
  }

  disconnectedCallback(): void {
    this.switch_el.removeEventListener("change", this.handleCheckboxChange);
    super.disconnectedCallback();
  }

  render(): TemplateResult {
    return html` <label><input type="checkbox" id="switch" name="switch" /><slot></slot></label> `;
  }
}

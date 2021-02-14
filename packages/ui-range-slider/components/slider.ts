import { LitElement, html, customElement, css, query, property, unsafeCSS } from "lit-element";
import type { CSSResult, TemplateResult } from "lit-element";

import noUiSlider from "nouislider";
import style from "!raw-loader!sass-loader!nouislider/distribute/nouislider.css";

import { DEFAULT_FILTERS } from "@tony/cv-lib/search/query";

// const currentYear = new Date().getFullYear();
const minYear = DEFAULT_FILTERS.startYear;
const maxYear = DEFAULT_FILTERS.endYear;
// const range = (start: number, stop: number, step = 1) =>
//   Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
// const years: number[] = range(minYear, maxYear);

type UnpackCustomEvent<T> = T extends CustomEvent<infer U> ? U : never;

// Define custom event types and details here
// Thanks: https://gist.github.com/difosfor/ceeb01d03a8db7dc68d5cd4167d60637
// via https://github.com/Polymer/lit-element/issues/808#issuecomment-566684982
export interface CustomEventMap {
  /**
   * Dispatched when initialized.
   */
  "change.one": CustomEvent<{ values: string[]; handle: number; unencoded: number[] }>;
}

export interface CombinedEventMap extends HTMLElementEventMap, CustomEventMap {}

// Add strict event type support to addEventListener etc.
export interface RangeSlider {
  addEventListener<K extends keyof CombinedEventMap>(
    type: K,
    listener: (this: RangeSlider, ev: CombinedEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof CombinedEventMap>(
    type: K,
    listener: (this: RangeSlider, ev: CombinedEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

// Add custom element to TypeScript's map (defined by @customElement below)
declare global {
  interface HTMLElementTagNameMap {
    "range-slider": RangeSlider;
  }
}

@customElement("range-slider")
export class RangeSlider extends LitElement {
  private dispatch<K extends keyof CustomEventMap>(type: K, detail: UnpackCustomEvent<CustomEventMap[K]>) {
    return this.dispatchEvent(new CustomEvent(type, { detail }));
  }
  static get styles(): CSSResult[] {
    return [
      css`
        ${unsafeCSS(style)}
        .noUi-base .noUi-connects .noUi-connect {
          background-color: var(--line-color, rgb(63, 184, 175));
        }
        .noUi-horizontal {
          z-index: inherit;
        }

        .noUi-horizontal .noUi-tooltip {
          top: 30px;
          border: none;
          background: none;
          font-size: 0.9rem;
        }
      `,
    ];
  }

  @property({ type: "String" })
  get lineColor(): string {
    return this.style.getPropertyValue("--line-color");
  }
  set lineColor(value: string) {
    this.style.setProperty("--line-color", value);
  }

  // @ts-ignore
  @query("div") slider: HTMLDivElement;

  private noUiSlider!: noUiSlider.noUiSlider;

  firstUpdated(): void {
    this.noUiSlider = noUiSlider.create(this.slider, {
      start: [minYear, maxYear],
      connect: true,
      range: {
        min: minYear - 1,
        max: maxYear + 1,
      },
      step: 1,
      animate: true,
      format: {
        from: Number,
        to: (value: string) => value,
      },
      tooltips: [true, true],
    });

    if (this.noUiSlider) {
      this.noUiSlider.on("change.one", (values: string[], handle: number, unencoded: number[]) => {
        const event = new CustomEvent("change.one", { detail: { values, handle, unencoded } });
        this.dispatchEvent(event);
      });
    }
  }

  disconnectedCallback(): void {
    if (this.noUiSlider) {
      this.noUiSlider.off("change.one");
    }
    super.disconnectedCallback();
  }

  render(): TemplateResult {
    return html` <div id="range"></div> `;
  }
}

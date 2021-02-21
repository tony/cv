import { LitElement, customElement, css, query, svg, property, unsafeCSS } from "lit-element";
import type { CSSResult } from "lit-element";
import type { SVGTemplateResult } from "lit-html";
import * as d3 from "d3";

import style from "!raw-loader!sass-loader!./style.scss";

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
export interface Histogram {
  addEventListener<K extends keyof CombinedEventMap>(
    type: K,
    listener: (this: Histogram, ev: CombinedEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof CombinedEventMap>(
    type: K,
    listener: (this: Histogram, ev: CombinedEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

// Add custom element to TypeScript's map (defined by @customElement below)
declare global {
  interface HTMLElementTagNameMap {
    histogram: Histogram;
  }
}

const margin = { top: 20, right: 0, bottom: 30, left: 40 };

@customElement("cv-histogram")
export class Histogram extends LitElement {
  private dispatch<K extends keyof CustomEventMap>(type: K, detail: UnpackCustomEvent<CustomEventMap[K]>) {
    return this.dispatchEvent(new CustomEvent(type, { detail }));
  }

  static get styles(): CSSResult[] {
    return [
      css`
        ${unsafeCSS(style)}

        :host {
          display: block;
          padding: 16px;
        }

        g text {
          fill: #666;
        }
        rect {
          fill: var(--line-color, #399);
        }
      `,
    ];
  }

  // @ts-ignore
  @query(".chart") histogram_el: HTMLDivElement;

  private histogram!: unknown;

  @property({ type: Number }) width = 300;
  @property({ type: Number }) height = 150;
  @property({ type: "String" })
  get lineColor(): string {
    return this.style.getPropertyValue("--line-color");
  }
  set lineColor(value: string) {
    this.style.setProperty("--line-color", value);
  }
  @property({ type: Object }) info!: { x: string; y: number }[];

  render(): SVGTemplateResult {
    console.log("inside render", this.getAttribute("info"), this.info);
    const svgChart = d3
      .create("svg")
      .attr("viewBox", "0 0 100% 100%")
      .attr("width", this.width)
      .attr("height", this.height);

    const plotX = d3
      .scaleBand()
      .domain(Object.keys(this.info))
      .range([margin.left, this.width - margin.right])
      .padding(0.1);

    const plotY = d3
      .scaleLinear()
      // @ts-ignore
      .domain([0, d3.max(Object.values(this.info))])
      .nice()
      .range([this.height - margin.bottom, margin.top]);

    // @ts-ignore
    svgChart
      .append("g")
      .attr("fill", this.lineColor)
      .selectAll("rect")
      .data(Object.entries(this.info).map(([year, count]) => ({ x: year, y: count })))
      .join("rect")
      .style("mix-blend-mode", "multiply")
      .attr("x", (d) => plotX(d.x))
      // @ts-ignore
      .attr("y", (d) => plotY(d.y))
      // @ts-ignore
      .attr("height", (d) => plotY(0) - plotY(d.y))
      .attr("width", plotX.bandwidth());

    // @ts-ignore
    const xAxis = (g) =>
      g.attr("transform", `translate(0,${this.height - margin.bottom})`).call(
        d3
          .axisBottom(plotX)
          .tickSizeOuter(0)
          // @ts-ignore
          .tickFormat((d: string, i: number, items: any[]) => {
            const length = items.length;
            if (i == 0 || i + 1 == length) return d ?? "";
            return "";
          })
      );

    const yTicks = plotY.ticks().filter((tick) => Number.isInteger(tick));
    console.log({ yTicks });
    // @ts-ignore
    const yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(plotY).tickValues(yTicks).tickSizeOuter(1).tickFormat(d3.format("d")))
        // @ts-ignore
        .call((g) => g.select(".domain").remove());

    svgChart.append("g").call(xAxis);
    svgChart.append("g").call(yAxis);

    return svg`${svgChart.node()}`;
  }
}

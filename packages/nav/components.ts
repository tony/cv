import "@webcomponents/webcomponentsjs/custom-elements-es5-adapter";
import reactSvg from "@tony/cv-data/img/icons/react.svg";
import angularSvg from "@tony/cv-data/img/icons/angular.svg";
import vueSvg from "@tony/cv-data/img/icons/vue.svg";

import { CustomElement, Prop } from "custom-elements-ts";

import template from "./nav.html";
import style from "!raw-loader!sass-loader!./nav.scss";

@CustomElement({
  tag: "cv-nav",
  template: template
    .replace("${reactSvg}", reactSvg)
    .replace("${angularSvg}", angularSvg)
    .replace("${vueSvg}", vueSvg),
  style,
})
export class MyNav extends HTMLElement {
  @Prop() message = "test";
  @Prop() reactSvg: string = reactSvg;

  constructor() {
    // Always call super first in constructor
    super();

    this.message = "test";
  }

  connectedCallback(): void {
    const div = this.shadowRoot?.querySelector("#our-nav");
    console.log(div);
    if (div) {
      // div.innerHTML = "trying this out";
    }
  }
}

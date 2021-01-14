import "@webcomponents/webcomponentsjs/custom-elements-es5-adapter";
// import "@webcomponents/webcomponentsjs/webcomponents-bundle.js";
// import "@webcomponents/webcomponentsjs/webcomponents-loader.js";
//
// import "@webreflection/custom-elements";
// import cePolyfill from "@webreflection/custom-elements";
// const customElements = cePolyfill(self || window || global);
// const { define, get, whenDefined } = customElements;
//
import { CustomElement, Prop, Listen } from "custom-elements-ts";

let template = `
    <div id="our-nav">
        <date-time theme="red"></date-time>
    </div>
`;

@CustomElement({
  tag: "cv-nav",
  template,
  styleUrl: "",
})
export class MyNav extends HTMLElement {
  @Prop() message: string = "test";

  // constructor() {
  //   // Always call super first in constructor
  //   super();
  //
  //   this.message = "test";
  // }

  connectedCallback() {
    const div = this.shadowRoot?.querySelector("#our-nav");
    console.log(div);
    if (div) {
      div.innerHTML = template;
    }
  }
}

// window.document.registerElement("cv-nav", MyNav);
// define("cv-nav", MyNav);

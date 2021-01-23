import { LitElement, html, customElement, css, unsafeCSS } from "lit-element";
import type { CSSResult, TemplateResult } from "lit-element";

import style from "!raw-loader!sass-loader!./nav.scss";

import reactSvg from "@tony/cv-data/img/icons/react.svg";
import angularSvg from "@tony/cv-data/img/icons/angular.svg";
import vueSvg from "@tony/cv-data/img/icons/vue.svg";

@customElement("cv-nav")
export class CVNav extends LitElement {
  static get styles(): CSSResult[] {
    return [
      css`
        ${unsafeCSS(style)}
      `,
    ];
  }

  render(): TemplateResult {
    return html`
      <nav id="our-nav">
        <div class="logo">
          <b>
            Tony<span class="header--lastname"> Narlock</span>'s CV
            <span class="header--version">v2</span>
            <span class="header--super">alpha</span>
          </b>
        </div>
        <ul>
          <li>
            <a href="https://cv-react-v2.git-pull.com/"><img src="${reactSvg}" width="18" /> React</a>
            <ul class="submenu">
              <li class="section-title">
                <strong>Versions</strong>
              </li>
              <li>
                <a href="https://cv-react-v1.git-pull.com/">v1 (2018)</a>
              </li>
              <li class="active">
                <a href="https://cv-react-v2.git-pull.com/">v2 (2021) -&nbsp;<strong>You are here</strong></a>
              </li>
            </ul>
          </li>
          <li>
            <a href="https://cv-angular-v2.git-pull.com/"> <img src="${angularSvg}" width="18" /> Angular </a>
          </li>
          <li>
            <a href="https://cv-vue-v2.git-pull.com/"><img src="${vueSvg}" width="18" /> Vue</a>
          </li>
        </ul>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "cv-nav": CVNav;
  }
}

import { CSSResult, LitElement, html, css, TemplateResult, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

// import style from "!!raw-loader!sass-loader!./nav.scss";

import reactSvg from "@tony/cv-data/img/icons/react.svg";
import vueSvg from "@tony/cv-data/img/icons/vue.svg";

enum Framework {
  React = "React",
  Vue = "Vue",
}

enum CVVersion {
  V1 = "V1",
  V2 = "V2",
}

const getActiveFramework = (): Framework | null => {
  const url = window.location.toString();
  switch (url) {
    case url.match(/react|:3099/)?.input: {
      return Framework.React;
    }
    case url.match(/vue|:3093/)?.input: {
      return Framework.Vue;
    }
    default:
      return null;
  }
};
// @ts-ignore
window.getActiveFramework = getActiveFramework;

const getCVVersion = (): CVVersion | null => {
  const url = window.location.toString();
  switch (url) {
    case url.match(/v2/)?.input: {
      return CVVersion.V2;
    }
    default:
      return CVVersion.V2;
  }
};

@customElement("cv-nav")
export class CVNav extends LitElement {
  @property() cv_version = getCVVersion();
  @property() framework = getActiveFramework();

  static get styles(): CSSResult[] {
    const styleModule = require("./nav.scss");
    const styleOther = require("!!raw-loader!sass-loader!./nav.scss").default;
    const style = styleOther ?? styleModule ?? "";

    return [
      css`
        ${unsafeCSS(style)}
        nav {
          background-color: red;
        }
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
          <li class="${this.framework == Framework.React ? "active" : ""} framework react">
            <a href="https://cv-react-v2.git-pull.com/"> <img src="${reactSvg}" width="18" />
              <span class="label">React
            </a>
            <ul class="submenu">
              <li class="section-title">
                <strong>Versions</strong>
              </li>
              <li>
                <a href="https://cv-react-v1.git-pull.com/">v1 (2018)</a>
              </li>
              <li class="${this.framework == Framework.React ? "active" : ""}">
                <a href="https://cv-react-v2.git-pull.com/"
                  >v2
                  (2021)${
                    this.framework == Framework.React ? html` -&nbsp;<strong>You are here</strong> ` : ""
                  }
                </a>
              </li>
            </ul>
          </li>
          <li class="${this.framework == Framework.Vue ? "active" : ""} framework vue">
            <a href="https://cv-vue-v2.git-pull.com/">
              <img src="${vueSvg}" width="18" /> <span class="label"> Vue</span>
            </a>
            <ul class="submenu">
              <li class="section-title">
                <strong>Versions</strong>
              </li>
              <li>
                <a href="https://cv-vue-v1.git-pull.com/">v1 (2018)</a>
              </li>
            </ul>
          </li>
          <li class="view-source">
            <a href="https://github.com/tony/cv" rel="noopener noreferrer" target="blank">
              View Source
            </a>
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

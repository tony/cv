import React from "react";

import reactSvg from "@tony/cv-data/img/icons/react.svg";
import vueSvg from "@tony/cv-data/img/icons/vue.svg";

import "./nav.css";

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

export const getCVVersion = (): CVVersion | null => {
  const url = window.location.toString();
  switch (url) {
    case url.match(/v2/)?.input: {
      return CVVersion.V2;
    }
    default:
      return CVVersion.V2;
  }
};

export const CVNav: React.FC = () => {
  const framework = getActiveFramework();

  return (
    <nav id="our-nav">
      <div className="logo">
        <b>
          Tony<span className="header--lastname"> Narlock</span>'s CV
          <span className="header--version">v2</span>
        </b>
      </div>
      <ul>
        <li
          className={`${
            framework == Framework.React ? "active" : ""
          } framework react`}
        >
          <a href="https://cv-react-v2.git-pull.com/">
            {" "}
            <img src={reactSvg} width="18" />
            <span className="label">React</span>
          </a>
          <ul className="submenu">
            <li className="section-title">
              <strong>Versions</strong>
            </li>
            <li>
              <a href="https://cv-react-v1.git-pull.com/">v1 (2018)</a>
            </li>
            <li className={framework == Framework.React ? "active" : ""}>
              <a href="https://cv-react-v2.git-pull.com/">
                v2 (2021)
                {framework == Framework.React ? (
                  <>
                    &nbsp;-&nbsp;<strong>You are here</strong>{" "}
                  </>
                ) : undefined}
              </a>
            </li>
          </ul>
        </li>
        <li
          className={`${
            framework == Framework.Vue ? "active" : ""
          } framework vue`}
        >
          <a href="https://cv-vue-v2.git-pull.com/">
            <img src={vueSvg} width="18" /> <span className="label"> Vue</span>
          </a>
          <ul className="submenu">
            <li className="section-title">
              <strong>Versions</strong>
            </li>
            <li>
              <a href="https://cv-vue-v1.git-pull.com/">v1 (2018)</a>
            </li>
          </ul>
        </li>
        <li className="view-source">
          <a
            href="https://github.com/tony/cv"
            rel="noopener noreferrer"
            target="blank"
          >
            View Source
          </a>
        </li>
      </ul>
    </nav>
  );
};

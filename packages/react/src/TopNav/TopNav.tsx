import React from "react";

import "./TopNav.css";

import { ColorSchemeToggle } from "./ColorScheme";

export const TopNav: React.FC = () => (
  <nav id="top-nav">
    <div className="top-nav--container">
      <div className="site-info" title="Tony Narlock's CV">
        <div className="site-info--logo">
          <a href="https://www.git-pull.com" className="site-info--logo--img">
            &nbsp;
          </a>
        </div>
        <div className="site-info--site-name">Tony Narlock&apos;s CV</div>
        <div className="site-info--filler">&nbsp;</div>
        <div className="site-info--color-scheme-toggle--container">
          <ColorSchemeToggle />
        </div>
      </div>
    </div>
  </nav>
);

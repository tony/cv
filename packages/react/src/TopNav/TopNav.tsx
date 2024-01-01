import React from "react";

import "./TopNav.css";

import { ColorSchemeToggle } from "./ColorScheme";

export const TopNav: React.FC = () => (
  <nav
    id="top-nav"
    className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-blue-800/90 text-white supports-backdrop-blur:bg-white/60 dark:bg-transparent"
  >
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

import type React from "react";

import "./TopNav.css";

import { ColorSchemeToggle } from "./ColorScheme";

export const TopNav: React.FC = () => (
  <nav
    id="top-nav"
    className="sticky top-0 z-40 w-full h-12 backdrop-blur flex lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-blue-900/85 text-white supports-backdrop-blur:bg-white/60 dark:bg-black-pearl-700/20 place-items-center text-sm"
  >
    <div className="top-nav--container mx-auto w-[900px]">
      <div className="site-info flex w-full" title="Tony Narlock's CV">
        <div className="site-info--logo h-12">
          <a
            href="https://www.git-pull.com"
            className="site-info--logo--img h-12 w-12 block bg-logo dark:bg-logo-dark"
          >
            &nbsp;
          </a>
        </div>
        <div className="site-info--site-name flex place-items-center text-base leading-5 padding pl-2 [text-shadow:_1px_1px_0px_#ffffff40]">
          Tony Narlock&apos;s CV
        </div>
        <div className="site-info--filler grow">&nbsp;</div>
        <div className="site-info--color-scheme-toggle--container flex place-items-center mr-2 lg:mr-0">
          <ColorSchemeToggle />
        </div>
      </div>
    </div>
  </nav>
);

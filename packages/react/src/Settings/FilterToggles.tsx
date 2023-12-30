import React from "react";

import Toggle from "@atlaskit/toggle";

import "./FilterToggles.css";

import { useMst } from "../mobx";

export const FilterToggles: React.FC = () => {
  const cvState = useMst();
  const onShowReleaseContributionsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = e?.target?.checked;
    if (checked !== null) {
      cvState.setSearchOptions({
        showReleases: checked,
      });
    }
  };
  const onShowSpellingContributionsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = e?.target?.checked;
    if (checked !== null) {
      cvState.setSearchOptions({
        showTypos: checked,
      });
    }
  };
  const onShowDocumentationContributionsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = e?.target?.checked;
    if (checked !== null) {
      cvState.setSearchOptions({
        showDocImprovements: checked,
      });
    }
  };
  const onShowCodeStyleContributionsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = e?.target?.checked;
    if (checked !== null) {
      cvState.setSearchOptions({
        showCodeStyleTweaks: checked,
      });
    }
  };
  const onShowUnmergedContributionsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = e?.target?.checked;
    if (checked !== null) {
      cvState.setSearchOptions({
        showUnmerged: checked,
      });
    }
  };

  return (
    <div className="toggles">
      <div id="show-documentation-group" className="toggle">
        <Toggle
          id="show-documentation"
          onChange={onShowDocumentationContributionsChange}
        />
        <label htmlFor="show-documentation">Docs</label>
      </div>

      <div id="show-release-group" className="toggle">
        <Toggle id="show-release" onChange={onShowReleaseContributionsChange} />
        <label
          htmlFor="show-release"
          title="Continuous integration, build and releases"
        >
          Build / Release / CI
        </label>
      </div>

      <div id="show-code-style-group" className="toggle">
        <Toggle
          id="show-code-style"
          onChange={onShowCodeStyleContributionsChange}
        />
        <label htmlFor="show-code-style">Code Style</label>
      </div>

      <div id="show-spelling-group" className="toggle">
        <Toggle
          id="show-spelling"
          onChange={onShowSpellingContributionsChange}
        />
        <label htmlFor="show-spelling">Typos</label>
      </div>

      <div id="show-unmerged-group" className="toggle">
        <Toggle
          id="show-unmerged"
          onChange={onShowUnmergedContributionsChange}
        />
        <label htmlFor="show-unmerged">Unmerged</label>
      </div>
    </div>
  );
};

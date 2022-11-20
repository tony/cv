import React from "react";

import { cvService } from "@tony/cv-lib/hub";

import Toggle from "@atlaskit/toggle";

import "./FilterToggles.css";

export const FilterToggles: React.FC = () => {
  const onShowReleaseContributionsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e?.target?.checked;
    if (checked !== null) {
      cvService.setActivityFilters({
        showReleases: checked,
      });
    }
  };
  const onShowSpellingContributionsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e?.target?.checked;
    if (checked !== null) {
      cvService.setActivityFilters({
        showTypos: checked,
      });
    }
  };
  const onShowDocumentationContributionsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e?.target?.checked;
    if (checked !== null) {
      cvService.setActivityFilters({
        showDocImprovements: checked,
      });
    }
  };
  const onShowCodeStyleContributionsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e?.target?.checked;
    if (checked !== null) {
      cvService.setActivityFilters({
        showCodeStyleTweaks: checked,
      });
    }
  };
  const onShowUnmergedContributionsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e?.target?.checked;
    if (checked !== null) {
      cvService.setActivityFilters({
        showUnmerged: checked,
      });
    }
  };

  return (
    <div className="toggles">
      <Toggle
        id="show-documentation"
        onChange={onShowDocumentationContributionsChange}
      />
      <label htmlFor="show-documentation">Docs</label>

      <Toggle id="show-release" onChange={onShowReleaseContributionsChange} />
      <label
        htmlFor="show-release"
        title="Continuous integration, build and releases"
      >
        Build / Release /CI
      </label>

      <Toggle
        id="show-code-style"
        onChange={onShowCodeStyleContributionsChange}
      />
      <label htmlFor="show-code-style">Code Style</label>

      <Toggle id="show-spelling" onChange={onShowSpellingContributionsChange} />
      <label htmlFor="show-spelling">Typos</label>

      <Toggle id="show-unmerged" onChange={onShowUnmergedContributionsChange} />
      <label htmlFor="show-unmerged">Unmerged</label>
    </div>
  );
};

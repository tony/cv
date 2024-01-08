import React from "react";

import Toggle from "@atlaskit/toggle";

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
    <div className="toggles flex items-center justify-center max-w-3/4 py-2 mx-auto flex-wrap lg:flex-nowrap">
      <div id="show-documentation-group" className="toggle flex items-center">
        <Toggle
          id="show-documentation"
          onChange={onShowDocumentationContributionsChange}
        />
        <label
          htmlFor="show-documentation"
          className="text-sm font-semibold inline-block text-gray-600 dark:text-gray-300"
        >
          Docs
        </label>
      </div>

      <div id="show-release-group" className="toggle flex items-center">
        <Toggle id="show-release" onChange={onShowReleaseContributionsChange} />
        <label
          htmlFor="show-release"
          title="Continuous integration, build and releases"
          className="text-sm font-semibold inline-block text-gray-600 dark:text-gray-300"
        >
          Build / Release / CI
        </label>
      </div>

      <div id="show-code-style-group" className="toggle flex items-center">
        <Toggle
          id="show-code-style"
          onChange={onShowCodeStyleContributionsChange}
        />
        <label
          htmlFor="show-code-style"
          className="text-sm font-semibold inline-block text-gray-600 dark:text-gray-300"
        >
          Code Style
        </label>
      </div>

      <div id="show-spelling-group" className="toggle flex items-center">
        <Toggle
          id="show-spelling"
          onChange={onShowSpellingContributionsChange}
        />
        <label
          htmlFor="show-spelling"
          className="text-sm font-semibold inline-block text-gray-600 dark:text-gray-300"
        >
          Typos
        </label>
      </div>

      <div id="show-unmerged-group" className="toggle flex items-center">
        <Toggle
          id="show-unmerged"
          onChange={onShowUnmergedContributionsChange}
        />
        <label
          htmlFor="show-unmerged"
          className="text-sm font-semibold inline-block text-gray-600 dark:text-gray-300"
        >
          Unmerged
        </label>
      </div>
    </div>
  );
};

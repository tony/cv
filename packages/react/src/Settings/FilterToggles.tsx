import React from "react";

import { cvService } from "@tony/cv-lib/hub";

import { Switcher } from "@tony/cv-ui-switch";
import type { CustomEventMap as SwitcherEvents } from "@tony/cv-ui-switch";

export const FilterToggles: React.FC = () => {
  const onShowSpellingContributionsRef = React.useRef<Switcher>(null);
  const onShowReleaseContributionsRef = React.useRef<Switcher>(null);
  const onShowDocumentationContributionsRef = React.useRef<Switcher>(null);
  const onShowCodeStyleContributionsRef = React.useRef<Switcher>(null);
  const onShowUnmergedContributionsRef = React.useRef<Switcher>(null);

  const onShowReleaseContributionsChange = (
    e: SwitcherEvents["change.one"]
  ) => {
    const checked = e?.detail?.checked;
    if (checked !== null) {
      cvService.setActivityFilters({
        showReleases: checked,
      });
    }
  };
  const onShowSpellingContributionsChange = (
    e: SwitcherEvents["change.one"]
  ) => {
    const checked = e?.detail?.checked;
    if (checked !== null) {
      cvService.setActivityFilters({
        showTypos: checked,
      });
    }
  };
  const onShowDocumentationContributionsChange = (
    e: SwitcherEvents["change.one"]
  ) => {
    const checked = e?.detail?.checked;
    if (checked !== null) {
      cvService.setActivityFilters({
        showDocImprovements: checked,
      });
    }
  };
  const onShowCodeStyleContributionsChange = (
    e: SwitcherEvents["change.one"]
  ) => {
    const checked = e?.detail?.checked;
    if (checked !== null) {
      cvService.setActivityFilters({
        showCodeStyleTweaks: checked,
      });
    }
  };
  const onShowUnmergedContributionsChange = (
    e: SwitcherEvents["change.one"]
  ) => {
    const checked = e?.detail?.checked;
    if (checked !== null) {
      cvService.setActivityFilters({
        showUnmerged: checked,
      });
    }
  };

  React.useLayoutEffect(() => {
    const releaseSwitcher = onShowReleaseContributionsRef?.current;
    const spellingSwitcher = onShowSpellingContributionsRef?.current;
    const documentationSwitcher = onShowDocumentationContributionsRef?.current;
    const codeStyleSwitcher = onShowCodeStyleContributionsRef?.current;
    const unmergedSwitcher = onShowUnmergedContributionsRef?.current;
    if (
      !releaseSwitcher ||
      !spellingSwitcher ||
      !documentationSwitcher ||
      !codeStyleSwitcher ||
      !unmergedSwitcher
    ) {
      return;
    }

    if (spellingSwitcher.addEventListener) {
      releaseSwitcher.addEventListener(
        "change.one",
        onShowReleaseContributionsChange
      );
      spellingSwitcher.addEventListener(
        "change.one",
        onShowSpellingContributionsChange
      );
      documentationSwitcher.addEventListener(
        "change.one",
        onShowDocumentationContributionsChange
      );
      codeStyleSwitcher.addEventListener(
        "change.one",
        onShowCodeStyleContributionsChange
      );
      unmergedSwitcher.addEventListener(
        "change.one",
        onShowUnmergedContributionsChange
      );
    }
    return () => {
      releaseSwitcher.removeEventListener(
        "change.one",
        onShowReleaseContributionsChange
      );
      spellingSwitcher.removeEventListener(
        "change.one",
        onShowSpellingContributionsChange
      );
      documentationSwitcher.removeEventListener(
        "change.one",
        onShowDocumentationContributionsChange
      );
      codeStyleSwitcher.removeEventListener(
        "change.one",
        onShowCodeStyleContributionsChange
      );
      unmergedSwitcher.removeEventListener(
        "change.one",
        onShowUnmergedContributionsChange
      );
    };
  });

  return (
    <div className="toggles">
      <Switcher
        id="show-documentation"
        ref={onShowDocumentationContributionsRef}
      >
        Docs
      </Switcher>
      <Switcher id="show-release" ref={onShowReleaseContributionsRef}>
        <span title="Continuous integration, build and releases">
          Build / Release / CI
        </span>
      </Switcher>
      <Switcher id="show-code-style" ref={onShowCodeStyleContributionsRef}>
        Code Style
      </Switcher>
      <Switcher id="show-spelling" ref={onShowSpellingContributionsRef}>
        Typos
      </Switcher>
      <Switcher id="show-unmerged" ref={onShowUnmergedContributionsRef}>
        Unmerged
      </Switcher>
    </div>
  );
};

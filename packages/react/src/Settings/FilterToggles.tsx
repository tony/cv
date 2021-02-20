import React from "react";

import { cvService } from "@tony/cv-lib/hub";

import "@tony/cv-ui-switch";
import type {
  Switcher,
  CustomEventMap as SwitcherEvents,
} from "@tony/cv-ui-switch";

export const FilterToggles: React.FC = () => {
  const onShowSpellingContributionsRef = React.useRef<Switcher>(null);
  const onShowDocumentationContributionsRef = React.useRef<Switcher>(null);
  const onShowCodeStyleContributionsRef = React.useRef<Switcher>(null);
  const onShowUnmergedContributionsRef = React.useRef<Switcher>(null);

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
    const spellingSwitcher = onShowSpellingContributionsRef?.current;
    const documentationSwitcher = onShowDocumentationContributionsRef?.current;
    const codeStyleSwitcher = onShowCodeStyleContributionsRef?.current;
    const unmergedSwitcher = onShowUnmergedContributionsRef?.current;
    if (
      !spellingSwitcher ||
      !documentationSwitcher ||
      !codeStyleSwitcher ||
      !unmergedSwitcher
    ) {
      return;
    }

    if (spellingSwitcher.addEventListener) {
      console.log("add listener");
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
      <simple-switcher id="show-spelling" ref={onShowSpellingContributionsRef}>
        Spelling Contributions
      </simple-switcher>
      <simple-switcher
        id="show-documentation"
        ref={onShowDocumentationContributionsRef}
      >
        Documentation Tweaks
      </simple-switcher>
      <simple-switcher
        id="show-code-style"
        ref={onShowCodeStyleContributionsRef}
      >
        Code Style / Bikeshedding
      </simple-switcher>
      <simple-switcher id="show-unmerged" ref={onShowUnmergedContributionsRef}>
        Unmerged
      </simple-switcher>
    </div>
  );
};

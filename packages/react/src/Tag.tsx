import React from "react";

import { observer } from "mobx-react-lite";
import { type Instance } from "mobx-state-tree";

import {
  CategoryEmojiMap,
  CategoryVerbMap,
  CategoryVerbPresentTenseMap,
} from "@tony/cv-data/constants";
import type {
  CategoryName,
  LanguageName,
  OrgTypeName,
} from "@tony/cv-data/types";
import { Activity } from "@tony/cv-lib/search/mobx";

import { useMst } from "./mobx";

export const LanguageTag: React.FC<
  { languageName: LanguageName } & React.HTMLProps<HTMLDivElement>
> = ({ languageName, children, className = "", style = {}, ...props }) => {
  if (!languageName) {
    return null;
  }
  const cvState = useMst();
  const language = cvState.languages.find(({ id }) => id === languageName);
  if (!language || !language.ui) {
    console.groupCollapsed(`missing language for ${languageName}`);
    console.table(language);
    console.groupEnd();
  }

  return (
    <div
      className={`tag` + (className ? ` ${className}` : "")}
      style={{ ...language?.ui, ...style }}
      {...props}
    >
      {children || languageName}
    </div>
  );
};

export const CategoryTag: React.FC<
  { categoryName: CategoryName } & React.HTMLProps<HTMLDivElement>
> = observer(
  ({ categoryName, children, className = "", style = {}, ...props }) => {
    if (!categoryName) {
      return null;
    }
    const cvState = useMst();
    const category = cvState.categories.find(({ id }) => id === categoryName);
    if (!category || !category.ui) {
      console.groupCollapsed(
        `${category?.name} missing activity type for ${categoryName}`,
      );
      console.table(category);
      console.groupEnd();
    }

    return (
      <div
        className={`tag` + (className ? ` ${className}` : "")}
        style={{ ...category?.ui, ...style }}
        {...props}
      >
        {category?.id && CategoryEmojiMap[category.id]}
        {children || category?.name || categoryName}
      </div>
    );
  },
);

export const CategoryText: React.FC<
  { categoryName: CategoryName } & Pick<
    Instance<typeof Activity>,
    "createdAt" | "acceptedAt" | "startedAt" | "endedAt"
  > &
    React.HTMLProps<HTMLDivElement>
> = ({
  categoryName,
  acceptedAt,
  endedAt,
  startedAt: _startedAt,
  createdAt: _createdAt,
  ...props
}) => {
  if (!categoryName) {
    return null;
  }
  const cvState = useMst();
  const category = cvState.categories.find(({ id }) => id === categoryName);
  if (!category || !category.ui) {
    console.groupCollapsed(
      `${category?.name} missing activity type for ${categoryName}`,
    );
    console.table(category);
    console.groupEnd();
  }

  const VerbMap =
    !endedAt && !acceptedAt ? CategoryVerbPresentTenseMap : CategoryVerbMap;

  return (
    <span {...props}>
      {category?.id && (
        <>
          {CategoryEmojiMap[category.id]} {VerbMap[category.id]}
        </>
      )}
    </span>
  );
};

export const OrgTypeTag: React.FC<
  { orgTypeName: OrgTypeName } & React.HTMLProps<HTMLDivElement>
> = ({ orgTypeName, children, className = "", ...props }) => {
  if (!orgTypeName) {
    return null;
  }
  const cvState = useMst();
  const orgType = cvState.orgTypes.find(({ id }) => id === orgTypeName);
  if (!orgType || !orgType.ui) {
    console.groupCollapsed(
      `${orgType?.name} missing org type for ${orgTypeName}`,
    );
    console.table(orgType);
    console.groupEnd();
  }

  return (
    <div className={`tag` + (className ? ` ${className}` : "")} {...props}>
      {children || orgTypeName}
    </div>
  );
};

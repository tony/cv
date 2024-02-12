import React from "react";

import { observer } from "mobx-react-lite";
import { type Instance } from "mobx-state-tree";

import {
  CategoryEmojiMap,
  CategoryVerbMap,
  CategoryVerbPresentTenseMap,
} from "@tony/cv-data/constants";
import { CategoryName, LanguageName, OrgTypeName } from "@tony/cv-data/types";
import { Activity, ActivityOpenSource } from "@tony/cv-lib/search/mobx";

import {
  GitMergeIcon,
  GitMergeQueueIcon,
  GitPullRequestClosedIcon,
} from "./Icons";
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
      className={`tag language-tag ${className ? ` ${className}` : ""}`}
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
        className={`tag${className ? ` ${className}` : ""}`}
        style={{ ...category?.ui, ...style }}
        {...props}
      >
        {category?.id && CategoryEmojiMap[category.id]}
        {children || category?.name || categoryName}
      </div>
    );
  },
);

export const ActivityOpenSourceEmoji: React.FC<{
  activity: Instance<typeof ActivityOpenSource>;
}> = ({ activity }) => {
  const wrapperClassName = "inline-flex w-5 h-5";
  const svgClassName = "w-3 h-3";

  const isStale =
    (new Date().valueOf() - new Date(activity.createdAt).valueOf()) /
      (1000 * 60 * 60 * 24 * 365) >
    1;

  return activity?.acceptedAt ? (
    <GitMergeIcon
      wrapperClassName={wrapperClassName}
      svgClassName={svgClassName}
    />
  ) : activity?.closedAt ? (
    <GitPullRequestClosedIcon
      wrapperClassName={wrapperClassName}
      svgClassName={svgClassName}
    />
  ) : isStale ? (
    <GitMergeQueueIcon
      wrapperClassName={`bg-gray-200 dark:bg-gray-600 ${wrapperClassName}`}
      svgClassName={`text-gray-800 dark:text-gray-300 ${svgClassName}`}
    />
  ) : (
    <GitMergeQueueIcon
      wrapperClassName={wrapperClassName}
      svgClassName={svgClassName}
    />
  );
};

export const ActivityActionText: React.FC<{
  activity: Instance<typeof Activity>;
}> = ({ activity }) => {
  const {
    category: categoryName,
    acceptedAt,
    endedAt,
    startedAt: _startedAt,
    endedAt: _createdAt,
  } = activity;
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
    <span>
      {category?.id && (
        <>
          {activity?.category === CategoryName.Patch ? (
            <ActivityOpenSourceEmoji activity={activity} />
          ) : (
            CategoryEmojiMap[category.id]
          )}{" "}
          {VerbMap[category.id]}
        </>
      )}
    </span>
  );
};

export const OrganizationTypeTag: React.FC<
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
    <div className={`tag${className ? ` ${className}` : ""}`} {...props}>
      {children || orgTypeName}
    </div>
  );
};

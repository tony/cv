import React from "react";

import { observer } from "mobx-react-lite";

import {
  ActivityTypeEmojiMap,
  ActivityTypeVerbMap,
  ActivityTypeVerbPresentTenseMap,
} from "@tony/cv-data/constants";
import type {
  ActivityTypeName,
  IActivity,
  LanguageName,
  OrgTypeName,
} from "@tony/cv-data/types";

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
      style={{ ...(language?.ui ?? {}), ...style }}
      {...props}
    >
      {children || languageName}
    </div>
  );
};

export const ActivityTypeTag: React.FC<
  { activityTypeName: ActivityTypeName } & React.HTMLProps<HTMLDivElement>
> = observer(
  ({ activityTypeName, children, className = "", style = {}, ...props }) => {
    if (!activityTypeName) {
      return null;
    }
    const cvState = useMst();
    const activityType = cvState.activityTypes.find(
      ({ id }) => id === activityTypeName
    );
    if (!activityType || !activityType.ui) {
      console.groupCollapsed(
        `${activityType?.name} missing activity type for ${activityTypeName}`
      );
      console.table(activityType);
      console.groupEnd();
    }

    return (
      <div
        className={`tag` + (className ? ` ${className}` : "")}
        style={{ ...(activityType?.ui ?? {}), ...style }}
        {...props}
      >
        {activityType?.id && <>{ActivityTypeEmojiMap[activityType.id]}</>}
        {children || activityType?.name || activityTypeName}
      </div>
    );
  }
);

export const ActivityTypeText: React.FC<
  { activityTypeName: ActivityTypeName } & Pick<
    IActivity,
    "createdAt" | "acceptedAt" | "startedAt" | "endedAt"
  > &
    React.HTMLProps<HTMLDivElement>
> = ({
  activityTypeName,
  acceptedAt,
  endedAt,
  startedAt: _startedAt,
  createdAt: _createdAt,
  ...props
}) => {
  if (!activityTypeName) {
    return null;
  }
  const cvState = useMst();
  const activityType = cvState.activityTypes.find(
    ({ id }) => id === activityTypeName
  );
  if (!activityType || !activityType.ui) {
    console.groupCollapsed(
      `${activityType?.name} missing activity type for ${activityTypeName}`
    );
    console.table(activityType);
    console.groupEnd();
  }

  const VerbMap =
    !endedAt && !acceptedAt
      ? ActivityTypeVerbPresentTenseMap
      : ActivityTypeVerbMap;

  return (
    <span {...props}>
      {activityType?.id && (
        <>
          {ActivityTypeEmojiMap[activityType.id]} {VerbMap[activityType.id]}
        </>
      )}
    </span>
  );
};

export const OrgTypeTag: React.FC<
  { orgTypeName: OrgTypeName } & React.HTMLProps<HTMLDivElement>
> = ({ orgTypeName, children, className = "", style = {}, ...props }) => {
  if (!orgTypeName) {
    return null;
  }
  const cvState = useMst();
  const orgType = cvState.orgTypes.find(({ id }) => id === orgTypeName);
  if (!orgType || !orgType.ui) {
    console.groupCollapsed(
      `${orgType?.name} missing org type for ${orgTypeName}`
    );
    console.table(orgType);
    console.groupEnd();
  }

  return (
    <div
      className={`tag` + (className ? ` ${className}` : "")}
      style={{ ...(orgType?.ui ?? {}), ...style }}
      {...props}
    >
      {children || orgTypeName}
    </div>
  );
};

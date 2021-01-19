import React from "react";

import {
  activityTypesQuery,
  languagesQuery,
  orgTypesQuery,
} from "@tony/cv-lib/hub";
import type {
  ActivityTypeName,
  LanguageName,
  OrgTypeName,
} from "@tony/cv-data/types";

export const LanguageTag: React.FC<
  { languageName: LanguageName } & React.HTMLProps<HTMLDivElement>
> = ({ languageName, children, className = "", style = {}, ...props }) => {
  if (!languageName) {
    return null;
  }
  const language = languagesQuery.getEntity(languageName);
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
> = ({ activityTypeName, children, className = "", style = {}, ...props }) => {
  if (!activityTypeName) {
    return null;
  }
  const activityType = activityTypesQuery.getEntity(activityTypeName);
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
      {children || activityType?.name || activityTypeName}
    </div>
  );
};

export const OrgTypeTag: React.FC<
  { orgTypeName: OrgTypeName } & React.HTMLProps<HTMLDivElement>
> = ({ orgTypeName, children, className = "", style = {}, ...props }) => {
  if (!orgTypeName) {
    return null;
  }
  const orgType = orgTypesQuery.getEntity(orgTypeName);
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

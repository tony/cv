import React from "react";

import {
  activityTypesQuery,
  languagesQuery,
  orgTypesQuery,
} from "../../lib/hub";
export const LanguageTag: React.FC<
  { languageName: LanguageName } & React.HTMLProps<HTMLDivElement>
> = ({ languageName, children, style = {}, ...props }) => {
  if (!languageName) {
    return null;
  }
  const language = languagesQuery.getEntity(languageName);
  if (!language || !language.ui) {
    console.groupCollapsed(`missing language for ${languageName}`);
    console.table(org);
    console.groupEnd();
  }

  return (
    <div
      className="tag fr"
      style={{ ...(language.ui ?? {}), ...style }}
      {...props}
    >
      {children || languageName}
    </div>
  );
};

export const ActivityTypeTag: React.FC<
  { activityTypeName: ActivityTypeName } & React.HTMLProps<HTMLDivElement>
> = ({ activityTypeName, children, style = {}, ...props }) => {
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
      className="tag fr"
      style={{ ...(activityType.ui ?? {}), ...style }}
      {...props}
    >
      {children || activityTypeName}
    </div>
  );
};

export const OrgTypeTag: React.FC<
  { orgTypeName: OrgTypeName } & React.HTMLProps<HTMLDivElement>
> = ({ orgTypeName, children, style = {}, ...props }) => {
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
      className="tag"
      style={{ ...(orgType?.ui ?? {}), ...style }}
      {...props}
    >
      {children || orgTypeName}
    </div>
  );
};

import React from "react";

import {
  activityTypesQuery,
  languagesQuery,
  orgTypesQuery,
} from "../../lib/hub";
import type {
  ActivityTypeName,
  IActivity,
  IOrg,
  LanguageName,
  OrgTypeName,
} from "../../lib/types";
import "./style.scss";

interface IActivityCardProps {
  activity: IActivity;
  org: IOrg;
}

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

export const PatchInfoBox: React.FC<
  React.ComponentProps<typeof ActivityInfoBox>
> = ({ activity }) => {
  return (
    <>
      {activity?.qaUrl && activity?.qaUrl !== "" && (
        <a
          href={activity.qaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="activity-title"
        >
          PR
        </a>
      )}
    </>
  );
};

export const ActivityInfoBox: React.FC<
  React.ComponentProps<typeof ActivityCard>
> = ({ activity, org }) => {
  return (
    <div style={{ paddingLeft: "1rem", flexGrow: 1 }}>
      {["Patch"].includes(activity.activityType) && (
        <PatchInfoBox activity={activity} org={org} />
      )}
    </div>
  );
};

export const ActivityCard: React.FC<IActivityCardProps> = ({
  activity,
  org,
}) => (
  <div className="card">
    <div style={{ fontWeight: 600 }}>
      <a href={org && org.url ? org.url : "#"} title={activity.title}>
        {activity.title}
      </a>
    </div>
    <ActivityInfoBox activity={activity} org={org} />

    {org?.languages?.map((languageName) => (
      <LanguageTag languageName={languageName} key={languageName} />
    ))}
    {org?.orgType && (
      <OrgTypeTag orgTypeName={org.orgType} style={{ marginLeft: ".75rem" }} />
    )}
  </div>
);

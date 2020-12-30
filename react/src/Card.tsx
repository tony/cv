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
import { LanguageTag, OrgTypeTag } from "./Tag";
import "./style.scss";

interface IActivityCardProps {
  activity: IActivity;
  org: IOrg;
}

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

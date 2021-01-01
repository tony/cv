import React from "react";

import type { IActivity, IOrg } from "@tony/cv-lib/data/types";
import { LanguageTag, OrgTypeTag } from "./Tag";
import "./style.scss";

interface IActivityCardProps {
  activity: IActivity;
  org: IOrg;
}

export const PatchInfo: React.FC<React.ComponentProps<typeof ActivityInfo>> = ({
  activity,
}) => {
  return (
    <>
      {activity?.qaUrl && (
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

export const ActivityInfo: React.FC<
  React.ComponentProps<typeof ActivityCard>
> = ({ activity, org }) => {
  return (
    <div style={{ paddingLeft: "1rem", flexGrow: 1 }}>
      {["Patch"].includes(activity.activityType) && (
        <PatchInfo activity={activity} org={org} />
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
    <ActivityInfo activity={activity} org={org} />

    {org?.languages?.map((languageName) => (
      <LanguageTag languageName={languageName} key={languageName} />
    ))}
    {org?.orgType && (
      <OrgTypeTag orgTypeName={org.orgType} style={{ marginLeft: ".75rem" }} />
    )}
  </div>
);

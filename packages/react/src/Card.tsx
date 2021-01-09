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
          Pull Request
        </a>
      )}
    </>
  );
};

export const ActivityInfo: React.FC<
  React.ComponentProps<typeof ActivityCard>
> = ({ activity, org }) => {
  return (
    <div style={{ flexGrow: 1 }}>
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
  <div className="card cardGrid">
    <div className="left-top"></div>
    <div className="top-content">
      <strong>
        <a href={org && org.url ? org.url : "#"} title={activity.title}>
          {activity.title}
        </a>
      </strong>
    </div>
    <div className="right-top"></div>
    <div className="left-center">
      <ActivityInfo activity={activity} org={org} />
    </div>

    <div className="content">Details</div>
    <div className="right-center"></div>
    <div className="left-bottom"></div>
    <div className="bottom-content"></div>
    <div className="right-bottom">
      {org?.languages?.map((languageName) => (
        <LanguageTag languageName={languageName} key={languageName} />
      ))}
      {org?.orgType && (
        <OrgTypeTag
          orgTypeName={org.orgType}
          style={{ marginLeft: ".75rem" }}
        />
      )}
    </div>
  </div>
);

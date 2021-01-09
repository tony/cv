import React from "react";

import type { IActivity, IOrg } from "@tony/cv-lib/data/types";
import { ActivityTypeTag, LanguageTag, OrgTypeTag } from "./Tag";
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
        <div
          style={{
            display: "inline",
            paddingRight: "0.5rem",
          }}
        >
          <a
            href={activity.qaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="activity-link"
          >
            Pull Request
          </a>
        </div>
      )}
      {activity?.diffUrl && (
        <div style={{ paddingTop: "0.5rem", display: "inline" }}>
          <a
            href={activity.diffUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="activity-link"
          >
            .diff
          </a>
        </div>
      )}
    </>
  );
};

export const ActivityInfo: React.FC<
  React.ComponentProps<typeof ActivityCard>
> = ({ activity, org }) => {
  return (
    <div style={{ paddingRight: "0.5rem" }}>
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
    <div className="left-top">
      <ActivityTypeTag activityTypeName={activity.activityType} />
    </div>
    <div className="top-content">
      <strong>
        <a href={org && org.url ? org.url : "#"} title={activity.title}>
          {activity.title}
        </a>
      </strong>
    </div>
    <div className="right-top"></div>
    <div className="left-center">
      {org?.orgType && <OrgTypeTag orgTypeName={org.orgType} />}
    </div>
    <div className="content"></div>
    <div className="right-center"></div>
    <div className="left-bottom">
      {org?.languages?.map((languageName) => (
        <LanguageTag
          languageName={languageName}
          key={languageName}
          style={{ display: "inline-flex" }}
        />
      ))}
    </div>
    <div className="bottom-content">
      <ActivityInfo activity={activity} org={org} />
    </div>
    <div className="right-bottom"></div>
  </div>
);

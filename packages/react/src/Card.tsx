import React from "react";
import { format, formatDistance } from "date-fns";

import type { IActivity, IOrg } from "@tony/cv-data/types";
import { ActivityTypeText, LanguageTag } from "./Tag";
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
            paddingRight: "0.75rem",
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
        <div style={{ display: "inline" }}>
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
    <div className="headline">
      <ActivityTypeText activityTypeName={activity.activityType} />
      <div style={{ paddingLeft: "0.25rem" }}>
        <a
          href={org.url}
          target="_blank"
          rel="noopener noreferrer"
          title={org.orgType}
        >
          {org.name}
        </a>
        :
      </div>
      <div style={{ paddingLeft: "0.25rem" }}>
        <a href={org && org.url ? org.url : "#"} title={activity.title}>
          {activity.title}
        </a>
        <span style={{ paddingLeft: "0.5rem" }}>·</span>
        <em
          style={{
            paddingLeft: "0.25rem",
            color: "gray",
            fontWeight: "normal",
          }}
          title={format(new Date(activity.createdAt), "MMMM do, yyyy")}
        >
          {formatDistance(new Date(activity.createdAt), new Date())} ago
        </em>
      </div>
    </div>
    <div className="languages">
      {org?.languages?.map((languageName) => (
        <LanguageTag
          languageName={languageName}
          key={languageName}
          style={{ display: "inline-flex" }}
        />
      ))}
    </div>
    <div className="content">
      <ActivityInfo activity={activity} org={org} />
    </div>
  </div>
);

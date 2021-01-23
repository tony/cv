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
        <span
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
        </span>
      )}
      {activity?.diffUrl && (
        <span style={{ display: "inline" }}>
          <a
            href={activity.diffUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="activity-link"
          >
            .diff
          </a>
        </span>
      )}
    </>
  );
};

export const ActivityInfo: React.FC<
  React.ComponentProps<typeof ActivityCard>
> = ({ activity, org }) => {
  return (
    <span style={{ paddingRight: "0.5rem" }}>
      {["Patch"].includes(activity.activityType) && (
        <PatchInfo activity={activity} org={org} />
      )}
    </span>
  );
};

export const ActivityCard: React.FC<IActivityCardProps> = ({
  activity,
  org,
}) => (
  <div className="card cardGrid">
    <div className="left-side">
      <div>
        <ActivityTypeText activityTypeName={activity.activityType} />
        <span style={{ paddingLeft: "0.25rem" }}>
          <a
            href={org.url}
            target="_blank"
            rel="noopener noreferrer"
            title={org.orgType}
          >
            {org.name}
          </a>
        </span>
        <span style={{ paddingLeft: "0.25rem" }}>
          <span style={{ paddingLeft: "0.25rem" }}>·</span>
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
        </span>
      </div>
      <div style={{ paddingTop: "0.25rem", fontSize: "1rem" }}>
        <span>{activity.title}</span>
      </div>
      <div style={{ paddingTop: "0.25rem", fontSize: "1rem" }}>
        <ActivityInfo activity={activity} org={org} />
      </div>
    </div>
    <div className="right-side">
      {org?.languages?.map((languageName) => (
        <LanguageTag
          languageName={languageName}
          key={languageName}
          style={{ display: "inline-flex" }}
        />
      ))}
    </div>
  </div>
);

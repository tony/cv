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
  const items = [];

  if (activity?.qaUrl) {
    items.push(
      <span>
        <a
          href={activity.qaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="activity-link"
        >
          💬 Pull Request
        </a>
      </span>
    );
  }

  if (activity?.diffUrl) {
    items.push(
      <span>
        <a
          href={activity.diffUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="activity-link"
        >
          ✒️ .diff
        </a>
      </span>
    );
  }

  return (
    <div className="activityLinkRow">
      {items.map((item, idx) => (
        <>
          {idx > 0 && <span style={{ padding: "0 0.5rem" }}>·</span>}
          {item}
        </>
      ))}
    </div>
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
        <span style={{ fontWeight: 600 }}>
          <a
            href={org.url}
            target="_blank"
            rel="noopener noreferrer"
            title={org.orgType}
          >
            {org.name}
          </a>
        </span>
        <span style={{ padding: "0 0.5rem" }}>·</span>
        <span
          style={{
            color: "gray",
            fontWeight: "normal",
          }}
        >
          <ActivityTypeText
            activityTypeName={activity.activityType}
            createdAt={activity.createdAt}
            acceptedAt={activity.acceptedAt}
            startedAt={activity.startedAt}
            endedAt={activity.endedAt}
          />
          <span
            title={format(new Date(activity.createdAt), "MMMM do, yyyy")}
            style={{ paddingLeft: "0.25rem" }}
          >
            {formatDistance(new Date(activity.createdAt), new Date())} ago
          </span>
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

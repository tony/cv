import React from "react";

import { format, formatDistance } from "date-fns";
import { Instance } from "mobx-state-tree";

import {
  ActivityTypeName,
  OrgTypeName,
  type CompanyOrg,
  type IActivityOpenSource,
  type IActivityPublication,
  type IActivityWork,
  type OpenSourceOrg,
  type PublicationOrg,
} from "@tony/cv-data/types";
import { Activity, Org } from "@tony/cv-lib/search/mobx";

import { ActivityTypeText, LanguageTag } from "./Tag";

import "@tony/cv-ui/styles/style.css";

interface IActivityCardProps {
  activity: Instance<typeof Activity>;
  org: Instance<typeof Org>;
}

export const PatchInfo: React.FC<{
  activity: IActivityOpenSource;
  org: Instance<typeof Org>;
}> = ({ activity }) => {
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
      </span>,
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
      </span>,
    );
  }

  return (
    <div className="activityLinkRow">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span style={{ padding: "0 0.5rem" }}>·</span>}
          {item}
        </React.Fragment>
      ))}
    </div>
  );
};

export const PublicationInfo: React.FC<{
  activity: IActivityPublication;
  org: PublicationOrg;
}> = ({ org }) => {
  const items = [];

  if (org?.url) {
    items.push(
      <span>
        <a
          href={org.url}
          target="_blank"
          rel="noopener noreferrer"
          className="activity-link"
        >
          Official homepage
        </a>
      </span>,
    );
  }

  if (org?.amazonUrl) {
    items.push(
      <span>
        <a
          href={org.amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="activity-link"
        >
          Amazon
        </a>
      </span>,
    );
  }
  if (org?.leanpubUrl) {
    items.push(
      <span>
        <a
          href={org.leanpubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="activity-link"
        >
          Leanpub
        </a>
      </span>,
    );
  }
  if (org?.goodreadsUrl) {
    items.push(
      <span>
        <a
          href={org.goodreadsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="activity-link"
        >
          Goodreads
        </a>
      </span>,
    );
  }

  return (
    <div className="activityLinkRow">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span style={{ padding: "0 0.5rem" }}>·</span>}
          {item}
        </React.Fragment>
      ))}
    </div>
  );
};

export const CompanyInfo: React.FC<{
  activity: IActivityWork;
  org: CompanyOrg;
}> = ({ org }) => {
  const items = [];
  if (org?.url) {
    items.push(
      <span>
        <a
          href={org.url}
          target="_blank"
          rel="noopener noreferrer"
          className="activity-link"
        >
          Official homepage
        </a>
      </span>,
    );
  }

  return (
    <div className="activityLinkRow">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span style={{ padding: "0 0.5rem" }}>·</span>}
          {item}
        </React.Fragment>
      ))}
    </div>
  );
};

export const ActivityInfo: React.FC<
  React.ComponentProps<typeof ActivityCard>
> = ({ activity, org }) => {
  return (
    <>
      {ActivityTypeName.Patch == activity.activityType && (
        <PatchInfo
          activity={activity as IActivityOpenSource}
          org={org as OpenSourceOrg}
        />
      )}
      {ActivityTypeName.Publication == activity.activityType && (
        <PublicationInfo
          activity={activity as IActivityPublication}
          org={org as PublicationOrg}
        />
      )}
      {ActivityTypeName.Work == activity.activityType && (
        <CompanyInfo
          activity={activity as IActivityWork}
          org={org as CompanyOrg}
        />
      )}
    </>
  );
};

const DateText: React.FC<
  { date: string } & React.HTMLProps<HTMLSpanElement>
> = ({ date, ...rest }) => (
  <>
    {date && (
      <span title={format(new Date(date), "MMMM do, yyyy")} {...rest}>
        {formatDistance(new Date(date), new Date())} ago
      </span>
    )}
  </>
);

export const ActivityCard: React.FC<IActivityCardProps> = ({
  activity,
  org,
}) => (
  <div className="card cardGrid">
    <div className="left-side">
      <div>
        <span style={{ fontWeight: 600 }}>
          <a
            href={
              org.orgType == OrgTypeName.OpenSource
                ? org.repoUrl ?? org.url
                : org.url
            }
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
          <DateText
            date={activity.acceptedAt ?? activity.createdAt}
            style={{ paddingLeft: "0.25rem" }}
          />
          {activity.endedAt && (
            <>
              {" "}
              until <DateText date={activity.endedAt} />
            </>
          )}
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
      {org?.languages?.map((language) => (
        <LanguageTag
          languageName={language.id}
          key={language.id}
          style={{ display: "inline-flex" }}
        />
      ))}
    </div>
  </div>
);

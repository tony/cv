import React from "react";
import ReactMarkdown from "react-markdown";

import { format, formatDistance } from "date-fns";
import { Instance } from "mobx-state-tree";

import {
  CategoryName,
  OrgTypeName,
  type ActivityOpenSource,
  type ActivityPublication,
  type ActivityWork,
  type CompanyOrg,
  type OpenSourceOrg,
  type PublicationOrg,
} from "@tony/cv-data/types";
import { Activity, Org } from "@tony/cv-lib/search/mobx";

import { CategoryText, LanguageTag } from "./Tag";

import "@tony/cv-ui/styles/style.css";

interface ActivityCardProps {
  activity: Instance<typeof Activity>;
  org: Instance<typeof Org>;
}

export const PatchInfo: React.FC<{
  activity: ActivityOpenSource;
  org: OpenSourceOrg;
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
  activity: ActivityPublication;
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
  activity: ActivityWork;
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
      {CategoryName.Patch == activity.category && (
        <PatchInfo
          activity={activity as ActivityOpenSource}
          org={org as OpenSourceOrg}
        />
      )}
      {CategoryName.Publication == activity.category && (
        <PublicationInfo
          activity={activity as ActivityPublication}
          org={org as PublicationOrg}
        />
      )}
      {CategoryName.Work == activity.category && (
        <CompanyInfo
          activity={activity as ActivityWork}
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

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  org,
}) => {
  const orgLink =
    org.orgType == OrgTypeName.OpenSource ? org.repoUrl || org.url : org.url;

  return (
    <div className="card cardGrid">
      <div className="left-side">
        <div>
          <span style={{ fontWeight: 600 }}>
            <a
              {...(orgLink ? { href: orgLink } : {})}
              target="_blank"
              rel="noopener noreferrer"
              title={org.orgType}
            >
              {org.name}
            </a>
          </span>
          <span style={{ padding: "0 0.5rem" }}>·</span>
          <span className="card-category-and-date">
            <CategoryText
              categoryName={activity.category}
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
          <ReactMarkdown>{activity.title}</ReactMarkdown>
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
};

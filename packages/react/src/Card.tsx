import React from "react";
import ReactMarkdown from "react-markdown";

import { format, formatDistance } from "date-fns";
import { Instance } from "mobx-state-tree";

import { CategoryName, OrgTypeName } from "@tony/cv-data/types";
import type {
  Activity,
  ActivityOpenSource,
  ActivityPublication,
  ActivityWork,
  CompanyOrg,
  OpenSourceOrg,
  Org,
  PublicationOrg,
} from "@tony/cv-lib/search/mobx";

import { CategoryText, LanguageTag } from "./Tag";

interface ActivityCardProps {
  activity: Instance<typeof Activity>;
}

export const PatchInfo: React.FC<{
  activity: Instance<typeof ActivityOpenSource>;
}> = ({ activity }) => {
  const items = [];

  if (activity?.qaUrl) {
    items.push(
      <span>
        <a
          href={activity.qaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="activity-link text-gray-500 hover:text-slate-500"
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
    <div className="activity-link-row text-xs">
      {items.map((item, idx) => (
        <React.Fragment key={`patch-activity-link-row-${idx}`}>
          {idx > 0 && <span className="card-section-separator">·</span>}
          {item}
        </React.Fragment>
      ))}
    </div>
  );
};

export const PublicationInfo: React.FC<{
  org: Instance<typeof PublicationOrg>;
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
    <div className="activity-link-row">
      {items.map((item, idx) => (
        <React.Fragment key={`publication-info-activity-link-row-${idx}`}>
          {idx > 0 && <span className="card-section-separator">·</span>}
          {item}
        </React.Fragment>
      ))}
    </div>
  );
};

export const CompanyInfo: React.FC<{
  org: Instance<typeof CompanyOrg>;
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
    <div className="activity-link-row">
      {items.map((item, idx) => (
        <React.Fragment key={`company-activity-link-row-${idx}`}>
          {idx > 0 && <span className="card-section-separator">·</span>}
          {item}
        </React.Fragment>
      ))}
    </div>
  );
};

export const ActivityInfo: React.FC<React.ComponentProps<typeof ActivityCard>> =
  ({ activity }) => {
    const { org } = activity;
    return (
      <>
        {CategoryName.Patch === activity.category && (
          <PatchInfo
            activity={activity as Instance<typeof ActivityOpenSource>}
          />
        )}
        {CategoryName.Publication === activity.category && (
          <PublicationInfo org={org as Instance<typeof PublicationOrg>} />
        )}
        {CategoryName.Work === activity.category && (
          <CompanyInfo org={org as Instance<typeof CompanyOrg>} />
        )}
      </>
    );
  };

const DateText: React.FC<{ date: string } & React.HTMLProps<HTMLSpanElement>> =
  ({ date, className }) =>
    date && (
      <span
        title={format(new Date(date), "MMMM do, yyyy")}
        className={className}
      >
        {formatDistance(new Date(date), new Date())} ago
      </span>
    );

const LanguageTags: React.FC<{ org: Instance<typeof Org> }> = ({ org }) => {
  return (
    <div className="language-tags">
      {org?.languages?.map((language) => (
        <LanguageTag languageName={language.id} key={language.id} />
      ))}
    </div>
  );
};

const CardOrgName: React.FC<{ org: Instance<typeof Org> }> = ({ org }) => {
  const orgLink =
    org.orgType === OrgTypeName.OpenSource ? org.repoUrl || org.url : org.url;

  return (
    <span className="card-org-name">
      <a
        {...(orgLink ? { href: orgLink } : {})}
        target="_blank"
        rel="noopener noreferrer"
        title={org.orgType}
      >
        {org.name}
      </a>
    </span>
  );
};

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const { org } = activity;
  return (
    <div className="card card-grid text-sm flex justify-space-between h-full">
      <div className="left-side">
        <div>
          <CardOrgName org={org} />
          <span className="card-section-separator">·</span>
          <span className="card-category-and-date">
            <CategoryText activity={activity} />
            <DateText
              date={activity.acceptedAt ?? activity.createdAt}
              className="card-date-text-left"
            />
            {activity.endedAt && (
              <>
                {" "}
                until <DateText date={activity.endedAt} />
              </>
            )}
          </span>
        </div>
        <div className="card-activity-title">
          <ReactMarkdown>{activity.title}</ReactMarkdown>
        </div>
        <div className="card-activity-info">
          <ActivityInfo activity={activity} />
        </div>
      </div>
      <div className="right-side">
        <LanguageTags org={org} />
      </div>
    </div>
  );
};

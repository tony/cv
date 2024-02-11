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

const activityLinkClasses =
  "text-gray-500 hover:text-slate-700 dark:hover:text-slate-200";

interface ActivityCardProps {
  activity: Instance<typeof Activity>;
}

export const PatchInfo: React.FC<{
  activity: Instance<typeof ActivityOpenSource>;
}> = ({ activity }) => {
  type PatchLink = [id: string, component: React.ReactNode];
  const items: PatchLink[] = [];

  if (activity?.qaUrl) {
    items.push([
      "qa-link",
      <span>
        <a
          href={activity.qaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={activityLinkClasses}
        >
          💬 Pull Request
        </a>
      </span>,
    ]);
  }

  if (activity?.diffUrl) {
    items.push([
      "diff-link",
      <span>
        <a
          href={activity.diffUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={activityLinkClasses}
        >
          ✒️ .diff
        </a>
      </span>,
    ]);
  }

  return items.map(([id, component], idx) => (
    <React.Fragment key={`patch-activity-link-row-${id}`}>
      {idx > 0 && (
        <span className="card-section-separator text-black dark:text-white px-1">
          ·
        </span>
      )}
      {component}
    </React.Fragment>
  ));
};

export const PublicationInfo: React.FC<{
  org: Instance<typeof PublicationOrg>;
}> = ({ org }) => {
  type PublicationLink = [id: string, component: React.ReactNode];
  const items: PublicationLink[] = [];

  if (org?.url) {
    items.push([
      "publication-homepage",
      <span>
        <a
          href={org.url}
          target="_blank"
          rel="noopener noreferrer"
          className={activityLinkClasses}
        >
          Official homepage
        </a>
      </span>,
    ]);
  }

  if (org?.amazonUrl) {
    items.push([
      "amazon-link",
      <span>
        <a
          href={org.amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={activityLinkClasses}
        >
          Amazon
        </a>
      </span>,
    ]);
  }
  if (org?.leanpubUrl) {
    items.push([
      "leanpub-link",
      <span>
        <a
          href={org.leanpubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={activityLinkClasses}
        >
          Leanpub
        </a>
      </span>,
    ]);
  }
  if (org?.goodreadsUrl) {
    items.push([
      "goodreads-link",

      <span>
        <a
          href={org.goodreadsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={activityLinkClasses}
        >
          Goodreads
        </a>
      </span>,
    ]);
  }

  return items.map(([id, component], idx) => (
    <React.Fragment key={`publication-info-activity-link-row-${id}`}>
      {idx > 0 && <span className="card-section-separator">·</span>}
      {component}
    </React.Fragment>
  ));
};

export const CompanyInfo: React.FC<{
  org: Instance<typeof CompanyOrg>;
}> = ({ org }) => {
  type CompanyLink = [id: string, component: React.ReactNode];
  const items: CompanyLink[] = [];
  if (org?.url) {
    items.push([
      "company-homepage",
      <span>
        <a
          href={org.url}
          target="_blank"
          rel="noopener noreferrer"
          className={activityLinkClasses}
        >
          Official homepage
        </a>
      </span>,
    ]);
  }

  return items.map(([id, component], idx) => (
    <React.Fragment key={`company-activity-link-row-${id}`}>
      {idx > 0 && <span className="card-section-separator">·</span>}
      {component}
    </React.Fragment>
  ));
};

export const Links: React.FC<{
  activity: Instance<typeof Activity>;
}> = ({ activity }) => {
  type LinkType = [id: string, component: React.ReactNode];
  const items: LinkType[] = [];

  if (activity?.links) {
    for (const [id, link] of activity.links) {
      items.push([
        `link-${id}`,
        <span>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={activityLinkClasses}
          >
            {link.title}
          </a>
        </span>,
      ]);
    }
  }

  return items.map(([id, component], idx) => (
    <React.Fragment key={`links-link-row-${id}`}>
      {idx > 0 && (
        <span className="card-section-separator text-black dark:text-white px-1">
          ·
        </span>
      )}
      {component}
    </React.Fragment>
  ));
};

export const ActivityInfo: React.FC<React.ComponentProps<typeof ActivityCard>> =
  ({ activity }) => {
    const { org } = activity;
    return (
      <div className="activity-link-row text-xs">
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
        {activity?.links && <Links activity={activity} />}
      </div>
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
  return org?.languages?.map((language) => (
    <LanguageTag languageName={language.id} key={language.id} />
  ));
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
        className={activityLinkClasses}
      >
        {org.name}
      </a>
    </span>
  );
};

const PullRequestJourney: React.FC<ActivityCardProps & { isOpen?: boolean }> =
  ({ activity, isOpen }) => {
    if (activity.category !== CategoryName.Patch || !isOpen) {
      return null;
    }
    const isGithub = activity?.diffUrl?.includes("github.com");
    return (
      <div className="pull-request-journey max-w-4xl my-2 ml-2">
        <ol className="relative border-s border-gray-200 dark:border-gray-700">
          <li className="mb-6 ms-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-5 ring-white dark:ring-gray-900 dark:bg-blue-900">
              {/* Credit: git-pull-request, https://primer.style/foundations/icons/git-pull-request-16 */}
              <svg
                className="w-3.5 h-3.5 text-blue-800 dark:text-blue-300"
                aria-hidden="true"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16"
                height="16"
              >
                <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" />
              </svg>
            </span>
            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              {activity.createdAt}
            </time>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isGithub ? "Opened pull request" : "Submitted patch"}{" "}
            </h3>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              {isGithub ? "Pull request opened with" : "Patch submitted to"}{" "}
              <CardOrgName org={activity.org} />
              {isGithub && (
                <>
                  {" "}
                  at{" "}
                  <a
                    href={`${activity.org.repoUrl}/pull/${activity.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={activityLinkClasses}
                  >
                    {activity.org.name}#{activity.number}
                  </a>
                </>
              )}
              .
            </p>
          </li>
          {activity.acceptedAt ? (
            <li className="ms-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-5 ring-white dark:ring-gray-900 dark:bg-blue-900">
                {/* Credit: git-merge, https://primer.style/foundations/icons/git-merge-16 */}
                <svg
                  className="w-3.5 h-3.5 text-blue-800 dark:text-blue-300"
                  aria-hidden="true"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                >
                  <path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z" />
                </svg>
              </span>
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {activity.acceptedAt}
              </time>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Merged to project
              </h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                {isGithub ? "Pull request merged" : "Patch accepted"} to{" "}
                <CardOrgName org={activity.org} />.
              </p>
            </li>
          ) : activity.closedAt ? (
            <li className="ms-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-5 ring-white dark:ring-gray-900 dark:bg-blue-900">
                <svg
                  className="w-3.5 h-3.5 text-blue-800 dark:text-blue-300"
                  aria-hidden="true"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                >
                  {/* Credit: git-pull-request-closed, https://primer.style/foundations/icons/git-pull-request-closed-16 */}
                  <path d="M3.25 1A2.25 2.25 0 0 1 4 5.372v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.251 2.251 0 0 1 3.25 1Zm9.5 5.5a.75.75 0 0 1 .75.75v3.378a2.251 2.251 0 1 1-1.5 0V7.25a.75.75 0 0 1 .75-.75Zm-2.03-5.273a.75.75 0 0 1 1.06 0l.97.97.97-.97a.748.748 0 0 1 1.265.332.75.75 0 0 1-.205.729l-.97.97.97.97a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-.97-.97-.97.97a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l.97-.97-.97-.97a.75.75 0 0 1 0-1.06ZM2.5 3.25a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0ZM3.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm9.5 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
                </svg>
              </span>
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {activity.closedAt}
              </time>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pull request closed
              </h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Pull request to {activity.org.name} closed.
              </p>
            </li>
          ) : (
            <li className="ms-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-5 ring-white dark:ring-gray-900 dark:bg-blue-900">
                <svg
                  className="w-3.5 h-3.5 text-blue-800 dark:text-blue-300"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  {/* Credit: git-merge-queue-16, https://primer.style/foundations/icons/git-merge-queue-16 */}
                  <path d="M3.75 4.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3 7.75a.75.75 0 0 1 1.5 0v2.878a2.251 2.251 0 1 1-1.5 0Zm.75 5.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm5-7.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm5.75 2.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-1.5 0a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
                </svg>
              </span>
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Current status
              </time>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Awaiting final review
              </h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Pull request to {activity.org.name} still open.
              </p>
            </li>
          )}
        </ol>
      </div>
    );
  };

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const { org } = activity;
  const [isOpen, setIsOpen] = React.useState(false);
  const clickOpen:
    | React.MouseEventHandler<HTMLLIElement>
    | React.KeyboardEventHandler<HTMLLIElement>
    | undefined = (
    e: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>,
  ) => {
    // Don't trigger if clicking a link
    if ((event?.target as HTMLElement)?.tagName?.toLowerCase() === "a") return;

    // Don't trigger if selecting text
    const cellText = document.getSelection();
    if (cellText?.type === "Range") {
      e.stopPropagation();
      return;
    }

    const keyPress = e.type === "keydown" && (e as React.KeyboardEvent).key;
    const navKeys = ["Enter", "ArrowUp", "ArrowDown"];
    if (keyPress) {
      const cardEl = e.currentTarget?.closest(".card");
      const previousItem =
        cardEl?.previousElementSibling ??
        document.querySelector("#chart-menu button:last-child");
      const nextItem = cardEl?.nextElementSibling;

      if (["ArrowUp", "k"].includes(keyPress)) {
        (previousItem as HTMLDivElement)?.focus();
        return;
      }
      if (["ArrowDown", "j"].includes(keyPress)) {
        (nextItem as HTMLDivElement)?.focus();
        return;
      }

      if (["ArrowRight", "l"].includes(keyPress)) {
        setIsOpen(!isOpen);
        return;
      }

      if (["ArrowLeft", "h"].includes(keyPress)) {
        setIsOpen(!isOpen);
        return;
      }

      if (["Space", " "].includes(keyPress)) {
        setIsOpen(!isOpen);
        e.preventDefault();
        return;
      }

      if (["Tab", "Shift", "Control", "Alt", "z"].includes(keyPress)) {
        return;
      }
    }

    setIsOpen(!isOpen);
  };
  return (
    <li
      className="card card-grid text-sm flex justify-space-between h-full rounded-sm md:rounded max-w-4xl p-2 m-0 md:m-1 lg:m-2 align-center space-between hover:bg-[#0085f230] flex-col md:flex-row"
      onClick={clickOpen}
      onKeyDown={clickOpen}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: Simplest way with JSX?
      tabIndex={0}
    >
      <div className="left-side flex-grow">
        <div>
          <CardOrgName org={org} />
          <span className="card-section-separator px-1">·</span>
          <span className="card-category-and-date">
            <CategoryText activity={activity} />
            <DateText
              date={activity.acceptedAt ?? activity.createdAt}
              className="card-date-text-left pl-1"
            />
            {activity.endedAt && (
              <span className="pl-1">
                until <DateText date={activity.endedAt} />
              </span>
            )}
          </span>
        </div>
        <div className="card-activity-title">
          <ReactMarkdown>{activity.title}</ReactMarkdown>
        </div>
        <PullRequestJourney activity={activity} isOpen={isOpen} />
        <div className="card-activity-info">
          <ActivityInfo activity={activity} />
        </div>
      </div>
      <div className="right-side text-left md:text-right pt-2 md:pt-0 gap-x-1 flex">
        <LanguageTags org={org} />
      </div>
    </li>
  );
};

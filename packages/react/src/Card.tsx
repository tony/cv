import { observer } from "mobx-react-lite";
import React from "react";
import ReactMarkdown from "react-markdown";

import { format, formatDistance } from "date-fns";
import type { Instance } from "mobx-state-tree";

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

import {
  DiffIcon,
  GitMergeIcon,
  GitMergeQueueIcon,
  GitPullRequestClosedIcon,
  GitPullRequestIcon,
} from "./Icons";
import { ActivityActionText, LanguageTag } from "./Tag";

const activityLinkClasses =
  "text-gray-500 hover:text-slate-700 dark:hover:text-slate-200";

interface ActivityCardProps {
  activity: Instance<typeof Activity>;
}

interface LinkProps {
  id: string;
  title: React.ReactNode;
  url: string;
}

export const Links: React.FC<{
  linkMap: LinkProps[];
}> = ({ linkMap }) => {
  if (!linkMap.length) return null;
  return (
    <div className="flex gap-1.5">
      {linkMap.map((link, idx) => (
        <React.Fragment key={link.id}>
          {idx > 0 && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="self-center"
              width="3"
              height="4"
              viewBox="0 0 3 4"
              fill="none"
            >
              <circle
                cx="1.5"
                cy="2"
                r="1.5"
                className="fill-gray-500 dark:fill-gray-400"
              />
            </svg>
          )}
          <span
            className="flex [&>*]:flex [&>*]:items-center [&>a>span]:items-center"
            key={link.id}
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={activityLinkClasses}
            >
              {link.title}
            </a>
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export const PatchLinks: React.FC<{
  activity: Instance<typeof ActivityOpenSource>;
}> = observer(({ activity }) => (
  <Links
    linkMap={[
      {
        id: "qa-link",
        title: (
          <span className="inline-flex justify-center">
            <GitPullRequestIcon
              wrapperClassName="bg-inherit dark:bg-inherit inline-flex w-3 h-3 mr-0.5"
              svgClassName={"text-inherit dark:text-inherit w-3 h-3"}
            />{" "}
            Pull Request
          </span>
        ),
        url: activity.qaUrl,
      },
      {
        id: "diff-link",
        title: (
          <span className="inline-flex justify-center">
            <DiffIcon
              wrapperClassName="bg-inherit dark:bg-inherit inline-flex w-3 h-3 mr-0.5"
              svgClassName={"text-inherit dark:text-inherit w-3 h-3"}
            />{" "}
            .diff
          </span>
        ),
        url: activity.diffUrl,
      },
    ]}
  />
));

export const PublicationLinks: React.FC<{
  org: Instance<typeof PublicationOrg>;
}> = observer(({ org }) => (
  <Links
    linkMap={[
      ...(org?.url
        ? [
            {
              id: "publication-homepage",
              title: "Official homepage",
              url: org.url,
            },
          ]
        : []),
      ...(org?.amazonUrl
        ? [{ id: "amazon-link", title: "Amazon", url: org?.amazonUrl }]
        : []),
      ...(org?.leanpubUrl
        ? [{ id: "leanpub-link", title: "Leanpub", url: org?.leanpubUrl }]
        : []),
      ...(org?.goodreadsUrl
        ? [{ id: "goodreads-link", title: "Goodreads", url: org?.goodreadsUrl }]
        : []),
    ]}
  />
));

export const CompanyLinks: React.FC<{
  org: Instance<typeof CompanyOrg>;
}> = observer(({ org }) => (
  <Links
    linkMap={[
      ...(org?.url
        ? [
            {
              id: "company-homepage",
              title: "Official homepage",
              url: org.url,
            },
          ]
        : []),
    ]}
  />
));

export const PullRequestLinks: React.FC<{
  activity: Instance<typeof ActivityOpenSource>;
}> = observer(
  ({ activity }) =>
    activity?.links && (
      <Links
        linkMap={Array.from(activity?.links)?.map(([id, link]) => ({
          id,
          title: link.title,
          url: link.url,
        }))}
      />
    ),
);

export const ActivityLinks: React.FC<
  React.ComponentProps<typeof ActivityCard>
> = observer(({ activity }) => {
  const { org } = activity;
  return (
    <div className="activity-link-row text-xs inline-flex items-center">
      {CategoryName.Patch === activity.category && (
        <PatchLinks
          activity={activity as Instance<typeof ActivityOpenSource>}
        />
      )}
      {CategoryName.Publication === activity.category && (
        <PublicationLinks org={org as Instance<typeof PublicationOrg>} />
      )}
      {CategoryName.Work === activity.category && (
        <CompanyLinks org={org as Instance<typeof CompanyOrg>} />
      )}
      {activity?.links && <PullRequestLinks activity={activity} />}
    </div>
  );
});

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

const LanguageTags: React.FC<{ org: Instance<typeof Org> }> = observer(
  ({ org }) => {
    return org?.languages?.map((language) => (
      <LanguageTag languageName={language.id} key={language.id} />
    ));
  },
);

const OrganizationLink: React.FC<{ org: Instance<typeof Org> }> = observer(
  ({ org }) => {
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
  },
);

const PullRequestJourney: React.FC<ActivityCardProps & { isOpen?: boolean }> =
  observer(({ activity, isOpen }) => {
    if (activity.category !== CategoryName.Patch || !isOpen) {
      return null;
    }
    const isGithub = activity?.diffUrl?.includes("github.com");
    return (
      <div className="pull-request-journey max-w-4xl my-2 ml-2">
        <ol className="relative border-s border-gray-200 dark:border-gray-700">
          <li className="mb-6 ms-6">
            <GitPullRequestIcon
              wrapperClassName="absolute w-6 h-6"
              svgClassName="w-3.5 h-3.5"
            />
            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              {activity.createdAt}
            </time>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isGithub ? "Opened pull request" : "Submitted patch"}{" "}
            </h3>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              {isGithub ? "Pull request opened with" : "Patch submitted to"}{" "}
              <OrganizationLink org={activity.org} />
              {isGithub && (
                <>
                  {" "}
                  at{" "}
                  <a
                    href={activity.qaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={activityLinkClasses}
                  >
                    {activity.org.name}#
                    {activity.number ?? activity.qaUrl.split("/").slice(-1)}
                  </a>
                </>
              )}
              .
            </p>
          </li>
          {activity.acceptedAt ? (
            <li className="ms-6">
              <GitMergeIcon
                wrapperClassName="absolute w-6 h-6"
                svgClassName="w-3.5 h-3.5"
              />
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {activity.acceptedAt}
              </time>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Merged to project
              </h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                {isGithub ? "Pull request merged" : "Patch accepted"} to{" "}
                <OrganizationLink org={activity.org} />
                {isGithub && (
                  <>
                    {" "}
                    via{" "}
                    <a
                      href={activity?.mergeCommit?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={activityLinkClasses}
                    >
                      {activity?.org?.name}@
                      {activity?.mergeCommit?.abbreviatedOid}
                    </a>
                  </>
                )}
                .
              </p>
            </li>
          ) : activity.closedAt ? (
            <li className="ms-6">
              <GitPullRequestClosedIcon
                wrapperClassName="absolute w-6 h-6"
                svgClassName="w-3.5 h-3.5"
              />
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
              <GitMergeQueueIcon
                wrapperClassName="absolute w-6 h-6"
                svgClassName="w-3.5 h-3.5"
              />
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
  });

export const ActivityCard: React.FC<ActivityCardProps> = observer(
  ({ activity }) => {
    const { org } = activity;
    const [isOpen, setIsOpen] = React.useState(false);
    const clickOpen:
      | React.MouseEventHandler<HTMLLIElement>
      | React.KeyboardEventHandler<HTMLLIElement>
      | undefined = (
      e: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>,
    ) => {
      // Don't trigger if clicking a link
      if ((event?.target as HTMLElement)?.tagName?.toLowerCase() === "a")
        return;

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
            <OrganizationLink org={org} />
            <span className="card-section-separator px-1">·</span>
            <span className="card-category-and-date">
              <ActivityActionText activity={activity} />
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
          <div className="card-activity-links inline-flex items-center">
            <ActivityLinks activity={activity} />
          </div>
        </div>
        <div className="right-side text-left md:text-right pt-1 md:pt-0 gap-x-1 flex">
          <LanguageTags org={org} />
        </div>
      </li>
    );
  },
);

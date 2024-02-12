import React from "react";

export interface IconProps {
  wrapperClassName: string;
  svgClassName: string;
}

export const GitPullRequestIcon: React.FC<IconProps> = ({
  wrapperClassName = "",
  svgClassName = "",
}) => (
  <span
    className={`${wrapperClassName} flex items-center justify-center bg-green-100 rounded-full -start-3 ring-5 ring-white dark:ring-gray-900 dark:bg-green-900`}
  >
    {/* Credit: git-pull-request, https://primer.style/foundations/icons/git-pull-request-16 */}
    <svg
      className={`${svgClassName} text-green-800 dark:text-green-300`}
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
);

export const GitPullRequestClosedIcon: React.FC<IconProps> = ({
  wrapperClassName = "",
  svgClassName = "",
}) => (
  <span
    className={`${wrapperClassName} flex items-center justify-center bg-red-100 rounded-full -start-3 ring-5 ring-white dark:ring-gray-900 dark:bg-red-900`}
  >
    <svg
      className={`${svgClassName} text-red-800 dark:text-red-300`}
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
);

export const GitMergeIcon: React.FC<IconProps> = ({
  wrapperClassName = "",
  svgClassName = "",
}) => (
  <span
    className={`${wrapperClassName} flex items-center justify-center bg-purple-100 rounded-full -start-3 ring-5 ring-white dark:ring-gray-900 dark:bg-purple-900`}
  >
    {/* Credit: git-merge, https://primer.style/foundations/icons/git-merge-16 */}
    <svg
      className={`${svgClassName} text-purple-800 dark:text-purple-300`}
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
);

export const GitMergeQueueIcon: React.FC<IconProps> = ({
  wrapperClassName = "",
  svgClassName = "",
}) => (
  <span
    className={`${wrapperClassName} flex items-center justify-center bg-blue-100 rounded-full -start-3 ring-5 ring-white dark:ring-gray-900 dark:bg-blue-900`}
  >
    <svg
      className={`${svgClassName} text-blue-800 dark:text-blue-300`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      {/* Credit: git-merge-queue-16, https://primer.style/foundations/icons/git-merge-queue-16 */}
      <path d="M3.75 4.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3 7.75a.75.75 0 0 1 1.5 0v2.878a2.251 2.251 0 1 1-1.5 0Zm.75 5.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm5-7.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm5.75 2.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-1.5 0a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
    </svg>
  </span>
);

export const DiffIcon: React.FC<IconProps> = ({
  wrapperClassName = "",
  svgClassName = "",
}) => (
  <span
    className={`${wrapperClassName} flex items-center justify-center bg-gray-100 rounded-full -start-3 ring-5 ring-white dark:ring-gray-900 dark:bg-gray-900`}
  >
    <svg
      className={`${svgClassName} text-gray-800 dark:text-gray-300`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      {/* Credit: git-diff-16, https://primer.style/foundations/icons/git-diff-16 */}
      <path d="M8.75 1.75V5H12a.75.75 0 0 1 0 1.5H8.75v3.25a.75.75 0 0 1-1.5 0V6.5H4A.75.75 0 0 1 4 5h3.25V1.75a.75.75 0 0 1 1.5 0ZM4 13h8a.75.75 0 0 1 0 1.5H4A.75.75 0 0 1 4 13Z" />
    </svg>
  </span>
);

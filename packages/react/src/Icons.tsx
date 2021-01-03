import React from "react";
import {
  IconPackage,
  IconSettings,
  IconFileDiff,
  IconBriefcase,
  IconHeart,
  IconBook,
  IconBrowser,
  IconNews,
} from "@tabler/icons";
import type { TablerIconProps } from "@tabler/icons";
import type { ActivityTypeName } from "@tony/cv-lib/data/types";

type TablerIcon = React.FC<TablerIconProps>;
const activityTypeNameToIcon: {
  // [key: ActivityTypeName]: string;
  SoftwareApp: TablerIcon;
  SoftwareLib: TablerIcon;
  Patch: TablerIcon;
  Work: TablerIcon;
  Publication: TablerIcon;
  Volunteer: TablerIcon;
  Website: TablerIcon;
  Article: TablerIcon;
} = {
  SoftwareApp: IconPackage,
  SoftwareLib: IconSettings,
  Patch: IconFileDiff,
  Work: IconBriefcase,
  Volunteer: IconHeart,
  Publication: IconBook,
  Website: IconBrowser,
  Article: IconNews,
};

export const ActivityTypeIcon: React.FC<
  React.ComponentProps<typeof IconNews> & {
    activityTypeId: ActivityTypeName;
  }
> = ({ activityTypeId, ...props }) => {
  console.log({ activityTypeId });
  const Icon = activityTypeNameToIcon[activityTypeId];
  return <Icon {...props} />;
};

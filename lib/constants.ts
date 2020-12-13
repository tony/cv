import type { ActivityTypeName, OrgTypeName, LanguageName } from "./types";

export const ActivityTypeNameMap: {
  // [key: ActivityTypeName]: string;
  SoftwareApp: string;
  SoftwareLib: string;
  Patch: string;
  Work: string;
  Publication: string;
  Volunteer: string;
  Website: string;
  Article: string;
} = {
  SoftwareApp: "App",
  SoftwareLib: "Software Component (Library)",
  Patch: "Software Contribution (Patch)",
  Work: "Work",
  Publication: "Publication",
  Volunteer: "Volunteer",
  Website: "Website",
  Article: "Article",
};
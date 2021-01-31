import CSS from "csstype";

interface IThemeable {
  ui: NonNullable<Pick<CSS.Properties, "color" | "backgroundColor">>;
}

// export type ActivityTypeName =
//   | "SoftwareApp"
//   | "SoftwareLib"
//   | "Patch"
//   | "Work"
//   | "Publication"
//   | "Volunteer"
//   | "Website"
//   | "Article";

export enum ActivityTypeName {
  SoftwareApp = "SoftwareApp",
  SoftwareLib = "SoftwareLib",
  Patch = "Patch",
  Work = "Work",
  Publication = "Publication",
  Volunteer = "Volunteer",
  Website = "Website",
  Article = "Article",
}

export interface ActivityType extends IThemeable {
  id: ActivityTypeName;
  name: ActivityTypeName;
}

export interface IActivityCommon {
  title: string;
  activityType: ActivityTypeName;
  orgId: string;

  // Dates
  createdAt: string;
  acceptedAt?: string;
  startedAt?: string;
  endedAt?: string;
}

export interface IActivityOpenSource extends IActivityCommon {
  activityType: ActivityTypeName.Patch;

  // URLs
  qaUrl: string;
  diffUrl: string;

  // Dates
  createdAt: string;
  acceptedAt: string;
  startedAt: string;
  endedAt: string;
}

export interface IActivitySoftware extends IActivityCommon {
  activityType: ActivityTypeName.SoftwareLib | ActivityTypeName.SoftwareApp;
}

export interface IActivityWebsite extends IActivityCommon {
  activityType: ActivityTypeName.Website;
}

export interface IActivityVolunteer extends IActivityCommon {
  activityType: ActivityTypeName.Volunteer;
}

export interface IActivityArticle extends IActivityCommon {
  activityType: ActivityTypeName.Article;

  // Dates
  featured: {
    HN?: string;
    "/r/python"?: string;
    "/r/flask"?: string;
    "/r/django"?: string;
  };
}

export interface IActivityPublication extends IActivityCommon {
  activityType: ActivityTypeName.Publication;
}
export type IActivity =
  | IActivityOpenSource
  | IActivitySoftware
  | IActivityWebsite
  | IActivityArticle
  | IActivityVolunteer
  | IActivityPublication
  | IActivityCommon;

export type LanguageName = string;
// export type LanguageName =
//   | "Python"
//   | "PHP"
//   | "Makefile"
//   | "Markdown"
//   | "ShellScript"
//   | "JavaScript"
//   | "Vim script"
//   | undefined
//   | "Shell"
//   | "Ruby"
//   | "CSS"
//   | "OCaml"
//   | "SaltStack"
//   | "Batchfile"
//   | "C++"
//   | "Go"
//   | "C#"
//   | "TeX"
//   | "HTML"
//   | "sed"
//   | "C"
//   | "CMake"
//   | "TypeScript";

export interface Language extends IThemeable {
  id: LanguageName;
}

export type OrgName = string;

// export type OrgTypeName = "Open Source" | "Company" | "Publication" | "Website";
export enum OrgTypeName {
  OpenSource = "Open Source",
  Company = "Company",
  Publication = "Publication",
  Website = "Website",
}

export interface OrgType extends IThemeable {
  id: OrgTypeName;
  name: OrgTypeName;
}

export interface Org {
  id: string;
  orgType: OrgTypeName;
  name: OrgName;
  url?: string;

  languages: LanguageName[];
}

export interface CompanyOrg extends Org {
  orgType: OrgTypeName.Company;
  oldUrl?: string;
}

export interface PublicationOrg extends Org {
  orgType: OrgTypeName.Company;
  leanpubUrl?: string;
  amazonUrl?: string;
  goodreadsUrl?: string;
  logo?: string;
}

export interface WebsiteOrg extends Org {
  orgType: OrgTypeName.Website;
  url?: string;
  logo?: string;
}

export interface OpenSourceOrg extends Org {
  orgType: OrgTypeName.OpenSource;
  oldUrl?: string;
  repoUrl?: string;
  docsUrl?: string;
  apiUrl?: string;
  ciUrl?: string;
  coverageUrl?: string;
  changelogUrl?: string;
  issuesUrl?: string;
  browseCodeTestsUrl?: string;
  browseCodeUrl?: string;
}

export type IOrg = CompanyOrg | PublicationOrg | OpenSourceOrg | WebsiteOrg;

export interface IOrgs {
  [key: string]: IOrg;
}

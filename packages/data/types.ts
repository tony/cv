import type CSS from "csstype";

export enum Chart {
  Carbon = "carbon",
  Plotly = "plotly",
  Billboard = "billboard",
  Nivo = "nivo",
  Victory = "victory",
}

interface IThemeable {
  ui: NonNullable<Pick<CSS.Properties, "color" | "backgroundColor">>;
}

export enum CategoryName {
  SoftwareApp = "SoftwareApp",
  SoftwareLib = "SoftwareLib",
  Patch = "Patch",
  Work = "Work",
  Acquisition = "Acquisition",
  Publication = "Publication",
  Volunteer = "Volunteer",
  Website = "Website",
  Article = "Article",
}

export interface Category extends IThemeable {
  id: CategoryName;
  name: CategoryName;
}

export interface ActivityCommon {
  id: string;
  title: string;
  category: CategoryName;
  org: string;

  // Dates
  createdAt: string;
  acceptedAt?: string;
  startedAt?: string;
  endedAt?: string;
}

export interface ActivityOpenSource extends ActivityCommon {
  category: CategoryName.Patch;

  // URLs
  qaUrl: string;
  diffUrl: string;

  // Dates
  createdAt: string;
  acceptedAt: string;
  startedAt: string;
  endedAt: string;
}

export interface ActivitySoftware extends ActivityCommon {
  category: CategoryName.SoftwareLib | CategoryName.SoftwareApp;
}

export interface ActivityWebsite extends ActivityCommon {
  category: CategoryName.Website;
}

export interface ActivityVolunteer extends ActivityCommon {
  category: CategoryName.Volunteer;
}

export interface ActivityArticle extends ActivityCommon {
  category: CategoryName.Article;

  // Links
  featured: {
    HN?: string;
    "/r/python"?: string;
    "/r/flask"?: string;
    "/r/django"?: string;
  };
}

export interface ActivityPublication extends ActivityCommon {
  category: CategoryName.Publication;
}

export interface ActivityWork extends ActivityCommon {
  category: CategoryName.Work;

  // Dates
  createdAt: string;
  endedAt?: string;
}

export type Activity =
  | ActivityOpenSource
  | ActivitySoftware
  | ActivityWebsite
  | ActivityArticle
  | ActivityVolunteer
  | ActivityPublication
  | ActivityWork
  | ActivityCommon;

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
  logo: string;
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

export type OrgLiteral =
  | CompanyOrg
  | PublicationOrg
  | OpenSourceOrg
  | WebsiteOrg;

export interface Orgs {
  [key: string]: OrgLiteral;
}

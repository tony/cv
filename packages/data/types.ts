import CSS from "csstype";

interface IThemeable {
  ui: NonNullable<Pick<CSS.Properties, "color" | "backgroundColor">>;
}

export type ActivityTypeName =
  | "SoftwareApp"
  | "SoftwareLib"
  | "Patch"
  | "Work"
  | "Publication"
  | "Volunteer"
  | "Website"
  | "Article";

export interface ActivityType extends IThemeable {
  id: ActivityTypeName;
  name: ActivityTypeName;
}

export interface IActivity {
  createdDate: string;
  title: string;
  activityType: ActivityTypeName;
  orgId: string;
  acceptedDate?: string;
  qaUrl?: string;
  diffUrl?: string;
  endDate?: string;
  startDate?: string;
}

export type OrgTypeName = "Open Source" | "Company" | "Publication" | "Website";

export interface OrgType extends IThemeable {
  id: OrgTypeName;
  name: OrgTypeName;
}

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

export interface IOrg {
  id: string;
  orgType: OrgTypeName;
  name: OrgName;
  url?: string;
  oldUrl?: string;
  repoUrl?: string;
  docsUrl?: string;
  apiUrl?: string;
  ciUrl?: string;
  coverageUrl?: string;
  changelogUrl?: string;
  leanpubUrl?: string;
  amazonUrl?: string;
  goodreadsUrl?: string;
  issuesUrl?: string;
  browseCodeTestsUrl?: string;
  browseCodeUrl?: string;
  logo?: string;
  languages: LanguageName[];
}

export interface IOrgs {
  [key: string]: IOrg;
}

export type ActivityTypeName =
  | "SoftwareApp"
  | "SoftwareLib"
  | "Patch"
  | "Work"
  | "Publication"
  | "Volunteer"
  | "Website"
  | "Article";

export interface ActivityType {
  id: ActivityTypeName;
  name: ActivityTypeName;
}

export interface IActivity {
  createdDate: string;
  title: string;
  componentName: ActivityTypeName;
  orgId: string;
  acceptedDate?: string;
  qaUrl?: string;
  diffUrl?: string;
  endDate?: string;
  startDate?: string;
}

export type OrgTypeName = "Open Source" | "Company" | "Publication" | "Website";

export interface OrgType {
  id: OrgTypeName;
  name: OrgTypeName;
}

export type LanguageName =
  | "Python"
  | "PHP"
  | "Makefile"
  | "Markdown"
  | "ShellScript"
  | "JavaScript"
  | "Vim script"
  | undefined
  | "Shell"
  | "Ruby"
  | "CSS"
  | "OCaml"
  | "SaltStack"
  | "Batchfile"
  | "C++"
  | "Go"
  | "C#"
  | "TeX"
  | "HTML"
  | "sed"
  | "C"
  | "CMake"
  | "TypeScript";

export interface Language {
  id: LanguageName;
  ui?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

export type OrgName = string;

export interface IOrg {
  id: number;
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

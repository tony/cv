export type CVActor = {
  id: Number;
  type: string;
  name: string;
  url: string;
  repo_url: string;
  docs_url: string;
  api_url: string;
  ci_url: string;
  coverage_url: string;
  changelog_url: string;
  issues_url: string;
  browser_code_tests_url: string;
  languages: ReadonlyArray<string>;
  logo: string;
};

export type CVActivity = {
  id: string;
  component_name: string;
  created_date: string;
  accepted_date?: string;
  title: string;
  actor: Number;
};

export type CVLanguage = {
  name: string;
  color: string;
  textColor: string;
};

export type CVActivityType = {
  name: string;
  singular_name: string;
  component_name: string;
};

export type CVState = {
  readonly actors: CVActor[];
  readonly activities: CVActivity[];
  readonly activityTypes: CVActivityType[];
  readonly languages: CVLanguage[];
};

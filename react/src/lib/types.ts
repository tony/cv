export type CVLanguage = {
  name: string;
  color: string;
  textColor: string;
};

export interface CVActorRaw {
  id: Number;
  type: string;
  name: string;
  url: string | null;
  repo_url?: string;
  docs_url?: string;
  api_url?: string;
  ci_url?: string;
  qa_url?: string;
  coverage_url?: string;
  changelog_url?: string;
  issues_url?: string;
  browser_code_tests_url?: string;
  old_url?: string;
  diff_url?: string;
  accepted_date?: string;
  created_date?: string;
  logo?: string;
  languages?: Array<string>;
  featured?: Array<{ [website: string]: string }>;
}

export type CVActor = CVActorRaw & {
  languages?: ReadonlyArray<CVLanguage>;
};

export type CVActivity = {
  id: string;
  component_name: string;
  created_date: string;
  accepted_date?: string;
  title: string;
  actor: Number;
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

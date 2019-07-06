export interface IActivity {
  created_date: string;
  title: string;
  actor: number;
  accepted_date?: string;
  qa_url?: string;
  diff_url?: string;
  end_date?: string;
  start_date?: string;
}

type ActorType = "Open Source" | "Company" | "Publication" | "Website";
type ActorLanguage = "JavaScript" | "Python" | "PHP";

export interface IActor {
  id: number;
  actorType: string;
  name: string;
  url: string;
  old_url?: string;
  repo_url?: string;
  docs_url?: string;
  api_url?: string;
  ci_url?: string;
  coverage_url?: string;
  changelog_url?: string;
  issues_url?: string;
  browse_code_tests_url?: string;
  browse_code_url?: string;
  logo?: string;
  languages: ActorLanguage[];
}

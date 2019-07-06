export interface IActivity {
  createdDate: string;
  title: string;
  actor: number;
  acceptedDate?: string;
  qaUrl?: string;
  diffUrl?: string;
  endDate?: string;
  startDate?: string;
}

type ActorType = "Open Source" | "Company" | "Publication" | "Website";
type ActorLanguage = "JavaScript" | "Python" | "PHP";

export interface IActor {
  id: number;
  actorType: string;
  name: string;
  url: string;
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
  languages: ActorLanguage[];
}

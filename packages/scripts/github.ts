import fs from "node:fs";

import moment from "moment";
import { Octokit } from "octokit";

interface PullRequestEdge {
  node: PullRequestNode;
}

interface PullRequestNode {
  mergedAt: string;
  createdAt: string;
  closedAt: string;
  title: string;
  url: string;
  merged: boolean;
  number: number;
  timelineItems: TimelineConnection;
  mergeCommit: Commit;
  repository: Repository;
}

interface TimelineConnection {
  edges: TimelineItemEdge[];
}

type TimelineItem = ClosedEvent | MergedEvent;

interface TimelineItemEdge {
  node: ClosedEvent | MergedEvent;
}

interface ClosedEvent {
  closedEventId: string;
  stateReason: string;
  createdAt: string;
}

interface MergedEvent {
  mergedEventId: string;
  createdAt: string;
  resourcePath: string;
  url: string;
  commit: Commit;
  mergeRef: MergeRef;
  mergeRefName: string;
}

interface Commit {
  oid: string;
  abbreviatedOid: string;
  messageHeadline: string;
  commitUrl: string;
  url: string;
  zipballUrl: string;
  treeUrl: string;
  additions: number;
  deletions: number;
}

interface MergeRef {
  name: string;
  prefix: string;
}

interface Repository {
  url: string;
  name: string;
  nameWithOwner: string;
  homepageUrl: string;
  isPrivate: boolean;
  languages: LanguageConnection;
}

interface RepositoryWithLanguagesStringified
  extends Omit<Repository, "languages"> {
  languages: string[];
}

interface LanguageNode {
  name: string;
}

interface LanguageEdge {
  node: LanguageNode;
}

interface LanguageConnection {
  edges: LanguageEdge[];
}

const ghToken: string | undefined =
  process.env.GITHUB_API_TOKEN || process.env.HOMEBREW_GITHUB_API_TOKEN;

if (!ghToken) {
  console.error(
    "GITHUB_API_TOKEN or HOMEBREW_GITHUB_API_TOKEN must be set in ENV",
  );
  process.exit(0);
}

const config: {
  exclude_own_repo: boolean;
  exclude_users: string[];
  gh_user: string;
  ignore_private_repos: boolean;
  output_dir: string;
} = {
  exclude_own_repo: true,
  exclude_users: [
    "cihai",
    "emre",
    "git-pull",
    "joseph-flinn",
    "nick-ma",
    "peergradeio",
    "eduflow",
    "Multiverse-io",
    "multiverse-io", // lowercase name, in case of case sensitivity
    "tmux-python",
    "vcs-python",
    "social-embed",
    "develtech",
    "isaul32",
  ],
  gh_user: "tony",
  ignore_private_repos: true,
  output_dir: "../data/scraped",
};

if (!fs.existsSync(config.output_dir)) {
  fs.mkdirSync(config.output_dir);
}

const octokit = new Octokit({ auth: ghToken });

const fetchGitHubIssues = async (): Promise<PullRequestEdge[]> => {
  let issues: PullRequestEdge[] = [];

  // on first invocation, add initial query
  const ghIterator = octokit.graphql.paginate.iterator(
    `
query fetchIssues($login: String!, $cursor: String) {
  user(login: $login) {
    pullRequests(first: 100, after: $cursor) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          mergedAt
          createdAt
          closedAt
          title
          url
          # files(first: 20) {
          #   edges {
          #     node {
          #       additions
          #       changeType
          #       deletions
          #       path
          #     }
          #   }
          # }
          mergeCommit {
            oid
            abbreviatedOid
            messageHeadline
            commitUrl
            url
            zipballUrl
            treeUrl
            additions
            deletions
          }
          merged
          number
          timelineItems(itemTypes: [MERGED_EVENT, CLOSED_EVENT], first: 20) {
            edges {
              node {
                ... on ClosedEvent {
                  closedEventId: id
                  stateReason
                  createdAt
                }
                ... on MergedEvent {
                  mergedEventId: id
                  createdAt
                  resourcePath
                  url
                  commit {
                    oid
                    abbreviatedOid
                    messageHeadline
                    commitUrl
                    url
                    zipballUrl
                    treeUrl
                    additions
                    deletions
                  }
                  mergeRef {
                    name
                    prefix
                  }
                  mergeRefName
                }
              }
            }
          }
          repository {
            url
            name
            nameWithOwner
            homepageUrl
            isPrivate
            languages(last: 1, orderBy: {direction: ASC, field: SIZE}) {
              edges {
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
}`,
    { login: config.gh_user },
  );

  for await (const res of ghIterator) {
    const data = {
      pullRequests: res.user.pullRequests.edges,
    };
    issues = issues.concat(data.pullRequests);
    console.log(
      `Fetching ${issues.length} / ${res.user.pullRequests.totalCount}`,
    );
  }

  return issues;
};

fetchGitHubIssues()
  .then((rawPrs: PullRequestEdge[]) => {
    let prs: PullRequestEdge[] = rawPrs;
    if (config.exclude_own_repo) {
      prs = prs.filter(
        (pr: PullRequestEdge) =>
          !pr.node.url.includes(`https://github.com/${config.gh_user}/`),
      );
    }
    if (config.exclude_users) {
      for (const user of config.exclude_users) {
        prs = prs.filter(
          (pr) => !pr.node.url.includes(`https://github.com/${user}/`),
        );
      }
    }

    if (config.ignore_private_repos) {
      prs = prs.filter((pr) => !pr.node.repository.isPrivate);
    }

    const prNodes: PullRequestNode[] = prs.map((pr) => pr.node); // zoom in on "node"

    let projects: RepositoryWithLanguagesStringified[] = prNodes.map(
      ({ repository }: { repository: Repository }) => {
        return {
          ...repository,
          languages: repository.languages.edges.length
            ? [repository.languages.edges[0].node.name]
            : undefined,
        };
      },
    );

    // Filter uniques
    projects = projects.filter(
      (project, index, self) =>
        self.findIndex((p) => p.name === project.name) === index,
    );
    /**
     * Manually add languages GitHub projects missing them
     */
    const fillMissingLanguages = (projectName: string) => {
      switch (projectName) {
        case "kohana-modules":
          return ["PHP"];
        case "awesome-minimalist":
          return ["Markdown"];
        default:
          return [];
      }
    };

    let id = 0;
    const projectsFinal = projects.reduce((acc, p) => {
      acc[p.name] = {
        orgType: "Open Source",
        id: `${id++}`,
        // missing language in kohana-modules
        languages: p.languages || fillMissingLanguages(p.name),
        name: p.name,
        repoUrl: p.url,
        ...(p.homepageUrl ? { url: p.homepageUrl } : {}),
      };
      return acc;
    }, {});

    let data = JSON.stringify(projectsFinal, null, "  ");
    fs.writeFileSync(`${config.output_dir}/gh_orgs.json`, data);

    // We do this at the bottom because we want to associate the
    // project_final 'id' attribute with project in pr's
    id = 0;
    const pullRequestsFinal = prNodes.map((pr) => {
      return {
        // todo: Transition from acceptedAt to mergedAt?
        acceptedAt: pr.mergedAt
          ? moment(pr.mergedAt).format("YYYY-MM-DD")
          : null,
        closedAt: pr.closedAt ? moment(pr.closedAt).format("YYYY-MM-DD") : null,
        org: Object.keys(projectsFinal).find(
          (projectName) => pr.repository.name === projectName,
        ),
        category: "Patch",
        createdAt: moment(pr.createdAt).format("YYYY-MM-DD"),
        diffUrl: `${pr.url}.diff`,
        id: `${id++}`,
        qaUrl: pr.url,
        title: pr.title,
        merged: pr.merged,
        url: pr.url,
        number: pr.number,
        mergeCommit: pr.mergeCommit,
        timelineItems: pr.timelineItems.edges.map((edge) => edge.node),
      };
    });
    data = JSON.stringify(pullRequestsFinal, null, "  ");
    fs.writeFileSync(`${config.output_dir}/gh_activities.json`, data);
  })
  .catch((err) => console.error(err));

import { Octokit } from "@octokit/core";
import { paginateGraphql } from "@octokit/plugin-paginate-graphql";
import fs from "fs";
import moment from "moment";

const ghToken =
  process.env.GITHUB_API_TOKEN || process.env.HOMEBREW_GITHUB_API_TOKEN;

if (!ghToken) {
  console.error(
    "GITHUB_API_TOKEN or HOMEBREW_GITHUB_API_TOKEN must be set in ENV"
  );
  process.exit(0);
}

const config = {
  exclude_own_repo: true,
  exclude_users: [
    "cihai",
    "emre",
    "git-pull",
    "joseph-flinn",
    "nick-ma",
    "peergradeio",
    "eduflow",
    "tmux-python",
    "vcs-python",
    "social-embed",
    "develtech",
  ],
  gh_user: "tony",
  ignore_private_repos: true,
  output_dir: "../data/scraped",
};

if (!fs.existsSync(config.output_dir)) {
  fs.mkdirSync(config.output_dir);
}

const MyOctokit = Octokit.plugin(paginateGraphql);
const octokit = new MyOctokit({ auth: ghToken });

let issues = [];

const fetchGitHubIssues = async () => {
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
    { login: config.gh_user }
  );

  for await (const res of ghIterator) {
    const data = {
      ...{ pullRequests: res.user.pullRequests.edges },
    };
    issues = issues.concat(data.pullRequests);
    console.log(
      `Fetching ${issues.length} / ${res.user.pullRequests.totalCount}`
    );
  }

  return issues;
};

fetchGitHubIssues()
  .then((prs) => {
    if (config.exclude_own_repo) {
      prs = prs.filter(
        (pr) => !pr.node.url.includes(`https://github.com/${config.gh_user}/`)
      );
    }
    if (config.exclude_users) {
      for (const user of config.exclude_users) {
        prs = prs.filter(
          (pr) => !pr.node.url.includes(`https://github.com/${user}/`)
        );
      }
    }

    if (config.ignore_private_repos) {
      prs = prs.filter((pr) => !pr.node.repository.isPrivate);
    }

    prs = prs.map((pr) => pr.node); // zoom in on "node"

    let projects = prs.map((pr) => pr.repository);

    // join languages
    projects = projects.map((p) => {
      p.languages = p.languages.edges.length
        ? [p.languages.edges[0].node.name]
        : undefined;
      return p;
    });

    // Filter uniques
    projects = projects.filter(
      (project, index, self) =>
        self.findIndex((p) => p.name === project.name) === index
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
    const projectsFinal = projects.reduce(
      (acc, p) => ({
        ...acc,
        [p.name]: {
          orgType: "Open Source",
          id: `${id++}`,
          // missing language in kohana-modules
          languages: p.languages || fillMissingLanguages(p.name),
          name: p.name,
          repoUrl: p.url,
          ...(p.homepageUrl ? { url: p.homepageUrl } : {}),
        },
      }),
      {}
    );

    let data = JSON.stringify(projectsFinal, null, "  ");
    fs.writeFileSync(`${config.output_dir}/gh_orgs.json`, data);

    // We do this at the bottom because we want to associate the
    // project_final 'id' attribute with project in pr's
    id = 0;
    const pullRequestsFinal = prs.map((pr) => {
      return {
        acceptedAt: pr.mergedAt
          ? moment(pr.mergedAt).format("YYYY-MM-DD")
          : null,
        org: Object.keys(projectsFinal).find(
          (projectName) => pr.repository.name === projectName
        ),
        activityType: "Patch",
        createdAt: moment(pr.createdAt).format("YYYY-MM-DD"),
        diffUrl: pr.url + ".diff",
        id: `${id++}`,
        qaUrl: pr.url,
        title: pr.title,
      };
    });
    data = JSON.stringify(pullRequestsFinal, null, "  ");
    fs.writeFileSync(`${config.output_dir}/gh_activities.json`, data);
  })
  .catch((err) => console.error(err));

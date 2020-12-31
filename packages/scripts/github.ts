import fs from "fs";
import path from "path";

import { GitHub } from "github-graphql-api";
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
    "tmux-python",
    "vcs-python",
  ],
  gh_user: "tony",
  ignore_private_repos: true,
  output_dir: "../data/scraped",
};

if (!fs.existsSync(config.output_dir)) {
  fs.mkdirSync(config.output_dir);
}

// const testQuery = `
//   query {
//     viewer {
//       login
//     }
//   }
// `;

// note, this requires .replace of:
// 1. {{user_params}} -> 'login: "yourusername"'
// 2. {{pull_requests_params}} -> 'first 100'
const prQuery = fs.readFileSync(
  path.join(__dirname, "./gh_pullrequests.graphql"),
  "utf8"
);

const c = new GitHub({ token: ghToken });

async function ghQuery(query) {
  return c.query(query);
}

// ghQuery(testQuery).then(data => {
//   console.log(data);
// });

const userPrQuery = prQuery.replace(
  "{{user_params}}",
  `login: "${config.gh_user}"`
);
const initialPrQuery = userPrQuery.replace(
  "{{pull_requests_params}}",
  "first: 100"
);

const makePRQuery = async (query) => {
  // wraps ghQuery
  const res = await ghQuery(query);
  const data = {
    // create a compact response (non-standard)
    ...{ pullRequests: res.user.pullRequests.edges },
    ...res.user.pullRequests.pageInfo,
  };
  if (data.hasNextPage) {
    data.nextQuery = userPrQuery.replace(
      "{{pull_requests_params}}",
      `first: 100, after: "${data.endCursor}"`
    );
  }
  return data;
};

let issues = [];

const recursePRQuery = async (query) => {
  // on first invocation, add initial query
  const res = await makePRQuery(query);

  issues = issues.concat(res.pullRequests);
  if (res.nextQuery) {
    return recursePRQuery(res.nextQuery);
  } else {
    return issues;
  }
};

recursePRQuery(initialPrQuery)
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
    // console.log(projects);
    // console.log(projects.length);

    // only have unique stuff
    // projects = [ ... new Set(projects) ];
    projects = projects.filter(
      (project, index, self) =>
        self.findIndex((p) => p.name === project.name) === index
    );
    // console.log(projects);
    // console.log(projects.length);
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
          id: id++,
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

    // we do this at the bottom because we want to associate the
    // project_final 'id' attribute with project in pr's

    id = 0;
    const pullRequestsFinal = prs.map((pr) => {
      return {
        acceptedDate: pr.mergedAt
          ? moment(pr.mergedAt).format("YYYY-MM-DD")
          : null,
        orgId: Object.keys(projectsFinal).find(
          (projectName) => pr.repository.name === projectName
        ),
        activityType: "Patch",
        createdDate: moment(pr.createdAt).format("YYYY-MM-DD"),
        diffUrl: pr.url + ".diff",
        id: id++,
        qaUrl: pr.url,
        title: pr.title,
      };
    });
    data = JSON.stringify(pullRequestsFinal, null, "  ");
    fs.writeFileSync(`${config.output_dir}/gh_activities.json`, data);
  })
  .catch((err) => console.error(err));

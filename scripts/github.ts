import fs from "fs";
import path from "path";
import { GitHub } from "github-graphql-api";
import util from "util";
import moment from "moment";

const gh_token =
  process.env.GITHUB_API_TOKEN || process.env.HOMEBREW_GITHUB_API_TOKEN;

if (!gh_token) {
  console.error(
    "GITHUB_API_TOKEN or HOMEBREW_GITHUB_API_TOKEN must be set in ENV"
  );
  process.exit(0);
}

const config = {
  exclude_own_repo: true,
  gh_user: "tony",
  exclude_users: [
    "cihai",
    "git-pull",
    "vcs-python",
    "tmux-python",
    "nick-ma",
    "emre",
    "peergradeio"
  ],
  output_dir: "data/scraped",
  ignore_private_repos: true
};

if (!fs.existsSync(config.output_dir)) {
  fs.mkdirSync(config.output_dir);
}

const testQuery = `
  query {
    viewer {
      login
    }
  }
`;

// note, this requires .replace of:
// 1. {{user_params}} -> 'login: "yourusername"'
// 2. {{pull_requests_params}} -> 'first 100'
const prQuery = fs.readFileSync(
  path.join(__dirname, "./gh_pullrequests.graphql"),
  "utf8"
);

const c = new GitHub({ token: gh_token });

async function ghQuery(query) {
  return await c.query(query);
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

const makePRQuery = async query => {
  // wraps ghQuery
  const res = await ghQuery(query);
  const data = {
    // create a compact response (non-standard)
    ...{ pullRequests: res.user.pullRequests.edges },
    ...res.user.pullRequests.pageInfo
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

const recursePRQuery = async query => {
  // on first invocation, add initial query
  const res = await makePRQuery(query);

  issues = issues.concat(res.pullRequests);
  if (res.nextQuery) {
    return await recursePRQuery(res.nextQuery);
  } else {
    return issues;
  }
};

recursePRQuery(initialPrQuery)
  .then(prs => {
    if (config.exclude_own_repo) {
      prs = prs.filter(
        pr => !pr.node.url.includes(`https://github.com/${config.gh_user}/`)
      );
    }
    if (config.exclude_users) {
      for (let user of config.exclude_users) {
        prs = prs.filter(
          pr => !pr.node.url.includes(`https://github.com/${user}/`)
        );
      }
    }

    if (config.ignore_private_repos) {
      prs = prs.filter(pr => !pr.node.repository.isPrivate);
    }

    prs = prs.map(pr => pr.node); // zoom in on "node"

    let projects = prs.map(pr => pr.repository);

    // join languages
    projects = projects.map(p => {
      if (p.languages.edges.length) {
        p.languages = [p.languages.edges[0].node.name];
      } else {
        p.languages = undefined;
      }
      return p;
    });
    // console.log(projects);
    // console.log(projects.length);

    // only have unique stuff
    // projects = [ ... new Set(projects) ];
    projects = projects.filter(
      (project, index, self) =>
        self.findIndex(p => p.name === project.name) === index
    );
    // console.log(projects);
    // console.log(projects.length);

    let id = 0;
    const projectsFinal = projects.map(p => {
      return {
        actorType: "Open Source",
        id: id++,
        languages: p.languages,
        name: p.name,
        repo_url: p.url,
        url: p.homepageUrl
      };
    });

    let data = JSON.stringify(projectsFinal, null, "  ");
    fs.writeFileSync(`${config.output_dir}/gh_actors.json`, data);

    // we do this at the bottom because we want to associate the
    // project_final 'id' attribute with project in pr's

    id = 0;
    const pullRequestsFinal = prs.map(pr => {
      return {
        accepted_date: pr.mergedAt
          ? moment(pr.mergedAt).format("YYYY-MM-DD")
          : null,
        actor: projectsFinal.find(p => pr.repository.name === p.name).id,
        component_name: "Patch",
        created_date: moment(pr.createdAt).format("YYYY-MM-DD"),
        diff_url: pr.url + ".diff",
        id: id++,
        qa_url: pr.url,
        title: pr.title
      };
    });
    data = JSON.stringify(pullRequestsFinal, null, "  ");
    fs.writeFileSync(`${config.output_dir}/gh_activities.json`, data);
  })
  .catch(err => console.error(err));

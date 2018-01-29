const fs = require('fs');
var client = require('github-graphql-client');
const util = require('util');
const c = util.promisify(client);

const gh_token = process.env.GITHUB_API_TOKEN || process.env.HOMEBREW_GITHUB_API_TOKEN;

if (!gh_token) {
  console.error(
    'GITHUB_API_TOKEN or HOMEBREW_GITHUB_API_TOKEN must be set in ENV'
  );
  process.exit(0);
}

const config = {
  exclude_own_repo: true,
  gh_user: 'tony',
  exclude_users: ['nick-ma'],
}


const testQuery = `
  query {
    viewer {
      login
    }
  }
`

// note, this requires .replace of:
// 1. {{user_params}} -> 'login: "yourusername"'
// 2. {{pull_requests_params}} -> 'first 100'
const prQuery = fs.readFileSync('./notes/gh_pullrequests.graphql', 'utf8');

async function ghQuery(query) {
  const q = await c({
    token: gh_token,
    query: query
  });
  return q;
}

// ghQuery(testQuery).then(data => {
//   console.log(data);
// });

const userPrQuery = prQuery.replace('{{user_params}}', `login: "${config.gh_user}"`)
const initialPrQuery = userPrQuery.replace(
  '{{pull_requests_params}}', 'first: 100'
);

const makePRQuery = async (query) => {  // wraps ghQuery
  const res = await ghQuery(query);
  const data = {  // create a compact response (non-standard)
    ...{ pullRequests: res.data.user.pullRequests.edges },
    ...res.data.user.pullRequests.pageInfo,
  };
  if (data.hasNextPage) {
    data.nextQuery = userPrQuery.replace(
      '{{pull_requests_params}}', `first: 100, after: "${data.endCursor}"`
    );
  }
  return data;
}

let issues = [];

const recursePRQuery = async (query) => {  // on first invocation, add initial query
  const res = await makePRQuery(query);

  issues = issues.concat(res.pullRequests);
  if (res.nextQuery) {
    return await recursePRQuery(res.nextQuery);
  } else {
    return issues;
  }
}


recursePRQuery(initialPrQuery).then(prs => {
  if (config.exclude_own_repo) {
    prs = prs.filter(pr => !pr.node.url.includes(`https://github.com/${config.gh_user}/`));
  }
  if (config.exclude_users) {
    for (let user of config.exclude_users) {
      prs = prs.filter(pr => !pr.node.url.includes(`https://github.com/${user}/`));
    }
  }

  const filtered = prs.map(pr => pr.node);  // zoom in on "node"

  console.log(filtered);
  let id = 0;
  const final = filtered.map(pr => {
    return {
      id: id++,
      component: 'Patch',
      qa_url: pr.url,
      diff_url: pr.url + '.diff',
      proposed_date: pr.createdAt,
      accepted_date: pr.mergedAt,
      title: pr.title,
    }
  });
  let data = JSON.stringify(final, null, '  ');
  fs.writeFileSync('src/data/gh_patches.json', data);
}).catch(err => console.error(err));

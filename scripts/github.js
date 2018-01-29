const octokit = require('@octokit/rest')()


const gh_token = process.env.GITHUB_API_TOKEN || process.env.HOMEBREW_GITHUB_API_TOKEN;

if (!gh_token) {
  console.error(
    'GITHUB_API_TOKEN or HOMEBREW_GITHUB_API_TOKEN must be set in ENV'
  );
  process.exit(0);
}

octokit.authenticate({
    type: 'token',
    token: gh_token,
})


function filterPullRequests(data) {
  /** Filter pull requests from octokit.issues.getAll **/
  let issues = [];
  for (d of data) {
    if (d.pull_request) {
      issues = issues.concat(d);
    }
  }
  return issues;
}

const grabPullRequests = async () => {
  let response = await octokit.issues.getAll({per_page: 100, state: 'closed', filter: 'all'});
  let {data} = response;

  while (octokit.hasNextPage(response)) {
    console.log('wat');
    response = await octokit.getNextPage(response);
    data = data.concat(response.data);
  }

  console.log(data.length);
  let issues = filterPullRequests(data);
  console.log(issues.length);

  return issues;
}

// grabPullRequests().then(data => {
//   //console.log(data);
//   console.log(data.length);
// }).catch(err => {
//   //console.log(err);
// });

// async function paginate (method) {
//   let response = await method({per_page: 100, state: 'closed', filter: 'all'});
//   let {data} = response;
//   while (octokit.hasNextPage(response)) {
//     response = await octokit.getNextPage(response);
//     data = data.concat(response.data);
//   }
//   return data;
// }
//
// paginate(octokit.issues.getAll).then(data => {
//   console.log(data.length);
// }).catch(err => {
//   console.error(err);
// });


var client = require('github-graphql-client');

const makeQuery = (query) => {
  var request = client({
    token: gh_token,
    query: query
  }, function (err, res) {
    if (err) {
      console.error(err);
      // handle errors
    } else {
      console.log(res);
      if (res.data && res.data.user && res.data.user.pullRequests) {
        console.log(res.data.user.pullRequests);
      }
      // handle results
    }
  });
};

const basicQuery = `
  query {
    viewer {
      login
    }
  }
`

// makeQuery(basicQuery);

const fs = require('fs');
const prQuery = fs.readFileSync('./notes/gh_pullrequests.graphql', 'utf8');
console.log(prQuery);
// makeQuery(prQuery);



const util = require('util');
const c = util.promisify(client);

async function makeQuery2(query) {
  const q = await c({
    token: gh_token,
    query: query
  });
  return q;
}
// makeQuery2(basicQuery).then(data => {
//   console.log(data);
// });

const userPrQuery = prQuery.replace('{{user_params}}', 'login: "tony"')
const initialPrQuery = userPrQuery.replace(
  '{{pull_requests_params}}', 'first: 100'
);

let issues = [];

// function recurseQuery(res) {
//   let edges = res.data.user.pullRequests.edges;
//   let endCursor = res.data.user.pullRequests.pageInfo.endCursor
//   let hasNextPage = res.data.user.pullRequests.pageInfo.hasNextPage
//
//   issues = issues.concat(edges);
//   if (hasNextPage) {
//     let curQuery = userPrQuery.replace(
//       '{{pull_requests_params}}', `first: 100, after: "${endCursor}"`
//     );
//     console.log(curQuery);
//     makeQuery2(curQuery).then(recurseQuery).catch(err => console.error(err));
//     // makeQuery2(curQuery).then(recurseQuery).catch(err => console.error(err));
//   }
// }
//
// makeQuery2(initialPrQuery).then(recurseQuery).catch(err => {
//   console.error(err);
// });
//
// console.log(issues.length);
// console.log(issues);
// tutorial: http://blog.scottlogic.com/2017/09/14/asynchronous-recursion.html

const makePRQuery = async (query) => {  // wraps makeQuery2
  const res = await makeQuery2(query);
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
  prs = prs.filter(pr => !pr.node.url.includes('https://github.com/tony/'));
  const filtered = prs.map((pr) => {
    return pr;
  });
  console.log(filtered);
}).catch(err => console.error(err));

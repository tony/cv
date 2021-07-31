import React from 'react';
import Octicon from 'react-octicon';
import Moment from 'react-moment';

export const LeftBox = (props) => {
  return (
    <div className="box">
      <h2>{props.activityType}</h2>
      <p className="align-octicon">
        <small>
          <Octicon name="clock" />
          <span>
            {' '}
            <Moment fromNow>{props.created_date}</Moment>{' '}
          </span>
          ({props.created_date})
        </small>
      </p>
      {props.actor.languages
        ? props.actor.languages.map((language, i) => (
            <span
              className="tag language-tag"
              key={i}
              style={
                language.color
                  ? {
                      backgroundColor: language.color,
                      color: language.textColor,
                    }
                  : {}
              }
            >
              {language.name}
            </span>
          ))
        : null}
    </div>
  );
};

export const RightBox = (props) => (
  <div className="box">
    {props.actor.logo && props.actor.logo.length > 0 && (
      <a
        href={props.actor.url}
        target="_blank"
        className="align-octicon"
        rel="noopener noreferrer"
      >
        <img
          src={props.actor.logo}
          className="logo"
          style={{ maxWidth: 400 }}
          alt={props.actor.name}
        />
      </a>
    )}

    <h3>
      <a
        href={props.qa_url}
        target="_blank"
        rel="noopener noreferrer"
        className="activity-title"
      >
        {props.title}
      </a>
    </h3>
  </div>
);

export const PatchRightBox = (props) => {
  return (
    <div className="box">
      <h3 className="align-octicon-bottom">
        <a
          href={props.qa_url}
          target="_blank"
          rel="noopener noreferrer"
          className="activity-title"
        >
          <Octicon name="mark-github" label="View on GitHub"></Octicon>{' '}
          {props.title}
        </a>
      </h3>
      <p>
        <em>
          was contributed to the{' '}
          <a
            href={props.actor.url}
            rel="noopener noreferrer"
            target="_blank"
            className="muted-link"
          >
            {props.actor.name}
          </a>{' '}
          project
        </em>
      </p>

      <p>
        <small>
          <a
            href={props.actor.repo_url}
            rel="noopener noreferrer"
            target="_blank"
            className="muted-link align-octicon"
          >
            <Octicon name="repo" label="GH"></Octicon>
            Repository{' '}
          </a>

          {props.in_re_url && props.in_re_url.length > 0 && (
            <span>
              <a
                href={props.in_re_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                issue
              </a>
            </span>
          )}

          <span>
            <a
              href={props.qa_url}
              rel="noopener noreferrer"
              target="_blank"
              className="muted-link align-octicon"
            >
              <Octicon name="git-pull-request" label="Pull Request"></Octicon>
              Pull Request
            </a>
          </span>

          <span>
            {' '}
            <a
              href={props.diff_url}
              rel="noopener noreferrer"
              target="_blank"
              className="muted-link align-octicon"
            >
              <Octicon name="diff" label="Diff"></Octicon>
              .diff File
            </a>
          </span>
        </small>
      </p>

      <p>
        <small>
          {props.accepted_date ? (
            <span className="align-octicon">
              <Octicon name="check" label="Merged"></Octicon>
              Accepted {props.accepted_date}
            </span>
          ) : (
            <em>Unmerged</em>
          )}
        </small>
      </p>
    </div>
  );
};

export const PublicationRightBox = (props) => {
  return (
    <div className="box">
      <h3 className="align-octicon-bottom">
        <a
          href={props.actor.url}
          rel="noopener noreferrer"
          target="_blank"
          className="activity-title"
        >
          {props.title}
        </a>
      </h3>

      <p>
        <small>
          Seen on{' '}
          {props.actor.leanpub_url && props.actor.leanpub_url.length > 0 && (
            <span>
              <a
                href={props.actor.leanpub_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                Leanpub
              </a>
            </span>
          )}{' '}
          {props.actor.amazon_url && props.actor.amazon_url.length > 0 && (
            <span>
              <a
                href={props.actor.amazon_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                Amazon
              </a>
            </span>
          )}{' '}
          {props.actor.goodreads_url && props.actor.goodreads_url.length > 0 && (
            <span>
              <a
                href={props.actor.goodreads_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                Goodreads
              </a>
            </span>
          )}
        </small>
      </p>
    </div>
  );
};

export const ArticleRightBox = (props) => {
  return (
    <div className="box">
      <h3 className="align-octicon-bottom">
        <a
          href={props.actor.url}
          rel="noopener noreferrer"
          target="_blank"
          className="activity-title"
        >
          {props.title}
        </a>
      </h3>

      <p>
        <small>
          Discussed on{' '}
          {props.featured
            ? Object.keys(props.featured).map((title) => (
                <span key={title}>
                  <a
                    href={props.featured[title]}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {title}
                  </a>{' '}
                </span>
              ))
            : null}
        </small>
      </p>
    </div>
  );
};

export const SoftwareRightBox = (props) => {
  return (
    <div className="box">
      {props.actor.logo && props.actor.logo.length > 0 && (
        <a
          href={props.actor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="align-octicon"
        >
          <img
            src={props.actor.logo}
            className="logo"
            style={{ maxWidth: 200 }}
            alt={props.actor.name}
          />
        </a>
      )}
      <h3 className="align-octicon-bottom">
        <a
          href={props.actor.url}
          rel="noopener noreferrer"
          target="_blank"
          className="activity-title"
        >
          {props.title}
        </a>
      </h3>

      <small className="bottompad10">
        <div className="software-project-links">
          {props.actor.url && props.actor.url.length > 0 && (
            <a
              href={props.actor.url}
              rel="noopener noreferrer"
              target="_blank"
              className="align-octicon"
            >
              <Octicon name="home" label="Website"></Octicon> Website
            </a>
          )}
          {props.actor.repo_url && props.actor.repo_url.length > 0 && (
            <a
              href={props.actor.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="align-octicon"
            >
              {' '}
              <Octicon name="mark-github" label="Repo"></Octicon> GitHub
            </a>
          )}
          {props.actor.docs_url && props.actor.docs_url.length > 0 && (
            <a
              href={props.actor.docs_url}
              target="_blank"
              className="align-octicon"
              rel="noopener noreferrer"
            >
              {' '}
              <Octicon name="book" label="Docs"></Octicon> Docs
            </a>
          )}
          {props.actor.api_url && props.actor.api_url.length > 0 && (
            <a
              href={props.actor.api_url}
              target="_blank"
              rel="noopener noreferrer"
              className="align-octicon"
            >
              {' '}
              <Octicon name="search" label="API"></Octicon> API
            </a>
          )}
          {props.actor.coverage_url && props.actor.coverage_url.length > 0 && (
            <a
              href={props.actor.coverage_url}
              target="_blank"
              rel="noopener noreferrer"
              className="align-octicon"
            >
              {' '}
              <Octicon name="graph" label="Coverage"></Octicon> Coverage
            </a>
          )}
          {props.actor.ci_url && props.actor.ci_url.length > 0 && (
            <a
              href={props.actor.ci_url}
              target="_blank"
              rel="noopener noreferrer"
              className="align-octicon"
            >
              {' '}
              <Octicon name="dashboard" label="CI"></Octicon> CI
            </a>
          )}
          {props.actor.browse_code_url &&
            props.actor.browse_code_url.length > 0 && (
              <a
                href={props.actor.browse_code_url}
                target="_blank"
                rel="noopener noreferrer"
                className="align-octicon"
              >
                {' '}
                <Octicon name="code" label="CI"></Octicon> Browse Code
              </a>
            )}
          {props.actor.browse_code_tests_url &&
            props.actor.browse_code_tests_url.length > 0 && (
              <a
                href={props.actor.browse_code_tests_url}
                target="_blank"
                rel="noopener noreferrer"
                className="align-octicon"
              >
                {' '}
                (tests)
              </a>
            )}
          {props.actor.issues_url && props.actor.issues_url.length > 0 && (
            <a
              href={props.actor.issues_url}
              target="_blank"
              rel="noopener noreferrer"
              className="align-octicon"
            >
              {' '}
              <Octicon name="comment-discussion" label="CI"></Octicon> Issues
            </a>
          )}
          {props.actor.changelog_url && props.actor.changelog_url.length > 0 && (
            <a
              href={props.actor.changelog_url}
              target="_blank"
              rel="noopener noreferrer"
              className="align-octicon"
            >
              {' '}
              <Octicon name="list-unordered" label="Changelog"></Octicon>{' '}
              Changelog
            </a>
          )}
        </div>
      </small>
    </div>
  );
};

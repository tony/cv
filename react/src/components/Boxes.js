import React from 'react';
import Octicon from 'react-octicon';
import Moment from 'react-moment';


export class LeftBox extends React.Component {
  render() {
    return (
      <div className="box">
        <h2>{this.props.activityType}</h2>
        <p className="align-octicon">
          <small>
            <Octicon name="clock"/>
            <span> <Moment fromNow>{this.props.created_date}</Moment> </span>
           ({this.props.created_date})
        </small>
        </p>
        {this.props.actor.languages ? (
          this.props.actor.languages.map((language, i) =>
            <span
              className="tag language-tag"
              key={i}
              style={ language.color ? {
                backgroundColor: language.color,
                color: language.textColor
              }: {}}
            >{language.name}</span>
          )
        ) : null }
      </div>
    )
  }
}

export class RightBox extends React.Component {
  render() {
    return (
      <div className="box">
        { this.props.actor.logo && this.props.actor.logo.length > 0 &&
            <a href={this.props.actor.url}
              target="_blank"
              className="align-octicon"
            >
              <img
                src={this.props.actor.logo}
                className="logo"
                style={{ maxWidth: 400 }}
                alt={this.props.actor.name}
              />
            </a>
        }

        <h3><a href={this.props.qa_url} target="_blank" className="activity-title">{this.props.title}</a></h3>
      </div>
    )
  }
}


export class PatchRightBox extends RightBox {
  render() {
    return (
      <div className="box">
        <h3 className="align-octicon-bottom"><a href={this.props.qa_url} target="_blank" className="activity-title">
          <Octicon name="mark-github" label="View on GitHub"></Octicon> {this.props.title}
        </a></h3>
        <p>
          <em>was contributed to the <a href={this.props.actor.url} target="_blank" className='muted-link'>{this.props.actor.name}</a> project</em>
        </p>

        <p><small>
          <a href={this.props.actor.repo_url} target="_blank" className="muted-link align-octicon">
            <Octicon name="repo" label="GH"></Octicon>
            Repository </a>

          { this.props.in_re_url && this.props.in_re_url.length > 0 &&
              <span>
                <a href={this.props.in_re_url} target="_blank">issue</a>
              </span>
          }

          <span>
            <a href={this.props.qa_url} target="_blank" className="muted-link align-octicon">
              <Octicon name="git-pull-request" label="Pull Request"></Octicon>
              Pull Request
            </a>
          </span>

          <span> <a href={this.props.diff_url} target="_blank" className="muted-link align-octicon">
            <Octicon name="diff" label="Diff"></Octicon>
            .diff File
          </a></span>
        </small></p>

        <p><small>
          { this.props.accepted_date ? (
              <span className="align-octicon">
              <Octicon name="check" label="Merged"></Octicon>
              Accepted {this.props.accepted_date}
              </span>
            ) : (
              <em>Unmerged</em>
            )
          }
        </small></p>
      </div>
    )
  }
}


export class PublicationRightBox extends RightBox {
  render() {
    return (
      <div className="box">
        <h3 className="align-octicon-bottom"><a href={this.props.actor.url} target="_blank" className="activity-title">
          {this.props.title}
      </a></h3>

        <p><small>
          Seen on
          {' '}
          { this.props.actor.leanpub_url && this.props.actor.leanpub_url.length > 0 &&
              <span>
                <a href={this.props.actor.leanpub_url} target="_blank">Leanpub</a>
              </span>
          }
          {' '}
          { this.props.actor.amazon_url && this.props.actor.amazon_url.length > 0 &&
              <span>
                <a href={this.props.actor.amazon_url} target="_blank">Amazon</a>
              </span>
          }
          {' '}
          { this.props.actor.goodreads_url && this.props.actor.goodreads_url.length > 0 &&
              <span>
                <a href={this.props.actor.goodreads_url} target="_blank">Goodreads</a>
              </span>
          }

        </small></p>
      </div>
    )
  }
}


export class ArticleRightBox extends RightBox {
  render() {
    return (
      <div className="box">
        <h3 className="align-octicon-bottom"><a href={this.props.actor.url} target="_blank" className="activity-title">
          {this.props.title}
      </a></h3>

        <p><small>
          Discussed on
          {' '}
          {this.props.featured ? (
            Object.keys(this.props.featured).map((title) =>
              <span key={title}><a href={this.props.featured[title]}
                target="_blank"
              >{title}</a>{' '}</span>
            )
          ) : null }
        </small></p>
      </div>
    )
  }
}


export class SoftwareRightBox extends RightBox {
  render() {
    return (
      <div className="box">
        { this.props.actor.logo && this.props.actor.logo.length > 0 &&
            <a href={this.props.actor.url}
              target="_blank"
              className="align-octicon"
            >
              <img
                src={this.props.actor.logo}
                className="logo"
                style={{ maxWidth: 200 }}
                alt={this.props.actor.name}
              />
            </a>
        }
        <h3 className="align-octicon-bottom"><a href={this.props.actor.url} target="_blank" className="activity-title">
          {this.props.title}
        </a></h3>

        <small className="bottompad10"><div className="software-project-links">
          { this.props.actor.url && this.props.actor.url.length > 0 &&
          <a href={this.props.actor.url}
            target="_blank" className="align-octicon">
            <Octicon name="home" label="Website"></Octicon>
            {' '}
            Website
          </a>
          }
          { this.props.actor.repo_url && this.props.actor.repo_url.length > 0 &&
          <a href={this.props.actor.repo_url}
            target="_blank" className="align-octicon">
            {' '}
            <Octicon name="mark-github" label="Repo"></Octicon>
            {' '}
            GitHub
          </a>
          }
          { this.props.actor.docs_url && this.props.actor.docs_url.length > 0 &&
            <a href={this.props.actor.docs_url}
              target="_blank" className="align-octicon">
            {' '}
            <Octicon name="book" label="Docs"></Octicon>
            {' '}
            Docs
          </a>
          }
          { this.props.actor.api_url && this.props.actor.api_url.length > 0 &&
          <a href={this.props.actor.api_url}
            target="_blank" className="align-octicon">
            {' '}
            <Octicon name="search" label="API"></Octicon>
            {' '}
            API
          </a>
          }
          { this.props.actor.coverage_url && this.props.actor.coverage_url.length > 0 &&
          <a href={this.props.actor.coverage_url}
            target="_blank" className="align-octicon">
            {' '}
            <Octicon name="graph" label="Coverage"></Octicon>
            {' '}
            Coverage
          </a>
          }
          { this.props.actor.ci_url && this.props.actor.ci_url.length > 0 &&
          <a href={this.props.actor.ci_url}
            target="_blank" className="align-octicon">
            {' '}
            <Octicon name="dashboard" label="CI"></Octicon>
            {' '}
            CI
          </a>
          }
          { this.props.actor.browse_code_url && this.props.actor.browse_code_url.length > 0 &&
          <a href={this.props.actor.browse_code_url}
            target="_blank" className="align-octicon">
            {' '}
            <Octicon name="code" label="CI"></Octicon>
            {' '}
            Browse Code
          </a>
          }
          { this.props.actor.browse_code_tests_url && this.props.actor.browse_code_tests_url.length > 0 &&
          <a href={this.props.actor.browse_code_tests_url}
            target="_blank" className="align-octicon">
            {' '}
            (tests)
          </a>
          }
          { this.props.actor.issues_url && this.props.actor.issues_url.length > 0 &&
          <a href={this.props.actor.issues_url}
            target="_blank" className="align-octicon">
            {' '}
            <Octicon name="comment-discussion" label="CI"></Octicon>
            {' '}
            Issues
          </a>
          }
          { this.props.actor.changelog_url && this.props.actor.changelog_url.length > 0 &&
          <a href={this.props.actor.changelog_url}
            target="_blank" className="align-octicon">
            {' '}
            <Octicon name="list-unordered" label="Changelog"></Octicon>
            {' '}
            Changelog
          </a>
          }
      </div></small>
      </div>
    )
  }
}

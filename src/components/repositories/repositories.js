import React from "react";
import styled from 'styled-components'
import siteConfig from '../../../data/siteConfig'

import Loader from '../loader'

const endpoint =
  `https://api.github.com/users/${siteConfig.githubUsername}/repos?type=owner&sort=updated&per_page=5&page=1`


class Repositories extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      repos: [],
      status: 'loading',
      commits: []
    }
  }

  async getCommitsForRepo(repos) {

    let repoCommits = [];

    repos.forEach((value, index, array) => {
      fetch(`https://api.github.com/repos/${siteConfig.githubUsername}/${value.name}/commits`)
        .then(response => response.json())
        .then(data => {

          repoCommits[value.name] = data.length;

          this.setState({
            status: 'ready',
            commits: repoCommits
          });


        })
        .catch(err => {
          console.error(err)
        });

      console.log(repoCommits);
      // console.log(value.name);
      // console.log(index);
      // console.log(array);

    });

  }

  async componentDidMount() {
    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        if (data && data.length) {
          this.setState({
            repos: data,
            // status: 'ready'
          });
          this.getCommitsForRepo(data);
        }
      })
      .catch(err => {
        console.error(err);
      });

  }

  rateCommits(commitCount) {

    if (15 < commitCount) { return `${commitCount} 🔥` }
    if (7 < commitCount && commitCount < 15) { return `${commitCount} 🥃` }
    if (commitCount <= 7) { return `${commitCount} 🤔` }
  }

  render() {
    const { status } = this.state
    return (
      <div className={this.props.className}>
        <h2>Latest Repos and Commits on Github</h2>
        {status === "loading" && <div className='repositories__loader'><Loader /></div>}
        {status === "ready" &&
          this.state.repos && (
            <React.Fragment>
              <div className="repositories__content">
                {this.state.repos.map(repo => (
                  <React.Fragment key={repo.name}>
                    <div className="repositories__repo">
                      <a className='repositories__repo-link' href={repo.html_url}>
                        <strong>{repo.name}</strong>
                      </a>
                      <div>{repo.description}</div>
                      <div className="repositories__repo-date">
                        Updated: {new Date(repo.updated_at).toUTCString()}
                      </div>
                      <div className="repositories__repo-star">
                        Commits: {this.rateCommits(this.state.commits[repo.name])}
                      </div>
                    </div>
                    <hr />
                  </React.Fragment>
                ))}
              </div>
            </React.Fragment>
          )}
      </div>
    )
  }
}

export default styled(Repositories)`
  position: relative;
  .repositories__content {
    margin-bottom: 40px;
  }

  .repositories__repo {
    position: relative;
  }

  .repositories__repo-link {
    text-decoration: none;
    color: #25303B;
  }

  .repositories__repo-date {
    color: #bbb;
    font-size: 10px;
  }

  .repositories__repo-star {
    position: absolute;
    top: 0;
    right: 0;
  }

  .repositories__loader {
    display: flex;
  }

  hr {
    margin-top: 16px;
  }

`


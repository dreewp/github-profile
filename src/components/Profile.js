import React, { useState, useEffect } from 'react';
import { FaGithub, FaUsers, FaBook } from 'react-icons/fa';
import '../styles/profile.scss';

const RepoCard = ({ repo }) => {
  const { name, description, html_url } = repo;
  return (
    <a
      className="repo-card"
      href={html_url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <h4>{name}</h4>
      <p>{description}</p>
    </a>
  );
};

const Profile = ({ user }) => {
  const [repos, setRepos] = useState([]);
  const {
    login,
    avatar_url,
    followers,
    public_repos,
    html_url,
    repos_url,
  } = user;

  useEffect(() => {
    const fetchRepos = async (reposURL) => {
      const repos = await fetch(
        `${reposURL}?page=1&per_page=4&sort=stargazers_count&direction=desc`
      ).then((res) => res.json());
      setRepos(repos);
    };

    fetchRepos(repos_url);
  }, [repos_url]);

  if (!login) {
    return <div className="profile">No user found...</div>;
  }

  return (
    <div className="profile">
      <div className="user-info">
        <a href={html_url} target="_blank" rel="noopener noreferrer">
          <img src={avatar_url} alt={'avatar'} />
        </a>
        <div>
          <FaGithub />
          <a href={html_url} target="_blank" rel="noopener noreferrer">
            <b>{login}</b>
          </a>
        </div>
        <div>
          <FaUsers />
          Followers: {followers}
        </div>
        <div>
          <FaBook />
          Repos: {public_repos}
        </div>
      </div>
      {repos.length > 0 && (
        <div className="user-repos">
          {repos.map((repo) => (
            <RepoCard key={`repo-${repo.id}`} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;

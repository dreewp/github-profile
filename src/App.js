import React, { useState, useReducer, useEffect } from 'react';
import { FcSearch } from 'react-icons/fc';
import { FaGithub, FaUsers, FaBook, FaSun, FaMoon } from 'react-icons/fa';
import './App.scss';

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

const profileReducer = (state, action) => {
  switch (action.type) {
    case 'fetch':
      return {
        loading: true,
        fetched: false,
        user: null,
      };
    case 'success':
      return {
        loading: false,
        fetched: true,
        user: action.user,
      };
    case 'error':
      return {
        loading: false,
        fetched: true,
        user: null,
      };
    default:
      return state;
  }
};

function App() {
  const [theme, setTheme] = useState('light');
  const [search, setSearch] = useState('');
  const [state, dispatch] = useReducer(profileReducer, {
    loading: false,
    fetched: false,
    user: null,
  });

  const onSearch = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: 'fetch' });
      const userJSON = await fetch(`https://api.github.com/users/${'dreewp'}`);
      const user = await userJSON.json();
      const {
        login,
        avatar_url,
        followers,
        public_repos,
        html_url,
        repos_url,
      } = user;
      const reducedUser = {
        login,
        avatar_url,
        followers,
        public_repos,
        html_url,
        repos_url,
      };
      dispatch({ type: 'success', user: reducedUser });
    } catch (err) {
      console.error('Could not find user. Please try again.');
      dispatch({ type: 'error' });
    }
  };

  return (
    <div className={`App ${theme}`}>
      <h1>Github Profile</h1>
      <form onSubmit={onSearch}>
        <input
          id="input-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
        <button id="button-search" type="submit">
          <FcSearch />
        </button>
      </form>
      {state.fetched && <Profile user={state.user} />}

      <div
        id="theme-icon"
        onClick={() =>
          setTheme((theme) => (theme === 'light' ? 'dark' : 'light'))
        }
      >
        {theme === 'light' ? <FaSun /> : <FaMoon />}
      </div>
    </div>
  );
}

export default App;

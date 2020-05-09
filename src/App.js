import React, { useState, useReducer, useEffect } from 'react';
import { FcSearch } from 'react-icons/fc';
import { FaSun, FaMoon } from 'react-icons/fa';
import Profile from './components/Profile';
import './App.scss';

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
      const userJSON = await fetch(`https://api.github.com/users/${search}`);
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

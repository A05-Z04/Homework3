import React, { useEffect, useMemo, useState } from 'react';
import './styles.css';

const API_KEY = process.env.REACT_APP_TMDB_KEY;
const API = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

export default function App() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    let alive = true;
    async function run() {
      if (!API_KEY) {
        setError('API key not found. Create a .env.local with REACT_APP_TMDB_KEY. See github README');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const endpoint = query.trim() ? 'search/movie' : 'movie/popular';
        const url = new URL(`${API}/${endpoint}`);
        url.searchParams.set('api_key', API_KEY);
        url.searchParams.set('language', 'en-US');
        url.searchParams.set('page', String(page));
        if (query.trim()) url.searchParams.set('query', query.trim());

        const res = await fetch(url.toString());
        const data = await res.json();
        if (!alive) return;
        setResults(Array.isArray(data.results) ? data.results : []);
        setTotalPages(data.total_pages || 1);
      } catch (e) {
        if (!alive) return;
        setError(e.message || 'Failed to load movies');
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => { alive = false; };
  }, [page, query]);

  const sorted = useMemo(() => {
    const items = [...results];
    if (!sort) return items;
    const sortByDate = sort.startsWith('release_date');
    const asc = sort.endsWith('asc');
    items.sort((a, b) => {
      const av = sortByDate ? Date.parse(a.release_date || 0) : (a.vote_average ?? 0);
      const bv = sortByDate ? Date.parse(b.release_date || 0) : (b.vote_average ?? 0);
      return asc ? av - bv : bv - av;
    });
    return items;
  }, [results, sort]);

  const pageItems = useMemo(() => sorted.slice(0, 20), [sorted]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  function handleSearchInput(e) {
    const val = e.target.value.trimStart();
    setQuery(val);
    setPage(1);
  }

  function toggleMenu() {
    const m = document.getElementById('sortMenu');
    const b = document.getElementById('sortButton');
    if (m && b) {
      m.classList.toggle('show');
      b.classList.toggle('active');
    }
  }

  function closeMenu(e) {
    const b = document.getElementById('sortButton');
    const m = document.getElementById('sortMenu');
    if (!b || !m) return;
    if (!b.contains(e.target) && !m.contains(e.target)) {
      m.classList.remove('show');
      b.classList.remove('active');
    }
  }

  useEffect(() => {
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  return (
    <>
      <header className="header">
        <h1>Movie Explorer</h1>
      </header>

      <section className="controls">
        <div className="control-box">
          <input
            id="searchInput"
            type="text"
            placeholder="Search for a movie..."
            value={query}
            onChange={handleSearchInput}
          />
          <div className="dropdown">
            <button id="sortButton" onClick={toggleMenu}>Sort By ▾</button>
            <div id="sortMenu" className="dropdown-menu">
              <div className="menu-title">Sort By</div>
              <div className="menu-item" onClick={() => setSort('release_date.asc')}>Release Date (Asc)</div>
              <div className="menu-item" onClick={() => setSort('release_date.desc')}>Release Date (Desc)</div>
              <div className="menu-item" onClick={() => setSort('vote_average.asc')}>Rating (Asc)</div>
              <div className="menu-item" onClick={() => setSort('vote_average.desc')}>Rating (Desc)</div>
            </div>
          </div>
        </div>
      </section>

      <main id="movieContainer" className="movie-grid">
        {loading
          ? Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="movie-card" style={{ opacity: 0.5 }}>Loading…</div>
            ))
          : pageItems.map(movie => {
              const releaseDate = movie.release_date || 'N/A';
              const rating = typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : 'N/A';
              const imgSrc = movie.poster_path
                ? `${IMG_BASE}${movie.poster_path}`
                : 'https://via.placeholder.com/200x300?text=No+Image';
              return (
                <div key={movie.id} className="movie-card">
                  <img src={imgSrc} alt={movie.title} />
                  <h3>{movie.title}</h3>
                  <p>Release Date: {releaseDate}</p>
                  <p>Rating: {rating}</p>
                </div>
              );
            })}
      </main>

      <div className="pagination">
        <button
          id="prevBtn"
          disabled={!canPrev}
          onClick={() => canPrev && setPage(p => p - 1)}
        >
          Previous
        </button>
        <span id="pageInfo">Page {page} of {Math.max(1, totalPages)}</span>
        <button
          id="nextBtn"
          disabled={!canNext}
          onClick={() => canNext && setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
}
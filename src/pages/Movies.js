import React, { useEffect, useState } from 'react';
import { getAllMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import { FiSearch } from 'react-icons/fi';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [langFilter, setLangFilter] = useState('All');

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    filterMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, genreFilter, langFilter, movies]);

  const fetchMovies = async () => {
    try {
      const res = await getAllMovies();
      setMovies(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error('Failed to fetch movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let result = movies;
    if (search) {
      result = result.filter((m) =>
        m.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (genreFilter !== 'All') {
      result = result.filter((m) => m.genre === genreFilter);
    }
    if (langFilter !== 'All') {
      result = result.filter((m) => m.language === langFilter);
    }
    setFiltered(result);
  };

  // Extract unique genres and languages
  const genres = ['All', ...new Set(movies.map((m) => m.genre).filter(Boolean))];
  const languages = ['All', ...new Set(movies.map((m) => m.language).filter(Boolean))];

  const pillStyle = (active) => ({
    padding: '10px 20px',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    background: active ? 'var(--primary)' : 'var(--bg-card)',
    color: active ? '#fff' : 'var(--text-secondary)',
    border: active ? '1.5px solid var(--primary)' : '1.5px solid var(--border-color)',
  });

  return (
    <div className="page container" id="movies-page">
      <div style={{ paddingTop: 20, paddingBottom: 12 }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: 24,
          }}
        >
          🎥 All Movies
        </h1>

        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 16,
          }}
        >
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <FiSearch
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              className="form-group__input"
              style={{ paddingLeft: 42 }}
              type="text"
              placeholder="Search by movie name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="movie-search"
            />
          </div>
        </div>

        {/* Genre Filter */}
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginRight: 10, fontWeight: 600 }}>Genre:</span>
          <div style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap' }}>
            {genres.map((g) => (
              <button key={g} onClick={() => setGenreFilter(g)} id={`genre-filter-${g}`} style={pillStyle(genreFilter === g)}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Language Filter */}
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginRight: 10, fontWeight: 600 }}>Language:</span>
          <div style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap' }}>
            {languages.map((l) => (
              <button key={l} onClick={() => setLangFilter(l)} id={`lang-filter-${l}`} style={pillStyle(langFilter === l)}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading movies..." />
      ) : filtered.length === 0 ? (
        <div className="empty-state animate-fadeIn">
          <div className="empty-state__icon">🔍</div>
          <h3 className="empty-state__title">No Movies Found</h3>
          <p className="empty-state__text">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="movie-grid">
          {filtered.map((movie, idx) => (
            <div key={movie.movie_id} style={{ animationDelay: `${idx * 0.06}s` }}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;

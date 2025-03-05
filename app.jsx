import React, { useState } from "react";
import "./App.css";

const API_KEY = "b6005648";
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=`;

const App = () => {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMovies = async () => {
    if (search.trim() === "") return;
    setLoading(true);
    setError("");
    console.log("Searching for:", search);

    try {
      const response = await fetch(API_URL + search);
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("API Response:", data);
      if (data.Response === "False") {
        throw new Error(data.Error);
      }
      setMovies(data.Search || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = (movie) => {
    if (!favorites.some((fav) => fav.imdbID === movie.imdbID)) {
      setFavorites([...favorites, movie]);
    }
  };

  const removeFavorite = (movie) => {
    setFavorites(favorites.filter((fav) => fav.imdbID !== movie.imdbID));
  };

  return (
    <div className="container">
      <h1>IMDb Clone</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search for movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={searchMovies}>Search</button>
      </div>
      <div className="movie-list">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <h2>Search Results</h2>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <div key={movie.imdbID} className="movie-card">
                  <img src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200"} alt={movie.Title} />
                  <h3>{movie.Title}</h3>
                  <p>{movie.Year}</p>
                  <button onClick={() => addFavorite(movie)}>Add to Favorites</button>
                </div>
              ))
            ) : (
              <p>No movies found</p>
            )}
          </>
        )}
      </div>
      <div className="favorites-list">
        <h2>Favorite Movies</h2>
        {favorites.length > 0 ? (
          favorites.map((movie) => (
            <div key={movie.imdbID} className="movie-card">
              <img src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200"} alt={movie.Title} />
              <h3>{movie.Title}</h3>
              <p>{movie.Year}</p>
              <button onClick={() => removeFavorite(movie)}>Remove from Favorites</button>
            </div>
          ))
        ) : (
          <p>No favorite movies added yet</p>
        )}
      </div>
    </div>
  );
};

export default App;

// SearchBar.js
import React from 'react';
import './LogsPage.css';

const SearchBar = ({ search, setSearch, handleSearch, handleReset }) => (
    <div className="search-bar">
        <input
            type="text"
            placeholder="Rechercher dans les journaux..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
            Rechercher
        </button>
        <button onClick={handleReset} className="reset-button">
            Réinitialiser
        </button>
    </div>
);

export default SearchBar;

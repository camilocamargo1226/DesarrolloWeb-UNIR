import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = ({ onSearch, cartItemCount, onCartClick }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleHomeClick = () => {
    navigate('/home');
    if (onSearch) {
      onSearch('');
    }
    setSearchQuery('');
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        {/* Logo */}
        <div className={styles.header__logo} onClick={handleHomeClick}>
          <span className={styles.header__logoIcon}>📚</span>
          <h1 className={styles.header__logoText}>Relatos de Papel</h1>
        </div>

        {/* Search Bar */}
        <form className={styles.header__search} onSubmit={handleSearch}>
          <div className={styles.header__searchContainer}>
            <input
              type="text"
              className={styles.header__searchInput}
              placeholder="Buscar por título..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearch) {
                  onSearch(e.target.value);
                }
              }}
            />
            <button type="submit" className={styles.header__searchButton}>
              <span className={styles.header__searchIcon}>🔍</span>
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className={styles.header__actions}>
          <button 
            className={styles.header__cartButton}
            onClick={onCartClick}
          >
            <span className={styles.header__cartIcon}>🛒</span>
            {cartItemCount > 0 && (
              <span className={styles.header__cartBadge}>
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
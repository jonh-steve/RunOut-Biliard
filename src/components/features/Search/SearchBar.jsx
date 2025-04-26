import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../hooks/useDebounce';
import ProductService from '../../../services/api/ProductService';
import './SearchBar.css';

const SearchBar = ({ placeholder = 'Tìm kiếm sản phẩm...', className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  
  // Fetch suggestions when search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true);
      ProductService.searchProducts(debouncedSearchTerm, 5)
        .then(response => {
          setSuggestions(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching search suggestions:', error);
          setIsLoading(false);
        });
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm]);
  
  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };
  
  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowSuggestions(false);
    setSearchTerm('');
  };
  
  return (
    <div className={`search-bar ${className}`} ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="search-input"
        />
        <button type="submit" className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </form>
      
      {showSuggestions && (searchTerm || isLoading) && (
        <div className="search-suggestions">
          {isLoading ? (
            <div className="suggestion-loading">
              <i className="fas fa-spinner fa-spin"></i>
              Đang tìm kiếm...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="suggestion-header">
                <span>Sản phẩm gợi ý</span>
              </div>
              <div className="suggestion-list">
                {suggestions.map(product => (
                  <div 
                    key={product.id} 
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(product.id)}
                  >
                    <div className="suggestion-image">
                      <img src={product.image || '/assets/placeholder.png'} alt={product.name} />
                    </div>
                    <div className="suggestion-info">
                      <div className="suggestion-name">{product.name}</div>
                      <div className="suggestion-price">
                        {product.discount > 0 ? (
                          <>
                            <span className="current-price">{product.salePrice.toLocaleString('vi-VN')}₫</span>
                            <span className="original-price">{product.price.toLocaleString('vi-VN')}₫</span>
                          </>
                        ) : (
                          <span className="current-price">{product.price.toLocaleString('vi-VN')}₫</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="suggestion-footer">
                <button 
                  className="view-all-btn"
                  onClick={handleSearchSubmit}
                >
                  Xem tất cả kết quả
                </button>
              </div>
            </>
          ) : searchTerm ? (
            <div className="no-suggestions">
              Không tìm thấy sản phẩm phù hợp
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
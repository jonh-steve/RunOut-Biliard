import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ categories = [], filters = {}, onFilterChange }) => {
  const location = useLocation();
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Reset filters when location changes
  useEffect(() => {
    setPriceRange([0, 10000000]);
    setSelectedCategories([]);
  }, [location.pathname]);
  
  const handleCategoryToggle = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  const handleCategorySelect = (categoryId) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelected);
    
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        categories: newSelected
      });
    }
  };
  
  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value, 10);
    setPriceRange(newRange);
  };
  
  const handlePriceApply = () => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        priceRange
      });
    }
  };
  
  const renderCategories = (items, level = 0) => {
    if (!items || items.length === 0) return null;
    
    return (
      <ul className={`category-list ${level > 0 ? 'subcategory' : ''}`}>
        {items.map(category => (
          <li key={category.id}>
            <div className="category-item">
              <label className="category-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategorySelect(category.id)}
                />
                <span>{category.name}</span>
              </label>
              
              {category.children && category.children.length > 0 && (
                <button
                  className={`toggle-btn ${expandedCategories[category.id] ? 'expanded' : ''}`}
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  <i className={`fas fa-chevron-${expandedCategories[category.id] ? 'up' : 'down'}`}></i>
                </button>
              )}
            </div>
            
            {category.children && category.children.length > 0 && expandedCategories[category.id] && (
              renderCategories(category.children, level + 1)
            )}
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3>Danh mục sản phẩm</h3>
        {renderCategories(categories)}
      </div>
      
      <div className="sidebar-section">
        <h3>Lọc theo giá</h3>
        <div className="price-filter">
          <div className="price-inputs">
            <div>
              <label>Từ:</label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e, 0)}
                min="0"
                step="100000"
              />
            </div>
            <div>
              <label>Đến:</label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, 1)}
                min="0"
                step="100000"
              />
            </div>
          </div>
          <button onClick={handlePriceApply} className="apply-filter">Áp dụng</button>
        </div>
      </div>
      
      <div className="sidebar-section">
        <h3>Đánh giá</h3>
        <div className="rating-filter">
          {[5, 4, 3, 2, 1].map(rating => (
            <label key={rating} className="rating-option">
              <input
                type="checkbox"
                checked={filters.ratings?.includes(rating) || false}
                onChange={() => {
                  const newRatings = filters.ratings?.includes(rating)
                    ? filters.ratings.filter(r => r !== rating)
                    : [...(filters.ratings || []), rating];
                  
                  if (onFilterChange) {
                    onFilterChange({
                      ...filters,
                      ratings: newRatings
                    });
                  }
                }}
              />
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i} 
                    className={`fas fa-star ${i < rating ? 'filled' : ''}`}
                  ></i>
                ))}
              </div>
              <span>trở lên</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="sidebar-section">
        <h3>Khuyến mãi</h3>
        <div className="promotion-filter">
          <label className="promotion-option">
            <input
              type="checkbox"
              checked={filters.onSale || false}
              onChange={() => {
                if (onFilterChange) {
                  onFilterChange({
                    ...filters,
                    onSale: !filters.onSale
                  });
                }
              }}
            />
            <span>Đang giảm giá</span>
          </label>
          <label className="promotion-option">
            <input
              type="checkbox"
              checked={filters.freeShipping || false}
              onChange={() => {
                if (onFilterChange) {
                  onFilterChange({
                    ...filters,
                    freeShipping: !filters.freeShipping
                  });
                }
              }}
            />
            <span>Miễn phí vận chuyển</span>
          </label>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
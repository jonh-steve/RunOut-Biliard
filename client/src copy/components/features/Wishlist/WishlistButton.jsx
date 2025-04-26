import React, { useContext, useState } from 'react';
import { WishlistContext } from '../../../context/WishlistContext';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './WishlistButton.css';

const WishlistButton = ({ product, className = '' }) => {
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isWishlisted = isInWishlist(product.id);
  
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: window.location.pathname } } });
      return;
    }
    
    setIsAnimating(true);
    toggleWishlist(product);
    
    // Reset animation after it completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };
  
  return (
    <button 
      className={`wishlist-button ${className} ${isWishlisted ? 'active' : ''} ${isAnimating ? 'animate' : ''}`}
      onClick={handleToggleWishlist}
      title={isWishlisted ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
    >
      <i className={isWishlisted ? 'fas fa-heart' : 'far fa-heart'}></i>
    </button>
  );
};

export default WishlistButton;
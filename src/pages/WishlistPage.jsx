import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { formatCurrency } from '../utils/formatUtils';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  
  // Handle add to cart
  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discount > 0 ? product.salePrice : product.price,
      image: product.image,
      quantity: 1
    });
  };
  
  // Handle remove from wishlist
  const handleRemoveFromWishlist = (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?')) {
      removeFromWishlist(productId);
    }
  };
  
  // Handle clear wishlist
  const handleClearWishlist = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?')) {
      clearWishlist();
    }
  };
  
  return (
    <Layout>
      <div className="wishlist-page">
        <h1>Danh sách yêu thích</h1>
        
        {wishlist.items.length > 0 ? (
          <>
            <div className="wishlist-actions">
              <button onClick={handleClearWishlist} className="clear-wishlist-btn">
                <i className="fas fa-trash"></i>
                Xóa tất cả
              </button>
            </div>
            
            <div className="wishlist-grid">
              {wishlist.items.map(product => (
                <div key={product.id} className="wishlist-item">
                  <div className="wishlist-item-image">
                    <Link to={`/product/${product.id}`}>
                      <img src={product.image || '/assets/placeholder.png'} alt={product.name} />
                    </Link>
                    {product.discount > 0 && (
                      <span className="discount-badge">-{product.discount}%</span>
                    )}
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  
                  <div className="wishlist-item-info">
                    <h3 className="wishlist-item-name">
                      <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                    
                    <div className="wishlist-item-price">
                      {product.discount > 0 ? (
                        <>
                          <span className="current-price">{formatCurrency(product.salePrice)}</span>
                          <span className="original-price">{formatCurrency(product.price)}</span>
                        </>
                      ) : (
                        <span className="current-price">{formatCurrency(product.price)}</span>
                      )}
                    </div>
                    
                    <div className="wishlist-item-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`fas fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                          ></i>
                        ))}
                      </div>
                      <span className="rating-count">({product.reviewCount})</span>
                    </div>
                    
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      <i className="fas fa-shopping-cart"></i>
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">
              <i className="far fa-heart"></i>
            </div>
            <h2>Danh sách yêu thích của bạn đang trống</h2>
            <p>Hãy thêm sản phẩm vào danh sách yêu thích để xem lại sau</p>
            <Link to="/products" className="btn btn-primary">Tiếp tục mua sắm</Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WishlistPage;
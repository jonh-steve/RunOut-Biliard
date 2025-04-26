import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductService from '../services/api/ProductService';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatUtils';
import { useFetch } from '../hooks/useFetch';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  
  // State
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Fetch product details
  const { data: product, loading, error } = useFetch(
    () => ProductService.getProductById(id),
    [id]
  );
  
  // Fetch related products
  const { data: relatedProducts, loading: loadingRelated } = useFetch(
    () => product ? ProductService.getRelatedProducts(id, product.categoryId) : null,
    [product]
  );
  
  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };
  
  // Increment quantity
  const incrementQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };
  
  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.discount > 0 ? product.salePrice : product.price,
        image: product.images[0],
        quantity
      });
    }
  };
  
  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to checkout
    window.location.href = '/checkout';
  };
  
  // Handle review submit
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để đánh giá sản phẩm');
      return;
    }
    
    // TODO: Submit review to API
    console.log('Review submitted:', {
      productId: id,
      rating: reviewRating,
      content: reviewContent
    });
    
    // Reset form
    setReviewContent('');
    setReviewRating(5);
    setShowReviewForm(false);
    
    // Show success message
    alert('Cảm ơn bạn đã đánh giá sản phẩm!');
  };
  
  // If loading
  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner">Đang tải thông tin sản phẩm...</div>
        </div>
      </Layout>
    );
  }
  
  // If error
  if (error || !product) {
    return (
      <Layout>
        <div className="error-container">
          <div className="error-message">
            <h2>Không thể tải thông tin sản phẩm</h2>
            <p>Vui lòng thử lại sau hoặc quay lại trang sản phẩm.</p>
            <Link to="/products" className="btn btn-primary">Quay lại trang sản phẩm</Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="product-detail-page">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <Link to="/products">Sản phẩm</Link>
          <span>/</span>
          <Link to={`/category/${product.categoryId}`}>{product.categoryName}</Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </div>
        
        {/* Product Main Section */}
        <div className="product-main">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img 
                src={product.images[selectedImage] || '/assets/placeholder.png'} 
                alt={product.name} 
              />
              {product.discount > 0 && (
                <span className="discount-badge">-{product.discount}%</span>
              )}
              {product.freeShipping && (
                <span className="free-shipping-badge">Free Ship</span>
              )}
            </div>
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} - ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>
            
            <div className="product-meta">
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fas fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                    ></i>
                  ))}
                </div>
                <span className="rating-count">({product.reviewCount} đánh giá)</span>
              </div>
              
              <div className="product-sku">
                <span>Mã sản phẩm: </span>
                <span>{product.sku || `SKU-${product.id}`}</span>
              </div>
              
              <div className="product-stock">
                <span>Tình trạng: </span>
                <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                  {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
                </span>
              </div>
            </div>
            
            <div className="product-price">
              {product.discount > 0 ? (
                <>
                  <span className="current-price">{formatCurrency(product.salePrice)}</span>
                  <span className="original-price">{formatCurrency(product.price)}</span>
                  <span className="discount-percent">-{product.discount}%</span>
                </>
              ) : (
                <span className="current-price">{formatCurrency(product.price)}</span>
              )}
            </div>
            
            <div className="product-short-description">
              <p>{product.shortDescription}</p>
            </div>
            
            {product.stock > 0 && (
              <div className="product-actions">
                <div className="quantity-control">
                  <button onClick={decrementQuantity} className="quantity-btn">-</button>
                  <input 
                    type="number" 
                    min="1" 
                    max={product.stock} 
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                  <button onClick={incrementQuantity} className="quantity-btn">+</button>
                </div>
                
                <div className="action-buttons">
                  <button onClick={handleAddToCart} className="add-to-cart-btn">
                    <i className="fas fa-shopping-cart"></i>
                    Thêm vào giỏ
                  </button>
                  <button onClick={handleBuyNow} className="buy-now-btn">
                    Mua ngay
                  </button>
                </div>
              </div>
            )}
            
            <div className="product-additional-info">
              <div className="wishlist-compare">
                <button className="wishlist-btn">
                  <i className="far fa-heart"></i>
                  Thêm vào yêu thích
                </button>
                <button className="compare-btn">
                  <i className="fas fa-exchange-alt"></i>
                  So sánh
                </button>
              </div>
              
              <div className="share-buttons">
                <span>Chia sẻ:</span>
                <a href="#" className="facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="twitter"><i className="fab fa-twitter"></i></a>
                <a href="#" className="pinterest"><i className="fab fa-pinterest-p"></i></a>
                <a href="#" className="email"><i className="far fa-envelope"></i></a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Mô tả
            </button>
            <button 
              className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Thông số kỹ thuật
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Đánh giá ({product.reviewCount})
            </button>
          </div>
          
          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-pane">
                <div className="product-description" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="tab-pane">
                <table className="specifications-table">
                  <tbody>
                    {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <th>{key}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="tab-pane">
                <div className="reviews-summary">
                  <div className="rating-summary">
                    <div className="average-rating">
                      <span className="rating-value">{product.rating.toFixed(1)}</span>
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`fas fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                          ></i>
                        ))}
                      </div>
                      <span className="rating-count">({product.reviewCount} đánh giá)</span>
                    </div>
                    
                    <div className="rating-bars">
                      {[5, 4, 3, 2, 1].map(star => {
                        const percent = product.reviewCount > 0 
                          ? (product.ratingCounts?.[star] || 0) / product.reviewCount * 100 
                          : 0;
                        
                        return (
                          <div key={star} className="rating-bar">
                            <div className="star-label">{star} <i className="fas fa-star"></i></div>
                            <div className="progress-bar">
                              <div className="progress" style={{ width: `${percent}%` }}></div>
                            </div>
                            <div className="percent">{percent.toFixed(0)}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="review-actions">
                    <button 
                      className="write-review-btn"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                      Viết đánh giá
                    </button>
                  </div>
                </div>
                
                {showReviewForm && (
                  <div className="review-form-container">
                    <h3>Đánh giá sản phẩm</h3>
                    <form onSubmit={handleReviewSubmit} className="review-form">
                      <div className="rating-selection">
                        <span>Đánh giá của bạn:</span>
                        <div className="star-rating">
                          {[5, 4, 3, 2, 1].map(star => (
                            <label key={star}>
                              <input
                                type="radio"
                                name="rating"
                                value={star}
                                checked={reviewRating === star}
                                onChange={() => setReviewRating(star)}
                              />
                              <i className={`fas fa-star ${reviewRating >= star ? 'filled' : ''}`}></i>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="review-content">Nội dung đánh giá:</label>
                        <textarea
                          id="review-content"
                          value={reviewContent}
                          onChange={(e) => setReviewContent(e.target.value)}
                          required
                          rows="5"
                          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                        ></textarea>
                      </div>
                      
                      <div className="form-actions">
                        <button type="submit" className="submit-review-btn">Gửi đánh giá</button>
                        <button 
                          type="button" 
                          className="cancel-btn"
                          onClick={() => setShowReviewForm(false)}
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                <div className="reviews-list">
                  <h3>Đánh giá từ khách hàng</h3>
                  
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map(review => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <img 
                              src={review.userAvatar || '/assets/default-avatar.png'} 
                              alt={review.userName} 
                              className="reviewer-avatar" 
                            />
                            <div>
                              <div className="reviewer-name">{review.userName}</div>
                              <div className="review-date">{new Date(review.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i} 
                                className={`fas fa-star ${i < review.rating ? 'filled' : ''}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <div className="review-content">
                          <p>{review.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-reviews">
                      <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Sản phẩm liên quan</h2>
            
            <div className="products-grid">
              {relatedProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <Link to={`/product/${product.id}`}>
                      <img src={product.image || '/assets/placeholder.png'} alt={product.name} />
                    </Link>
                    {product.discount > 0 && (
                      <span className="discount-badge">-{product.discount}%</span>
                    )}
                    <button className="quick-view-btn">Xem nhanh</button>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">
                      <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                    <div className="product-price">
                      {product.discount > 0 ? (
                        <>
                          <span className="current-price">{formatCurrency(product.salePrice)}</span>
                          <span className="original-price">{formatCurrency(product.price)}</span>
                        </>
                      ) : (
                        <span className="current-price">{formatCurrency(product.price)}</span>
                      )}
                    </div>
                    <div className="product-rating">
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
                    <button className="add-to-cart-btn">Thêm vào giỏ</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
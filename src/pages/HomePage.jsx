import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductService from '../services/api/ProductService';
import CategoryService from '../services/api/CategoryService';
import { formatCurrency } from '../utils/formatUtils';
import { useFetch } from '../hooks/useFetch';
import './HomePage.css';

const HomePage = () => {
  // Fetch featured products
  const { data: featuredProducts, loading: loadingProducts, error: productsError } = 
    useFetch(() => ProductService.getFeaturedProducts(8));
  
  // Fetch categories
  const { data: categories, loading: loadingCategories, error: categoriesError } = 
    useFetch(() => CategoryService.getCategories());
  
  // Fetch promotions
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      title: 'Giảm giá mùa hè',
      description: 'Giảm đến 50% cho các sản phẩm mùa hè',
      image: '/assets/promotions/summer-sale.jpg',
      url: '/promotions/summer-sale'
    },
    {
      id: 2,
      title: 'Miễn phí vận chuyển',
      description: 'Miễn phí vận chuyển cho đơn hàng trên 500.000đ',
      image: '/assets/promotions/free-shipping.jpg',
      url: '/promotions/free-shipping'
    }
  ]);
  
  // Banner slides
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: 'Bộ sưu tập mới',
      description: 'Khám phá các sản phẩm mới nhất của chúng tôi',
      image: '/assets/banners/new-collection.jpg',
      url: '/collections/new'
    },
    {
      id: 2,
      title: 'Giảm giá đặc biệt',
      description: 'Tiết kiệm đến 30% cho các sản phẩm được chọn',
      image: '/assets/banners/special-discount.jpg',
      url: '/promotions/special'
    }
  ]);
  
  const [currentBanner, setCurrentBanner] = useState(0);
  
  // Auto slide banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners.length]);
  
  return (
    <Layout>
      <div className="home-page">
        {/* Banner Slider */}
        <section className="banner-slider">
          <div className="banner-container" style={{ transform: `translateX(-${currentBanner * 100}%)` }}>
            {banners.map((banner, index) => (
              <div key={banner.id} className="banner-slide">
                <img src={banner.image} alt={banner.title} />
                <div className="banner-content">
                  <h2>{banner.title}</h2>
                  <p>{banner.description}</p>
                  <Link to={banner.url} className="btn btn-primary">Xem ngay</Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="banner-indicators">
            {banners.map((_, index) => (
              <button 
                key={index} 
                className={`indicator ${index === currentBanner ? 'active' : ''}`}
                onClick={() => setCurrentBanner(index)}
              />
            ))}
          </div>
        </section>
        
        {/* Categories */}
        <section className="home-section categories-section">
          <div className="section-header">
            <h2>Danh mục sản phẩm</h2>
            <Link to="/categories" className="view-all">Xem tất cả</Link>
          </div>
          
          {loadingCategories ? (
            <div className="loading-spinner">Đang tải...</div>
          ) : categoriesError ? (
            <div className="error-message">Có lỗi xảy ra khi tải danh mục</div>
          ) : (
            <div className="categories-grid">
              {categories?.slice(0, 6).map(category => (
                <Link to={`/category/${category.id}`} key={category.id} className="category-card">
                  <div className="category-image">
                    <img src={category.image || '/assets/placeholder.png'} alt={category.name} />
                  </div>
                  <h3>{category.name}</h3>
                </Link>
              ))}
            </div>
          )}
        </section>
        
        {/* Featured Products */}
        <section className="home-section featured-products-section">
          <div className="section-header">
            <h2>Sản phẩm nổi bật</h2>
            <Link to="/products" className="view-all">Xem tất cả</Link>
          </div>
          
          {loadingProducts ? (
            <div className="loading-spinner">Đang tải...</div>
          ) : productsError ? (
            <div className="error-message">Có lỗi xảy ra khi tải sản phẩm</div>
          ) : (
            <div className="products-grid">
              {featuredProducts?.map(product => (
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
          )}
        </section>
        
        {/* Promotions */}
        <section className="home-section promotions-section">
          <div className="section-header">
            <h2>Khuyến mãi đặc biệt</h2>
          </div>
          
          <div className="promotions-grid">
            {promotions.map(promo => (
              <Link to={promo.url} key={promo.id} className="promotion-card">
                <div className="promotion-image">
                  <img src={promo.image} alt={promo.title} />
                </div>
                <div className="promotion-content">
                  <h3>{promo.title}</h3>
                  <p>{promo.description}</p>
                  <span className="promo-link">Xem chi tiết</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Newsletter */}
        <section className="newsletter-section">
          <div className="newsletter-content">
            <h2>Đăng ký nhận tin</h2>
            <p>Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Email của bạn" required />
              <button type="submit" className="btn btn-primary">Đăng ký</button>
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
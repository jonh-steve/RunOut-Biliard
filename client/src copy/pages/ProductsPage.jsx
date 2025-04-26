import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Sidebar from '../components/layout/Sidebar';
import ProductService from '../services/api/ProductService';
import CategoryService from '../services/api/CategoryService';
import { formatCurrency } from '../utils/formatUtils';
import { useDebounce } from '../hooks/useDebounce';
import { useFetch } from '../hooks/useFetch';
import './ProductsPage.css';

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // Parse query parameters
  const initialFilters = {
    categories: queryParams.get('categories')?.split(',').map(Number) || [],
    priceRange: [
      parseInt(queryParams.get('minPrice') || '0', 10),
      parseInt(queryParams.get('maxPrice') || '10000000', 10)
    ],
    ratings: queryParams.get('ratings')?.split(',').map(Number) || [],
    onSale: queryParams.get('onSale') === 'true',
    freeShipping: queryParams.get('freeShipping') === 'true',
  };
  
  const initialSort = queryParams.get('sort') || 'newest';
  const initialPage = parseInt(queryParams.get('page') || '1', 10);
  const initialSearch = queryParams.get('search') || '';
  
  // State
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(12);
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 500);
  
  // Fetch categories
  const { data: categories } = useFetch(() => CategoryService.getCategories());
  
  // Fetch products with filters
  const { data: productsData, loading, error, refetch } = useFetch(() => {
    const params = {
      page,
      pageSize,
      sort,
      search: debouncedSearch,
      ...filters,
      categories: filters.categories.join(','),
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
      ratings: filters.ratings.join(','),
    };
    return ProductService.getProducts(params);
  }, [page, sort, debouncedSearch, filters]);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.categories.length > 0) {
      params.set('categories', filters.categories.join(','));
    }
    
    if (filters.priceRange[0] > 0) {
      params.set('minPrice', filters.priceRange[0].toString());
    }
    
    if (filters.priceRange[1] < 10000000) {
      params.set('maxPrice', filters.priceRange[1].toString());
    }
    
    if (filters.ratings.length > 0) {
      params.set('ratings', filters.ratings.join(','));
    }
    
    if (filters.onSale) {
      params.set('onSale', 'true');
    }
    
    if (filters.freeShipping) {
      params.set('freeShipping', 'true');
    }
    
    if (sort !== 'newest') {
      params.set('sort', sort);
    }
    
    if (page !== 1) {
      params.set('page', page.toString());
    }
    
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    }
    
    navigate({ search: params.toString() }, { replace: true });
  }, [filters, sort, page, debouncedSearch, navigate]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1); // Reset to first page when sort changes
  };
  
  // Handle search change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when search changes
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };
  
  // Calculate total pages
  const totalPages = productsData?.totalPages || 1;
  
  // Generate pagination array
  const getPaginationArray = () => {
    const paginationArray = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        paginationArray.push(i);
      }
    } else {
      // Always show first page
      paginationArray.push(1);
      
      // Calculate start and end of middle pages
      let startPage = Math.max(2, page - Math.floor(maxPagesToShow / 2) + 1);
      let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);
      
      // Adjust if we're near the end
      if (endPage - startPage < maxPagesToShow - 3) {
        startPage = Math.max(2, endPage - (maxPagesToShow - 3));
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        paginationArray.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        paginationArray.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        paginationArray.push('...');
      }
      
      // Always show last page
      paginationArray.push(totalPages);
    }
    
    return paginationArray;
  };
  
  return (
    <Layout>
      <div className="products-page">
        <div className="products-header">
          <h1>Sản phẩm</h1>
          <div className="products-search">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={handleSearchChange}
            />
            <button>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
        
        <div className="products-container">
          <div className="sidebar-container">
            <Sidebar 
              categories={categories} 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </div>
          
          <div className="products-content">
            <div className="products-toolbar">
              <div className="products-count">
                {productsData?.totalItems ? (
                  <span>Hiển thị {productsData.items.length} trên {productsData.totalItems} sản phẩm</span>
                ) : (
                  <span>0 sản phẩm</span>
                )}
              </div>
              
              <div className="products-sort">
                <label htmlFor="sort">Sắp xếp theo:</label>
                <select id="sort" value={sort} onChange={handleSortChange}>
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="name_asc">Tên A-Z</option>
                  <option value="name_desc">Tên Z-A</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="loading-spinner">Đang tải sản phẩm...</div>
            ) : error ? (
              <div className="error-message">
                <p>Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại sau.</p>
                <button onClick={refetch} className="retry-button">Thử lại</button>
              </div>
            ) : productsData?.items.length === 0 ? (
              <div className="no-products">
                <i className="fas fa-box-open"></i>
                <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.</p>
                <button 
                  onClick={() => {
                    setFilters(initialFilters);
                    setSort('newest');
                    setSearch('');
                  }} 
                  className="reset-filters-button"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {productsData?.items.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-image">
                        <a href={`/product/${product.id}`}>
                          <img src={product.image || '/assets/placeholder.png'} alt={product.name} />
                        </a>
                        {product.discount > 0 && (
                          <span className="discount-badge">-{product.discount}%</span>
                        )}
                        {product.freeShipping && (
                          <span className="free-shipping-badge">Free Ship</span>
                        )}
                        <button className="quick-view-btn">Xem nhanh</button>
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">
                          <a href={`/product/${product.id}`}>{product.name}</a>
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
                
                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      className="pagination-arrow"
                      disabled={page === 1}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    
                    {getPaginationArray().map((pageNum, index) => (
                      <button 
                        key={index}
                        className={`pagination-item ${pageNum === page ? 'active' : ''} ${pageNum === '...' ? 'ellipsis' : ''}`}
                        onClick={() => pageNum !== '...' && handlePageChange(pageNum)}
                        disabled={pageNum === '...'}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    <button 
                      className="pagination-arrow"
                      disabled={page === totalPages}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
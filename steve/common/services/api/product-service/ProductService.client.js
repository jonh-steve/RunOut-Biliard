import apiClient from '../api-client';

/**
 * Service xử lý các API liên quan đến sản phẩm
 */
class ProductService {
  /**
   * Lấy danh sách sản phẩm
   * @param {Object} params - Các tham số query (page, limit, category, search, v.v.)
   * @returns {Promise} - Promise chứa danh sách sản phẩm
   */
  async getProducts(params = {}) {
    try {
      return await apiClient.get('/products', { params });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lấy chi tiết sản phẩm
   * @param {string} id - ID sản phẩm
   * @returns {Promise} - Promise chứa chi tiết sản phẩm
   */
  async getProduct(id) {
    try {
      return await apiClient.get(`/products/${id}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lấy danh sách sản phẩm nổi bật
   * @param {Object} params - Các tham số query (limit, v.v.)
   * @returns {Promise} - Promise chứa danh sách sản phẩm nổi bật
   */
  async getFeaturedProducts(params = {}) {
    try {
      return await apiClient.get('/products/featured', { params });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lấy danh sách sản phẩm mới
   * @param {Object} params - Các tham số query (limit, v.v.)
   * @returns {Promise} - Promise chứa danh sách sản phẩm mới
   */
  async getNewProducts(params = {}) {
    try {
      return await apiClient.get('/products/new', { params });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lấy danh sách sản phẩm liên quan
   * @param {string} id - ID sản phẩm
   * @param {Object} params - Các tham số query (limit, v.v.)
   * @returns {Promise} - Promise chứa danh sách sản phẩm liên quan
   */
  async getRelatedProducts(id, params = {}) {
    try {
      return await apiClient.get(`/products/${id}/related`, { params });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lấy danh sách đánh giá của sản phẩm
   * @param {string} id - ID sản phẩm
   * @param {Object} params - Các tham số query (page, limit, v.v.)
   * @returns {Promise} - Promise chứa danh sách đánh giá
   */
  async getProductReviews(id, params = {}) {
    try {
      return await apiClient.get(`/products/${id}/reviews`, { params });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Thêm đánh giá cho sản phẩm
   * @param {string} id - ID sản phẩm
   * @param {Object} reviewData - Thông tin đánh giá
   * @returns {Promise} - Promise chứa thông tin đánh giá đã thêm
   */
  async addProductReview(id, reviewData) {
    try {
      return await apiClient.post(`/products/${id}/reviews`, reviewData);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lấy danh sách danh mục sản phẩm
   * @returns {Promise} - Promise chứa danh sách danh mục
   */
  async getCategories() {
    try {
      return await apiClient.get('/categories');
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lấy chi tiết danh mục sản phẩm
   * @param {string} id - ID danh mục
   * @returns {Promise} - Promise chứa chi tiết danh mục
   */
  async getCategory(id) {
    try {
      return await apiClient.get(`/categories/${id}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lấy danh sách sản phẩm theo danh mục
   * @param {string} id - ID danh m���c
   * @param {Object} params - Các tham số query (page, limit, v.v.)
   * @returns {Promise} - Promise chứa danh sách sản phẩm
   */
  async getCategoryProducts(id, params = {}) {
    try {
      return await apiClient.get(`/categories/${id}/products`, { params });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Tìm kiếm sản phẩm
   * @param {string} query - Từ khóa tìm kiếm
   * @param {Object} params - Các tham số query (page, limit, v.v.)
   * @returns {Promise} - Promise chứa kết quả tìm kiếm
   */
  async searchProducts(query, params = {}) {
    try {
      return await apiClient.get('/products/search', { 
        params: { 
          q: query,
          ...params 
        } 
      });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lọc sản phẩm theo nhiều tiêu chí
   * @param {Object} filters - Các tiêu chí lọc (category, price, brand, v.v.)
   * @param {Object} params - Các tham số query (page, limit, sort, v.v.)
   * @returns {Promise} - Promise chứa kết quả lọc
   */
  async filterProducts(filters = {}, params = {}) {
    try {
      return await apiClient.get('/products/filter', { 
        params: { 
          ...filters,
          ...params 
        } 
      });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * So sánh các sản phẩm
   * @param {Array} productIds - Mảng các ID sản phẩm cần so sánh
   * @returns {Promise} - Promise chứa thông tin so sánh
   */
  async compareProducts(productIds) {
    try {
      return await apiClient.get('/products/compare', { 
        params: { ids: productIds.join(',') } 
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductService();
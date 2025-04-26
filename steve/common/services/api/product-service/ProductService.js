import axios from 'axios';
import { getToken } from '../../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

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
      const response = await axios.get(`${API_URL}/products`, {
        params,
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Lấy chi tiết sản phẩm
   * @param {string} id - ID sản phẩm
   * @returns {Promise} - Promise chứa chi tiết sản phẩm
   */
  async getProduct(id) {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Lấy danh sách sản phẩm nổi bật
   * @param {Object} params - Các tham số query (limit, v.v.)
   * @returns {Promise} - Promise chứa danh sách sản phẩm nổi bật
   */
  async getFeaturedProducts(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/products/featured`, {
        params,
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Lấy danh sách sản phẩm mới
   * @param {Object} params - Các tham số query (limit, v.v.)
   * @returns {Promise} - Promise chứa danh sách sản phẩm mới
   */
  async getNewProducts(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/products/new`, {
        params,
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
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
      const response = await axios.get(`${API_URL}/products/${id}/related`, {
        params,
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
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
      const response = await axios.get(`${API_URL}/products/${id}/reviews`, {
        params,
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
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
      const token = getToken();
      
      const response = await axios.post(
        `${API_URL}/products/${id}/reviews`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Lấy danh sách danh mục sản phẩm
   * @returns {Promise} - Promise chứa danh sách danh mục
   */
  async getCategories() {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Lấy chi tiết danh mục sản phẩm
   * @param {string} id - ID danh mục
   * @returns {Promise} - Promise chứa chi tiết danh mục
   */
  async getCategory(id) {
    try {
      const response = await axios.get(`${API_URL}/categories/${id}`);
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Lấy danh sách sản phẩm theo danh mục
   * @param {string} id - ID danh mục
   * @param {Object} params - Các tham số query (page, limit, v.v.)
   * @returns {Promise} - Promise chứa danh sách sản phẩm
   */
  async getCategoryProducts(id, params = {}) {
    try {
      const response = await axios.get(`${API_URL}/categories/${id}/products`, {
        params,
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Xử lý lỗi
   * @param {Error} error - Lỗi từ API
   * @returns {Object} - Object chứa thông tin lỗi
   */
  handleError(error) {
    if (error.response) {
      // Lỗi t��� server với status code
      return {
        message: error.response.data.message || 'Đã xảy ra lỗi',
        errors: error.response.data.errors || {},
        status: error.response.status,
      };
    } else if (error.request) {
      // Lỗi không nhận được response
      return {
        message: 'Không thể kết nối đến server',
        status: 0,
      };
    } else {
      // Lỗi khác
      return {
        message: error.message,
        status: 0,
      };
    }
  }
}

export default new ProductService();
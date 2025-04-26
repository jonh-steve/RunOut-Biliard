import axiosInstance from './axiosConfig';

/**
 * Lấy danh sách sản phẩm với phân trang và lọc
 * @param {Object} params - Tham số truy vấn
 * @param {number} params.page - Trang hiện tại
 * @param {number} params.limit - Số lượng sản phẩm mỗi trang
 * @param {string} params.sort - Trường sắp xếp
 * @param {string} params.order - Thứ tự sắp xếp (asc, desc)
 * @param {string} params.category - ID danh mục
 * @param {number} params.minPrice - Giá tối thiểu
 * @param {number} params.maxPrice - Giá tối đa
 * @param {string} params.search - Từ khóa tìm kiếm
 * @returns {Promise<Object>} - Danh sách sản phẩm và thông tin phân trang
 */
export const getProducts = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/products', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy danh sách sản phẩm');
  }
};

/**
 * Lấy thông tin chi tiết sản phẩm theo ID
 * @param {string} productId - ID của sản phẩm
 * @returns {Promise<Object>} - Thông tin chi tiết sản phẩm
 */
export const getProductById = async (productId) => {
  try {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy thông tin sản phẩm');
  }
};

/**
 * Lấy danh sách sản phẩm nổi bật
 * @param {number} limit - Số lượng sản phẩm cần lấy
 * @returns {Promise<Array>} - Danh sách sản phẩm nổi bật
 */
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const response = await axiosInstance.get('/products/featured', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy sản phẩm nổi bật');
  }
};

/**
 * Lấy danh sách sản phẩm mới
 * @param {number} limit - Số lượng sản phẩm cần lấy
 * @returns {Promise<Array>} - Danh sách sản phẩm mới
 */
export const getNewProducts = async (limit = 8) => {
  try {
    const response = await axiosInstance.get('/products/new', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy sản phẩm mới');
  }
};

/**
 * Lấy danh sách sản phẩm liên quan
 * @param {string} productId - ID của sản phẩm
 * @param {number} limit - Số lượng sản phẩm cần lấy
 * @returns {Promise<Array>} - Danh sách sản phẩm liên quan
 */
export const getRelatedProducts = async (productId, limit = 4) => {
  try {
    const response = await axiosInstance.get(`/products/${productId}/related`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy sản phẩm liên quan');
  }
};

/**
 * Lấy danh sách đánh giá của sản phẩm
 * @param {string} productId - ID của sản phẩm
 * @param {Object} params - Tham số truy vấn
 * @param {number} params.page - Trang hiện tại
 * @param {number} params.limit - Số lượng đánh giá mỗi trang
 * @returns {Promise<Object>} - Danh sách đánh giá và thông tin phân trang
 */
export const getProductReviews = async (productId, params = {}) => {
  try {
    const response = await axiosInstance.get(`/products/${productId}/reviews`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy đánh giá sản phẩm');
  }
};

/**
 * Thêm đánh giá cho sản phẩm
 * @param {string} productId - ID của sản phẩm
 * @param {Object} reviewData - Thông tin đánh giá
 * @param {number} reviewData.rating - Số sao đánh giá (1-5)
 * @param {string} reviewData.comment - Nội dung đánh giá
 * @returns {Promise<Object>} - Đánh giá đã thêm
 */
export const addProductReview = async (productId, reviewData) => {
  try {
    const response = await axiosInstance.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể thêm đánh giá');
  }
};
import axiosInstance from './axiosConfig';

/**
 * Lấy thông tin người dùng theo ID
 * @param {string} userId - ID của người dùng
 * @returns {Promise<Object>} - Thông tin người dùng
 */
export const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy thông tin người dùng');
  }
};

/**
 * Cập nhật thông tin người dùng
 * @param {string} userId - ID của người dùng
 * @param {Object} userData - Thông tin cần cập nhật
 * @returns {Promise<Object>} - Thông tin người dùng đã cập nhật
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể cập nhật thông tin người dùng');
  }
};

/**
 * Cập nhật mật khẩu người dùng
 * @param {string} userId - ID của người dùng
 * @param {string} currentPassword - Mật khẩu hiện tại
 * @param {string} newPassword - Mật khẩu m���i
 * @returns {Promise<Object>} - Thông báo kết quả
 */
export const updatePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}/password`, {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể cập nhật mật khẩu');
  }
};

/**
 * Lấy danh sách địa chỉ của người dùng
 * @param {string} userId - ID của người dùng
 * @returns {Promise<Array>} - Danh sách địa chỉ
 */
export const getUserAddresses = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}/addresses`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy danh sách địa chỉ');
  }
};

/**
 * Thêm địa chỉ mới cho người dùng
 * @param {string} userId - ID của người dùng
 * @param {Object} addressData - Thông tin địa chỉ
 * @returns {Promise<Object>} - Địa chỉ đã thêm
 */
export const addUserAddress = async (userId, addressData) => {
  try {
    const response = await axiosInstance.post(`/users/${userId}/addresses`, addressData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể thêm địa chỉ');
  }
};

/**
 * Cập nhật địa chỉ của người dùng
 * @param {string} userId - ID của người dùng
 * @param {string} addressId - ID của địa chỉ
 * @param {Object} addressData - Thông tin địa chỉ cần cập nhật
 * @returns {Promise<Object>} - Địa chỉ đã cập nhật
 */
export const updateUserAddress = async (userId, addressId, addressData) => {
  try {
    const response = await axiosInstance.put(
      `/users/${userId}/addresses/${addressId}`,
      addressData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể cập nhật địa chỉ');
  }
};

/**
 * Xóa địa chỉ của người dùng
 * @param {string} userId - ID của người dùng
 * @param {string} addressId - ID của địa chỉ
 * @returns {Promise<Object>} - Thông báo kết quả
 */
export const deleteUserAddress = async (userId, addressId) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}/addresses/${addressId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể xóa địa chỉ');
  }
};
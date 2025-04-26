import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../services/api/axiosConfig';

/**
 * Custom hook để gọi API
 * @param {string} url - URL của API
 * @param {Object} options - Tùy chọn cho request
 * @param {boolean} options.immediate - Có gọi API ngay khi component mount không
 * @param {Object} options.params - Query params
 * @param {Object} options.initialData - Dữ liệu ban đầu
 * @returns {Object} - { data, loading, error, fetch, setData }
 */
const useFetch = (url, options = {}) => {
  const { immediate = true, params = {}, initialData = null } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm gọi API
  const fetch = useCallback(async (customParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(url, {
        params: { ...params, ...customParams },
      });
      
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi gọi API');
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, params]);

  // Gọi API khi component mount nếu immediate = true
  useEffect(() => {
    if (immediate) {
      fetch();
    }
  }, [immediate, fetch]);

  return { data, loading, error, fetch, setData };
};

export default useFetch;
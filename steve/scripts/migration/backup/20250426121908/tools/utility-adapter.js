/**
 * Utility Functions Adapter
 * 
 * Lớp adapter này giúp đồng bộ hóa các utility functions giữa giao diện User và Client
 * Cung cấp interface thống nhất để sử dụng các utility functions trong cả hai giao diện
 */

// Các hàm xử lý chuỗi
export const stringUtils = {
    /**
     * Viết hoa chữ cái đầu tiên của chuỗi
     * @param {string} str - Chuỗi cần xử lý
     * @returns {string} - Chuỗi đã xử lý
     */
    capitalize: (str) => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
  
    /**
     * Viết hoa chữ cái đầu tiên của mỗi từ trong chuỗi
     * @param {string} str - Chuỗi cần xử lý
     * @returns {string} - Chuỗi đã xử lý
     */
    titleCase: (str) => {
      if (!str) return '';
      return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
  
    /**
     * Cắt chuỗi nếu dài hơn maxLength và thêm ellipsis
     * @param {string} str - Chuỗi cần xử lý
     * @param {number} maxLength - Độ dài tối đa
     * @param {string} ellipsis - Ký tự thay thế (mặc định là "...")
     * @returns {string} - Chuỗi đã xử lý
     */
    truncate: (str, maxLength, ellipsis = '...') => {
      if (!str) return '';
      if (str.length <= maxLength) return str;
      return str.slice(0, maxLength) + ellipsis;
    },
  
    /**
     * Loại bỏ các ký tự đặc biệt khỏi chuỗi
     * @param {string} str - Chuỗi cần xử lý
     * @returns {string} - Chuỗi đã xử lý
     */
    removeSpecialChars: (str) => {
      if (!str) return '';
      return str.replace(/[^\w\s]/gi, '');
    },
  
    /**
     * Chuyển đổi chuỗi thành slug
     * @param {string} str - Chuỗi cần xử lý
     * @returns {string} - Chuỗi đã xử lý
     */
    slugify: (str) => {
      if (!str) return '';
      return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    },
  
    /**
     * Loại bỏ dấu tiếng Việt
     * @param {string} str - Chuỗi cần xử lý
     * @returns {string} - Chuỗi đã xử lý
     */
    removeVietnameseAccents: (str) => {
      if (!str) return '';
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    }
  };
  
  // Các hàm xử lý số
  export const numberUtils = {
    /**
     * Format số thành chuỗi có dấu phân cách hàng nghìn
     * @param {number} num - Số cần format
     * @param {string} separator - Dấu phân cách (mặc định là ",")
     * @returns {string} - Chuỗi đã format
     */
    formatNumber: (num, separator = ',') => {
      if (num === null || num === undefined) return '';
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    },
  
    /**
     * Format số thành chuỗi tiền tệ
     * @param {number} num - Số cần format
     * @param {string} currency - Đơn vị tiền tệ (mặc định là "VND")
     * @param {boolean} showSymbol - Có hiển thị ký hiệu tiền tệ không
     * @returns {string} - Chuỗi đã format
     */
    formatCurrency: (num, currency = 'VND', showSymbol = true) => {
      if (num === null || num === undefined) return '';
      
      const formattedNum = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      
      if (showSymbol) {
        if (currency === 'VND') {
          return `${formattedNum} ${currency}`;
        } else if (currency === 'USD') {
          return `$${formattedNum}`;
        } else {
          return `${formattedNum} ${currency}`;
        }
      }
      
      return formattedNum;
    },
  
    /**
     * Làm tròn số đến số chữ số thập phân
     * @param {number} num - Số cần làm tròn
     * @param {number} decimals - Số chữ số thập phân (mặc định là 2)
     * @returns {number} - Số đã làm tròn
     */
    roundNumber: (num, decimals = 2) => {
      if (num === null || num === undefined) return 0;
      return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals);
    },
  
    /**
     * Chuyển đổi số thành phần trăm
     * @param {number} num - Số cần chuyển đổi
     * @param {number} decimals - Số chữ số thập phân (mặc định là 2)
     * @returns {string} - Chuỗi phần trăm
     */
    toPercentage: (num, decimals = 2) => {
      if (num === null || num === undefined) return '0%';
      return (num * 100).toFixed(decimals) + '%';
    },
  
    /**
     * Giới hạn số trong khoảng min-max
     * @param {number} num - Số cần giới hạn
     * @param {number} min - Giá trị nhỏ nhất
     * @param {number} max - Giá trị lớn nhất
     * @returns {number} - Số đã giới hạn
     */
    clamp: (num, min, max) => {
      if (num === null || num === undefined) return min;
      return Math.min(Math.max(num, min), max);
    }
  };
  
  // Các hàm xử lý ngày tháng
  export const dateUtils = {
    /**
     * Format ngày tháng theo định dạng
     * @param {Date|string|number} date - Đối tượng Date, chuỗi ISO hoặc timestamp
     * @param {string} format - Định dạng (mặc định là "DD/MM/YYYY")
     * @returns {string} - Chuỗi ngày tháng đã format
     */
    formatDate: (date, format = 'DD/MM/YYYY') => {
      if (!date) return '';
      
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const seconds = d.getSeconds().toString().padStart(2, '0');
      
      return format
        .replace('DD', day)
        .replace('MM', month)
        .replace('YYYY', year)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
    },
  
    /**
     * Lấy ngày hiện tại
     * @param {string} format - Định dạng (mặc định là "DD/MM/YYYY")
     * @returns {string} - Chuỗi ngày tháng hiện tại
     */
    getCurrentDate: (format = 'DD/MM/YYYY') => {
      return dateUtils.formatDate(new Date(), format);
    },
  
    /**
     * Tính khoảng cách giữa hai ngày
     * @param {Date|string|number} date1 - Ngày thứ nhất
     * @param {Date|string|number} date2 - Ngày thứ hai
     * @param {string} unit - Đơn vị (days, hours, minutes, seconds)
     * @returns {number} - Khoảng cách
     */
    getDateDiff: (date1, date2, unit = 'days') => {
      if (!date1 || !date2) return 0;
      
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
      
      const diffMs = Math.abs(d2 - d1);
      
      switch (unit) {
        case 'days':
          return Math.floor(diffMs / (1000 * 60 * 60 * 24));
        case 'hours':
          return Math.floor(diffMs / (1000 * 60 * 60));
        case 'minutes':
          return Math.floor(diffMs / (1000 * 60));
        case 'seconds':
          return Math.floor(diffMs / 1000);
        default:
          return diffMs;
      }
    },
  
    /**
     * Kiểm tra xem ngày có hợp lệ không
     * @param {Date|string|number} date - Ngày cần kiểm tra
     * @returns {boolean} - true nếu hợp lệ, false nếu không
     */
    isValidDate: (date) => {
      if (!date) return false;
      
      const d = new Date(date);
      return !isNaN(d.getTime());
    },
  
    /**
     * Thêm thời gian vào ngày
     * @param {Date|string|number} date - Ngày cần thêm
     * @param {number} amount - Số lượng
     * @param {string} unit - Đơn vị (years, months, days, hours, minutes, seconds)
     * @returns {Date} - Ngày mới
     */
    addTime: (date, amount, unit = 'days') => {
      if (!date) return new Date();
      
      const d = new Date(date);
      if (isNaN(d.getTime())) return new Date();
      
      switch (unit) {
        case 'years':
          d.setFullYear(d.getFullYear() + amount);
          break;
        case 'months':
          d.setMonth(d.getMonth() + amount);
          break;
        case 'days':
          d.setDate(d.getDate() + amount);
          break;
        case 'hours':
          d.setHours(d.getHours() + amount);
          break;
        case 'minutes':
          d.setMinutes(d.getMinutes() + amount);
          break;
        case 'seconds':
          d.setSeconds(d.getSeconds() + amount);
          break;
      }
      
      return d;
    },
  
    /**
     * Format ngày tháng tương đối (ví dụ: "2 giờ trước")
     * @param {Date|string|number} date - Ngày cần format
     * @param {Object} options - Các tùy chọn
     * @returns {string} - Chuỗi ngày tháng tương đối
     */
    formatRelativeTime: (date, options = {}) => {
      if (!date) return '';
      
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      
      const now = new Date();
      const diffMs = now - d;
      
      if (diffMs < 0) {
        // Ngày trong tương lai
        return options.future || 'trong tương lai';
      }
      
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      const diffMonths = Math.floor(diffDays / 30);
      const diffYears = Math.floor(diffDays / 365);
      
      if (diffSecs < 60) {
        return `${diffSecs} giây trước`;
      } else if (diffMins < 60) {
        return `${diffMins} phút trước`;
      } else if (diffHours < 24) {
        return `${diffHours} giờ trước`;
      } else if (diffDays < 30) {
        return `${diffDays} ngày trước`;
      } else if (diffMonths < 12) {
        return `${diffMonths} tháng trước`;
      } else {
        return `${diffYears} năm trước`;
      }
    }
  };
  
  // Các hàm xử lý mảng
  export const arrayUtils = {
    /**
     * Sắp xếp mảng theo thuộc tính
     * @param {Array} arr - Mảng cần sắp xếp
     * @param {string} property - Thuộc tính để sắp xếp
     * @param {string} order - Thứ tự sắp xếp (asc/desc)
     * @returns {Array} - Mảng đã sắp xếp
     */
    sortByProperty: (arr, property, order = 'asc') => {
      if (!arr || !Array.isArray(arr)) return [];
      
      const sortedArr = [...arr];
      
      sortedArr.sort((a, b) => {
        if (a[property] < b[property]) return order === 'asc' ? -1 : 1;
        if (a[property] > b[property]) return order === 'asc' ? 1 : -1;
        return 0;
      });
      
      return sortedArr;
    },
  
    /**
     * Lọc mảng theo điều kiện
     * @param {Array} arr - Mảng cần lọc
     * @param {Object} filters - Các điều kiện lọc
     * @returns {Array} - Mảng đã lọc
     */
    filterByProperties: (arr, filters) => {
      if (!arr || !Array.isArray(arr)) return [];
      if (!filters || Object.keys(filters).length === 0) return arr;
      
      return arr.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          if (value === undefined || value === null) return true;
          
          if (typeof value === 'string') {
            return item[key] && item[key].toString().toLowerCase().includes(value.toLowerCase());
          }
          
          return item[key] === value;
        });
      });
    },
  
    /**
     * Nhóm mảng theo thuộc tính
     * @param {Array} arr - Mảng cần nhóm
     * @param {string} property - Thuộc tính để nhóm
     * @returns {Object} - Object chứa các nhóm
     */
    groupByProperty: (arr, property) => {
      if (!arr || !Array.isArray(arr)) return {};
      
      return arr.reduce((groups, item) => {
        const key = item[property];
        if (!key) return groups;
        
        if (!groups[key]) {
          groups[key] = [];
        }
        
        groups[key].push(item);
        return groups;
      }, {});
    },
  
    /**
     * Loại bỏ các phần tử trùng lặp trong mảng
     * @param {Array} arr - Mảng cần xử lý
     * @param {string} property - Thuộc tính để so sánh (nếu là mảng object)
     * @returns {Array} - Mảng không có phần tử trùng lặp
     */
    removeDuplicates: (arr, property = null) => {
      if (!arr || !Array.isArray(arr)) return [];
      
      if (property) {
        const seen = new Set();
        return arr.filter(item => {
          const key = item[property];
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }
      
      return [...new Set(arr)];
    },
  
    /**
     * Tính tổng các giá trị trong mảng
     * @param {Array} arr - Mảng cần tính tổng
     * @param {string} property - Thuộc tính để tính tổng (nếu là mảng object)
     * @returns {number} - Tổng các giá trị
     */
    sum: (arr, property = null) => {
      if (!arr || !Array.isArray(arr)) return 0;
      
      if (property) {
        return arr.reduce((sum, item) => {
          const value = parseFloat(item[property]);
          return sum + (isNaN(value) ? 0 : value);
        }, 0);
      }
      
      return arr.reduce((sum, value) => {
        const num = parseFloat(value);
        return sum + (isNaN(num) ? 0 : num);
      }, 0);
    },
  
    /**
     * Tìm giá trị lớn nhất trong mảng
     * @param {Array} arr - Mảng cần tìm
     * @param {string} property - Thuộc tính để so sánh (nếu là mảng object)
     * @returns {number} - Giá trị lớn nhất
     */
    max: (arr, property = null) => {
      if (!arr || !Array.isArray(arr) || arr.length === 0) return null;
      
      if (property) {
        return Math.max(...arr.map(item => {
          const value = parseFloat(item[property]);
          return isNaN(value) ? Number.NEGATIVE_INFINITY : value;
        }));
      }
      
      return Math.max(...arr.map(value => {
        const num = parseFloat(value);
        return isNaN(num) ? Number.NEGATIVE_INFINITY : num;
      }));
    },
  
    /**
     * Tìm giá trị nhỏ nhất trong mảng
     * @param {Array} arr - Mảng cần tìm
     * @param {string} property - Thuộc tính để so sánh (nếu là mảng object)
     * @returns {number} - Giá trị nhỏ nhất
     */
    min: (arr, property = null) => {
      if (!arr || !Array.isArray(arr) || arr.length === 0) return null;
      
      if (property) {
        return Math.min(...arr.map(item => {
          const value = parseFloat(item[property]);
          return isNaN(value) ? Number.POSITIVE_INFINITY : value;
        }));
      }
      
      return Math.min(...arr.map(value => {
        const num = parseFloat(value);
        return isNaN(num) ? Number.POSITIVE_INFINITY : num;
      }));
    }
  };
  
  // Các hàm xử lý object
  export const objectUtils = {
    /**
     * Kiểm tra object có rỗng không
     * @param {Object} obj - Object cần kiểm tra
     * @returns {boolean} - true nếu rỗng, false nếu không
     */
    isEmpty: (obj) => {
      if (!obj) return true;
      return Object.keys(obj).length === 0;
    },
  
    /**
     * Lấy giá trị từ object theo path
     * @param {Object} obj - Object cần lấy giá trị
     * @param {string} path - Path đến giá trị (ví dụ: "user.profile.name")
     * @param {any} defaultValue - Giá trị mặc định nếu không tìm thấy
     * @returns {any} - Giá trị tìm được hoặc defaultValue
     */
    getValueByPath: (obj, path, defaultValue = null) => {
      if (!obj || !path) return defaultValue;
      
      const keys = path.split('.');
      let result = obj;
      
      for (const key of keys) {
        if (result === null || result === undefined || !result.hasOwnProperty(key)) {
          return defaultValue;
        }
        
        result = result[key];
      }
      
      return result === undefined ? defaultValue : result;
    },
  
    /**
     * Đặt giá trị cho object theo path
     * @param {Object} obj - Object cần đặt giá trị
     * @param {string} path - Path đến giá trị (ví dụ: "user.profile.name")
     * @param {any} value - Giá trị cần đặt
     * @returns {Object} - Object đã được cập nhật
     */
    setValueByPath: (obj, path, value) => {
      if (!obj || !path) return obj;
      
      const keys = path.split('.');
      const lastKey = keys.pop();
      let current = obj;
      
      for (const key of keys) {
        if (current[key] === undefined || current[key] === null || typeof current[key] !== 'object') {
          current[key] = {};
        }
        
        current = current[key];
      }
      
      current[lastKey] = value;
      return obj;
    },
  
    /**
     * Loại bỏ các thuộc tính có giá trị null hoặc undefined
     * @param {Object} obj - Object cần xử lý
     * @returns {Object} - Object đã được xử lý
     */
    removeNullProperties: (obj) => {
      if (!obj) return {};
      
      const result = {};
      
      Object.entries(obj).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          result[key] = value;
        }
      });
      
      return result;
    },
  
    /**
     * Chuyển đổi object thành query string
     * @param {Object} obj - Object cần chuyển đổi
     * @returns {string} - Query string
     */
    toQueryString: (obj) => {
      if (!obj) return '';
      
      return Object.entries(obj)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
          }
          
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .join('&');
    },
  
    /**
     * Parse query string thành object
     * @param {string} queryString - Query string cần parse
     * @returns {Object} - Object
     */
    parseQueryString: (queryString) => {
      if (!queryString) return {};
      
      const query = queryString.startsWith('?') ? queryString.substring(1) : queryString;
      const result = {};
      
      query.split('&').forEach(part => {
        if (!part) return;
        
        const [key, value] = part.split('=');
        const decodedKey = decodeURIComponent(key);
        const decodedValue = decodeURIComponent(value || '');
        
        if (result[decodedKey]) {
          if (Array.isArray(result[decodedKey])) {
            result[decodedKey].push(decodedValue);
          } else {
            result[decodedKey] = [result[decodedKey], decodedValue];
          }
        } else {
          result[decodedKey] = decodedValue;
        }
      });
      
      return result;
    }
  };
  
  // Các hàm xác thực
  export const validationUtils = {
    /**
     * Kiểm tra email có hợp lệ không
     * @param {string} email - Email cần kiểm tra
     * @returns {boolean} - true nếu hợp lệ, false nếu không
     */
    isValidEmail: (email) => {
      if (!email) return false;
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
  
    /**
     * Kiểm tra số điện thoại có hợp lệ không
     * @param {string} phone - Số điện thoại cần kiểm tra
     * @returns {boolean} - true nếu hợp lệ, false nếu không
     */
    isValidPhone: (phone) => {
      if (!phone) return false;
      
      const phoneRegex = /^[0-9]{10,11}$/;
      return phoneRegex.test(phone);
    },
  
    /**
     * Kiểm tra mật khẩu có đủ mạnh không
     * @param {string} password - Mật khẩu cần kiểm tra
     * @param {Object} options - Các tùy chọn
     * @returns {boolean} - true nếu đủ mạnh, false nếu không
     */
    isStrongPassword: (password, options = {}) => {
      if (!password) return false;
      
      const {
        minLength = 8,
        requireUppercase = true,
        requireLowercase = true,
        requireNumbers = true,
        requireSpecialChars = true
      } = options;
      
      if (password.length < minLength) return false;
      
      if (requireUppercase && !/[A-Z]/.test(password)) return false;
      if (requireLowercase && !/[a-z]/.test(password)) return false;
      if (requireNumbers && !/[0-9]/.test(password)) return false;
      if (requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return false;
      
      return true;
    },
  
    /**
     * Kiểm tra URL có hợp lệ không
     * @param {string} url - URL cần kiểm tra
     * @returns {boolean} - true nếu hợp lệ, false nếu không
     */
    isValidUrl: (url) => {
      if (!url) return false;
      
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    },
  
    /**
     * Kiểm tra chuỗi có phải là JSON hợp lệ không
     * @param {string} str - Chuỗi cần kiểm tra
     * @returns {boolean} - true nếu hợp lệ, false nếu không
     */
    isValidJson: (str) => {
      if (!str) return false;
      
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        return false;
      }
    }
  };
  
  // Các hàm xử lý DOM
  export const domUtils = {
    /**
     * Lấy element theo selector
     * @param {string} selector - CSS selector
     * @returns {Element|null} - Element hoặc null nếu không tìm thấy
     */
    getElement: (selector) => {
      if (typeof document === 'undefined') return null;
      return document.querySelector(selector);
    },
  
    /**
     * Lấy tất cả element theo selector
     * @param {string} selector - CSS selector
     * @returns {NodeList|null} - NodeList hoặc null nếu không tìm thấy
     */
    getAllElements: (selector) => {
      if (typeof document === 'undefined') return null;
      return document.querySelectorAll(selector);
    },
  
    /**
     * Thêm class cho element
     * @param {Element} element - Element cần thêm class
     * @param {string} className - Class cần thêm
     */
    addClass: (element, className) => {
      if (!element || !className) return;
      element.classList.add(className);
    },
  
    /**
     * Xóa class khỏi element
     * @param {Element} element - Element cần xóa class
     * @param {string} className - Class cần xóa
     */
    removeClass: (element, className) => {
      if (!element || !className) return;
      element.classList.remove(className);
    },
  
    /**
     * Toggle class cho element
     * @param {Element} element - Element cần toggle class
     * @param {string} className - Class cần toggle
     */
    toggleClass: (element, className) => {
      if (!element || !className) return;
      element.classList.toggle(className);
    },
  
        /**
     * Kiểm tra element có class không
     * @param {Element} element - Element cần kiểm tra
     * @param {string} className - Class cần kiểm tra
     * @returns {boolean} - true nếu có class, false nếu không
     */
        hasClass: (element, className) => {
            if (!element || !className) return false;
            return element.classList.contains(className);
          },
      
          /**
           * Thêm event listener cho element
           * @param {Element} element - Element cần thêm event
           * @param {string} eventType - Loại event
           * @param {Function} callback - Hàm callback
           * @param {boolean} useCapture - Sử dụng capture phase
           */
          addEvent: (element, eventType, callback, useCapture = false) => {
            if (!element || !eventType || !callback) return;
            element.addEventListener(eventType, callback, useCapture);
          },
      
          /**
           * Xóa event listener khỏi element
           * @param {Element} element - Element cần xóa event
           * @param {string} eventType - Loại event
           * @param {Function} callback - Hàm callback
           * @param {boolean} useCapture - Sử dụng capture phase
           */
          removeEvent: (element, eventType, callback, useCapture = false) => {
            if (!element || !eventType || !callback) return;
            element.removeEventListener(eventType, callback, useCapture);
          },
      
          /**
           * Lấy giá trị của input
           * @param {string} selector - CSS selector
           * @returns {string} - Giá trị của input
           */
          getInputValue: (selector) => {
            const element = domUtils.getElement(selector);
            if (!element) return '';
            return element.value;
          },
      
          /**
           * Đặt giá trị cho input
           * @param {string} selector - CSS selector
           * @param {string} value - Giá trị cần đặt
           */
          setInputValue: (selector, value) => {
            const element = domUtils.getElement(selector);
            if (!element) return;
            element.value = value;
          },
      
          /**
           * Tạo element mới
           * @param {string} tagName - Tên thẻ
           * @param {Object} attributes - Các thuộc tính
           * @param {string} innerHTML - Nội dung HTML
           * @returns {Element} - Element mới
           */
          createElement: (tagName, attributes = {}, innerHTML = '') => {
            if (typeof document === 'undefined' || !tagName) return null;
            
            const element = document.createElement(tagName);
            
            Object.entries(attributes).forEach(([key, value]) => {
              element.setAttribute(key, value);
            });
            
            if (innerHTML) {
              element.innerHTML = innerHTML;
            }
            
            return element;
          },
      
          /**
           * Thêm element vào parent
           * @param {Element} parent - Element cha
           * @param {Element} child - Element con
           */
          appendChild: (parent, child) => {
            if (!parent || !child) return;
            parent.appendChild(child);
          },
      
          /**
           * Xóa element
           * @param {Element} element - Element cần xóa
           */
          removeElement: (element) => {
            if (!element || !element.parentNode) return;
            element.parentNode.removeChild(element);
          }
        };
      
      // Các hàm xử lý storage
      export const storageUtils = {
        /**
         * Lưu dữ liệu vào localStorage
         * @param {string} key - Khóa
         * @param {any} value - Giá trị
         */
        setLocalStorage: (key, value) => {
          if (typeof localStorage === 'undefined' || !key) return;
          
          try {
            const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
            localStorage.setItem(key, serializedValue);
          } catch (error) {
            console.error('Error saving to localStorage:', error);
          }
        },
      
        /**
         * Lấy dữ liệu từ localStorage
         * @param {string} key - Khóa
         * @param {any} defaultValue - Giá trị mặc định
         * @returns {any} - Giá trị lấy được hoặc defaultValue
         */
        getLocalStorage: (key, defaultValue = null) => {
          if (typeof localStorage === 'undefined' || !key) return defaultValue;
          
          try {
            const value = localStorage.getItem(key);
            if (value === null) return defaultValue;
            
            try {
              return JSON.parse(value);
            } catch {
              return value;
            }
          } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
          }
        },
      
        /**
         * Xóa dữ liệu khỏi localStorage
         * @param {string} key - Khóa
         */
        removeLocalStorage: (key) => {
          if (typeof localStorage === 'undefined' || !key) return;
          
          try {
            localStorage.removeItem(key);
          } catch (error) {
            console.error('Error removing from localStorage:', error);
          }
        },
      
        /**
         * Lưu dữ liệu vào sessionStorage
         * @param {string} key - Khóa
         * @param {any} value - Giá trị
         */
        setSessionStorage: (key, value) => {
          if (typeof sessionStorage === 'undefined' || !key) return;
          
          try {
            const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
            sessionStorage.setItem(key, serializedValue);
          } catch (error) {
            console.error('Error saving to sessionStorage:', error);
          }
        },
      
        /**
         * Lấy dữ liệu từ sessionStorage
         * @param {string} key - Khóa
         * @param {any} defaultValue - Giá trị mặc định
         * @returns {any} - Giá trị lấy được hoặc defaultValue
         */
        getSessionStorage: (key, defaultValue = null) => {
          if (typeof sessionStorage === 'undefined' || !key) return defaultValue;
          
          try {
            const value = sessionStorage.getItem(key);
            if (value === null) return defaultValue;
            
            try {
              return JSON.parse(value);
            } catch {
              return value;
            }
          } catch (error) {
            console.error('Error reading from sessionStorage:', error);
            return defaultValue;
          }
        },
      
        /**
         * Xóa dữ liệu khỏi sessionStorage
         * @param {string} key - Khóa
         */
        removeSessionStorage: (key) => {
          if (typeof sessionStorage === 'undefined' || !key) return;
          
          try {
            sessionStorage.removeItem(key);
          } catch (error) {
            console.error('Error removing from sessionStorage:', error);
          }
        },
      
        /**
         * Lưu dữ liệu vào cookie
         * @param {string} key - Khóa
         * @param {string} value - Giá trị
         * @param {Object} options - Các tùy chọn
         */
        setCookie: (key, value, options = {}) => {
          if (typeof document === 'undefined' || !key) return;
          
          const {
            expires = 30, // Số ngày
            path = '/',
            domain = '',
            secure = false,
            sameSite = 'Lax'
          } = options;
          
          const date = new Date();
          date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
          
          let cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
          cookie += `; expires=${date.toUTCString()}`;
          cookie += `; path=${path}`;
          
          if (domain) {
            cookie += `; domain=${domain}`;
          }
          
          if (secure) {
            cookie += '; secure';
          }
          
          cookie += `; samesite=${sameSite}`;
          
          document.cookie = cookie;
        },
      
        /**
         * Lấy dữ liệu từ cookie
         * @param {string} key - Khóa
         * @returns {string|null} - Giá trị cookie hoặc null
         */
        getCookie: (key) => {
          if (typeof document === 'undefined' || !key) return null;
          
          const name = `${encodeURIComponent(key)}=`;
          const cookies = document.cookie.split(';');
          
          for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            
            if (cookie.indexOf(name) === 0) {
              return decodeURIComponent(cookie.substring(name.length, cookie.length));
            }
          }
          
          return null;
        },
      
        /**
         * Xóa cookie
         * @param {string} key - Khóa
         * @param {Object} options - Các tùy chọn
         */
        removeCookie: (key, options = {}) => {
          if (typeof document === 'undefined' || !key) return;
          
          const {
            path = '/',
            domain = ''
          } = options;
          
          storageUtils.setCookie(key, '', {
            expires: -1,
            path,
            domain
          });
        }
      };
      
      // Các hàm xử lý API
      export const apiUtils = {
        /**
         * Gửi request fetch
         * @param {string} url - URL
         * @param {Object} options - Các tùy chọn
         * @returns {Promise} - Promise kết quả
         */
        fetchRequest: async (url, options = {}) => {
          if (!url) throw new Error('URL is required');
          
          const {
            method = 'GET',
            headers = {},
            body = null,
            credentials = 'same-origin',
            timeout = 30000,
            responseType = 'json'
          } = options;
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);
          
          try {
            const response = await fetch(url, {
              method,
              headers: {
                'Content-Type': 'application/json',
                ...headers
              },
              body: body ? JSON.stringify(body) : null,
              credentials,
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            if (responseType === 'json') {
              return await response.json();
            } else if (responseType === 'text') {
              return await response.text();
            } else if (responseType === 'blob') {
              return await response.blob();
            } else if (responseType === 'arrayBuffer') {
              return await response.arrayBuffer();
            }
            
            return await response.json();
          } catch (error) {
            clearTimeout(timeoutId);
            throw error;
          }
        },
      
        /**
         * Gửi GET request
         * @param {string} url - URL
         * @param {Object} params - Query params
         * @param {Object} options - Các tùy chọn
         * @returns {Promise} - Promise kết quả
         */
        get: async (url, params = {}, options = {}) => {
          if (!url) throw new Error('URL is required');
          
          const queryString = objectUtils.toQueryString(params);
          const fullUrl = queryString ? `${url}?${queryString}` : url;
          
          return apiUtils.fetchRequest(fullUrl, {
            ...options,
            method: 'GET'
          });
        },
      
        /**
         * Gửi POST request
         * @param {string} url - URL
         * @param {Object} data - Dữ liệu
         * @param {Object} options - Các tùy chọn
         * @returns {Promise} - Promise kết quả
         */
        post: async (url, data = {}, options = {}) => {
          if (!url) throw new Error('URL is required');
          
          return apiUtils.fetchRequest(url, {
            ...options,
            method: 'POST',
            body: data
          });
        },
      
        /**
         * Gửi PUT request
         * @param {string} url - URL
         * @param {Object} data - Dữ liệu
         * @param {Object} options - Các tùy chọn
         * @returns {Promise} - Promise kết quả
         */
        put: async (url, data = {}, options = {}) => {
          if (!url) throw new Error('URL is required');
          
          return apiUtils.fetchRequest(url, {
            ...options,
            method: 'PUT',
            body: data
          });
        },
      
        /**
         * Gửi DELETE request
         * @param {string} url - URL
         * @param {Object} options - Các tùy chọn
         * @returns {Promise} - Promise kết quả
         */
        delete: async (url, options = {}) => {
          if (!url) throw new Error('URL is required');
          
          return apiUtils.fetchRequest(url, {
            ...options,
            method: 'DELETE'
          });
        },
      
        /**
         * Xử lý lỗi API
         * @param {Error} error - Lỗi
         * @returns {Object} - Thông tin lỗi
         */
        handleError: (error) => {
          if (!error) return { message: 'Unknown error' };
          
          if (error.name === 'AbortError') {
            return { message: 'Request timeout', code: 'TIMEOUT' };
          }
          
          if (error.response) {
            // Lỗi từ server
            const { status } = error.response;
            
            if (status === 401) {
              return { message: 'Unauthorized', code: 'UNAUTHORIZED' };
            } else if (status === 403) {
              return { message: 'Forbidden', code: 'FORBIDDEN' };
            } else if (status === 404) {
              return { message: 'Not found', code: 'NOT_FOUND' };
            } else if (status === 500) {
              return { message: 'Server error', code: 'SERVER_ERROR' };
            }
            
            return { message: `HTTP error ${status}`, code: 'HTTP_ERROR' };
          }
          
          if (error.request) {
            // Không nhận được response
            return { message: 'No response from server', code: 'NO_RESPONSE' };
          }
          
          // Lỗi khác
          return { message: error.message || 'Unknown error', code: 'UNKNOWN' };
        }
      };
      
      // Các hàm xử lý form
      export const formUtils = {
        /**
         * Lấy dữ liệu từ form
         * @param {HTMLFormElement|string} form - Form element hoặc selector
         * @returns {Object} - Dữ liệu form
         */
        getFormData: (form) => {
          let formElement;
          
          if (typeof form === 'string') {
            formElement = document.querySelector(form);
          } else {
            formElement = form;
          }
          
          if (!formElement || !formElement.elements) {
            return {};
          }
          
          const formData = {};
          const elements = formElement.elements;
          
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const name = element.name;
            
            if (!name || element.disabled) continue;
            
            if (element.type === 'checkbox') {
              if (element.checked) {
                if (formData[name] === undefined) {
                  formData[name] = element.value;
                } else if (Array.isArray(formData[name])) {
                  formData[name].push(element.value);
                } else {
                  formData[name] = [formData[name], element.value];
                }
              }
            } else if (element.type === 'radio') {
              if (element.checked) {
                formData[name] = element.value;
              }
            } else if (element.type !== 'button' && element.type !== 'submit' && element.type !== 'reset') {
              formData[name] = element.value;
            }
          }
          
          return formData;
        },
      
        /**
         * Đặt dữ liệu cho form
         * @param {HTMLFormElement|string} form - Form element hoặc selector
         * @param {Object} data - Dữ liệu cần đặt
         */
        setFormData: (form, data) => {
          if (!data) return;
          
          let formElement;
          
          if (typeof form === 'string') {
            formElement = document.querySelector(form);
          } else {
            formElement = form;
          }
          
          if (!formElement || !formElement.elements) {
            return;
          }
          
          const elements = formElement.elements;
          
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const name = element.name;
            
            if (!name || element.disabled || !(name in data)) continue;
            
            const value = data[name];
            
            if (element.type === 'checkbox') {
              if (Array.isArray(value)) {
                element.checked = value.includes(element.value);
              } else {
                element.checked = element.value === value;
              }
            } else if (element.type === 'radio') {
              element.checked = element.value === value;
            } else if (element.type !== 'button' && element.type !== 'submit' && element.type !== 'reset') {
              element.value = value;
            }
          }
        },
      
        /**
         * Xác thực form
         * @param {HTMLFormElement|string} form - Form element hoặc selector
         * @param {Object} rules - Các quy tắc xác thực
         * @returns {Object} - Kết quả xác thực
         */
        validateForm: (form, rules) => {
          if (!rules) return { isValid: true, errors: {} };
          
          let formElement;
          
          if (typeof form === 'string') {
            formElement = document.querySelector(form);
          } else {
            formElement = form;
          }
          
          if (!formElement || !formElement.elements) {
            return { isValid: false, errors: { form: 'Form not found' } };
          }
          
          const formData = formUtils.getFormData(formElement);
          const errors = {};
          
          Object.entries(rules).forEach(([field, fieldRules]) => {
            const value = formData[field];
            
            if (fieldRules.required && (!value || value.trim() === '')) {
              errors[field] = fieldRules.requiredMessage || 'This field is required';
            } else if (value) {
              if (fieldRules.email && !validationUtils.isValidEmail(value)) {
                errors[field] = fieldRules.emailMessage || 'Invalid email address';
              }
              
              if (fieldRules.phone && !validationUtils.isValidPhone(value)) {
                errors[field] = fieldRules.phoneMessage || 'Invalid phone number';
              }
              
              if (fieldRules.minLength && value.length < fieldRules.minLength) {
                errors[field] = fieldRules.minLengthMessage || `Minimum length is ${fieldRules.minLength}`;
              }
              
              if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
                errors[field] = fieldRules.maxLengthMessage || `Maximum length is ${fieldRules.maxLength}`;
              }
              
              if (fieldRules.pattern && !new RegExp(fieldRules.pattern).test(value)) {
                errors[field] = fieldRules.patternMessage || 'Invalid format';
              }
              
              if (fieldRules.custom && typeof fieldRules.custom === 'function') {
                const customError = fieldRules.custom(value, formData);
                if (customError) {
                  errors[field] = customError;
                }
              }
            }
          });
          
          return {
            isValid: Object.keys(errors).length === 0,
            errors
          };
        },
      
        /**
         * Hiển thị lỗi form
         * @param {HTMLFormElement|string} form - Form element hoặc selector
         * @param {Object} errors - Các lỗi
         * @param {Object} options - Các tùy chọn
         */
        showFormErrors: (form, errors, options = {}) => {
          if (!errors || Object.keys(errors).length === 0) return;
          
          let formElement;
          
          if (typeof form === 'string') {
            formElement = document.querySelector(form);
          } else {
            formElement = form;
          }
          
          if (!formElement) return;
          
          const {
            errorClass = 'error',
            errorMessageClass = 'error-message',
            errorMessageTag = 'div'
          } = options;
          
          // Xóa các thông báo lỗi cũ
          const oldErrorMessages = formElement.querySelectorAll(`.${errorMessageClass}`);
          oldErrorMessages.forEach(element => {
            element.parentNode.removeChild(element);
          });
          
          // Xóa class lỗi cũ
          const oldErrorFields = formElement.querySelectorAll(`.${errorClass}`);
          oldErrorFields.forEach(element => {
            element.classList.remove(errorClass);
          });
          
          // Hiển thị lỗi mới
          Object.entries(errors).forEach(([field, message]) => {
            const fieldElement = formElement.querySelector(`[name="${field}"]`);
            
            if (fieldElement) {
              // Thêm class lỗi
              fieldElement.classList.add(errorClass);
              
              // Tạo thông báo lỗi
              const errorMessage = document.createElement(errorMessageTag);
              errorMessage.className = errorMessageClass;
              errorMessage.textContent = message;
              
              // Thêm thông báo lỗi vào sau field
              fieldElement.parentNode.insertBefore(errorMessage, fieldElement.nextSibling);
            }
          });
        },
      
        /**
         * Reset form
         * @param {HTMLFormElement|string} form - Form element hoặc selector
         */
        resetForm: (form) => {
          let formElement;
          
          if (typeof form === 'string') {
            formElement = document.querySelector(form);
          } else {
            formElement = form;
          }
          
          if (!formElement) return;
          
          formElement.reset();
        }
      };
      
      // Các hàm xử lý URL
      export const urlUtils = {
        /**
         * Lấy query params từ URL
         * @param {string} url - URL (mặc định là window.location.href)
         * @returns {Object} - Query params
         */
        getQueryParams: (url) => {
          if (typeof window === 'undefined') return {};
          
          const urlString = url || (typeof window !== 'undefined' ? window.location.href : '');
          if (!urlString) return {};
          
          try {
            const urlObj = new URL(urlString);
            return objectUtils.parseQueryString(urlObj.search);
          } catch (error) {
            console.error('Error parsing URL:', error);
            return {};
          }
        },
      
        /**
         * Thêm query params vào URL
         * @param {string} url - URL
         * @param {Object} params - Query params
         * @returns {string} - URL mới
         */
        addQueryParams: (url, params) => {
          if (!url || !params) return url;
          
          try {
            const urlObj = new URL(url);
            const searchParams = new URLSearchParams(urlObj.search);
            
            Object.entries(params).forEach(([key, value]) => {
              if (value !== null && value !== undefined) {
                searchParams.set(key, value);
              }
            });
            
            urlObj.search = searchParams.toString();
            return urlObj.toString();
          } catch (error) {
            console.error('Error adding query params:', error);
            
            // Fallback nếu URL không hợp lệ
            const queryString = objectUtils.toQueryString(params);
            const hasQuery = url.includes('?');
            
            if (!queryString) return url;
            
            if (hasQuery) {
              return `${url}&${queryString}`;
            } else {
              return `${url}?${queryString}`;
            }
          }
        },
      
        /**
         * Xóa query params khỏi URL
         * @param {string} url - URL
         * @param {Array} paramsToRemove - Các params cần xóa
         * @returns {string} - URL mới
         */
        removeQueryParams: (url, paramsToRemove) => {
          if (!url || !paramsToRemove || !Array.isArray(paramsToRemove)) return url;
          
          try {
            const urlObj = new URL(url);
            const searchParams = new URLSearchParams(urlObj.search);
            
            paramsToRemove.forEach(param => {
              searchParams.delete(param);
            });
            
            urlObj.search = searchParams.toString();
            return urlObj.toString();
          } catch (error) {
            console.error('Error removing query params:', error);
            return url;
          }
        },
      
        /**
         * Lấy path từ URL
         * @param {string} url - URL (mặc định là window.location.href)
         * @returns {string} - Path
         */
        getPath: (url) => {
          if (typeof window === 'undefined') return '';
          
          const urlString = url || (typeof window !== 'undefined' ? window.location.href : '');
          if (!urlString) return '';
          
          try {
            const urlObj = new URL(urlString);
            return urlObj.pathname;
          } catch (error) {
            console.error('Error getting path:', error);
            return '';
          }
        },
      
        /**
         * Kiểm tra URL có match với pattern không
         * @param {string} url - URL cần kiểm tra
         * @param {string} pattern - Pattern (có thể chứa wildcards *)
         * @returns {boolean} - true nếu match, false nếu không
         */
        matchUrl: (url, pattern) => {
          if (!url || !pattern) return false;
          
          try {

            const urlObj = new URL(url);
            const patternObj = new URL(pattern.replace(/\*/g, '.*'), urlObj.origin);
            
            // Chuyển đổi pattern thành regex
            const patternRegex = new RegExp('^' + patternObj.pathname.replace(/\*/g, '.*') + '$');
            
            return patternRegex.test(urlObj.pathname);
          } catch (error) {
            console.error('Error matching URL:', error);
            return false;
          }
        },
        
        /**
         * Tạo URL tuyệt đối từ URL tương đối
         * @param {string} relativeUrl - URL tương đối
         * @returns {string} - URL tuyệt đối
         */
        getAbsoluteUrl: (relativeUrl) => {
          if (!relativeUrl) return '';
          
          if (typeof window === 'undefined') return relativeUrl;
          
          try {
            const base = window.location.origin;
            return new URL(relativeUrl, base).href;
          } catch (error) {
            console.error('Error getting absolute URL:', error);
            return relativeUrl;
          }
        },
        
        /**
         * Kiểm tra URL có phải là URL nội bộ không
         * @param {string} url - URL cần kiểm tra
         * @returns {boolean} - true nếu là URL nội bộ, false nếu không
         */
        isInternalUrl: (url) => {
          if (!url) return false;
          
          if (typeof window === 'undefined') return false;
          
          // URL tương đối là URL nội bộ
          if (url.startsWith('/') && !url.startsWith('//')) return true;
          
          try {
            const urlObj = new URL(url);
            const currentOrigin = window.location.origin;
            
            return urlObj.origin === currentOrigin;
          } catch (error) {
            // Nếu không parse được URL, coi như là URL tương đối (nội bộ)
            return true;
          }
        }
      };
      
      // Các hàm xử lý file
      export const fileUtils = {
        /**
         * Lấy extension của file
         * @param {string} filename - Tên file
         * @returns {string} - Extension
         */
        getFileExtension: (filename) => {
          if (!filename) return '';
          
          const parts = filename.split('.');
          if (parts.length === 1) return '';
          
          return parts[parts.length - 1].toLowerCase();
        },
        
        /**
         * Kiểm tra file có phải là image không
         * @param {string} filename - Tên file
         * @returns {boolean} - true nếu là image, false nếu không
         */
        isImageFile: (filename) => {
          if (!filename) return false;
          
          const ext = fileUtils.getFileExtension(filename);
          const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
          
          return imageExtensions.includes(ext);
        },
        
        /**
         * Chuyển đổi kích thước file sang dạng đọc được
         * @param {number} bytes - Kích thước file (bytes)
         * @param {number} decimals - Số chữ số thập phân
         * @returns {string} - Kích thước đọc được
         */
        formatFileSize: (bytes, decimals = 2) => {
          if (bytes === 0) return '0 Bytes';
          
          const k = 1024;
          const dm = decimals < 0 ? 0 : decimals;
          const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
          
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          
          return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        },
        
        /**
         * Tạo object URL từ file
         * @param {File} file - File
         * @returns {string} - Object URL
         */
        createObjectURL: (file) => {
          if (!file || typeof window === 'undefined') return '';
          
          try {
            return URL.createObjectURL(file);
          } catch (error) {
            console.error('Error creating object URL:', error);
            return '';
          }
        },
        
        /**
         * Giải phóng object URL
         * @param {string} url - Object URL
         */
        revokeObjectURL: (url) => {
          if (!url || typeof window === 'undefined') return;
          
          try {
            URL.revokeObjectURL(url);
          } catch (error) {
            console.error('Error revoking object URL:', error);
          }
        },
        
        /**
         * Đọc file dưới dạng text
         * @param {File} file - File
         * @returns {Promise<string>} - Nội dung file
         */
        readAsText: (file) => {
          if (!file) return Promise.reject(new Error('File is required'));
          
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
              resolve(event.target.result);
            };
            
            reader.onerror = (error) => {
              reject(error);
            };
            
            reader.readAsText(file);
          });
        },
        
        /**
         * Đọc file dưới dạng data URL
         * @param {File} file - File
         * @returns {Promise<string>} - Data URL
         */
        readAsDataURL: (file) => {
          if (!file) return Promise.reject(new Error('File is required'));
          
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
              resolve(event.target.result);
            };
            
            reader.onerror = (error) => {
              reject(error);
            };
            
            reader.readAsDataURL(file);
          });
        }
      };
      
      // Các hàm xử lý device
      export const deviceUtils = {
        /**
         * Kiểm tra thiết bị có phải là mobile không
         * @returns {boolean} - true nếu là mobile, false nếu không
         */
        isMobile: () => {
          if (typeof window === 'undefined' || !window.navigator) return false;
          
          const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;
          
          const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
          
          return mobileRegex.test(userAgent);
        },
        
        /**
         * Kiểm tra thiết bị có phải là tablet không
         * @returns {boolean} - true nếu là tablet, false nếu không
         */
        isTablet: () => {
          if (typeof window === 'undefined' || !window.navigator) return false;
          
          const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;
          
          const tabletRegex = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i;
          
          return tabletRegex.test(userAgent);
        },
        
        /**
         * Lấy tên trình duyệt
         * @returns {string} - Tên trình duyệt
         */
        getBrowserName: () => {
          if (typeof window === 'undefined' || !window.navigator) return 'unknown';
          
          const userAgent = window.navigator.userAgent;
          
          if (userAgent.indexOf('Firefox') > -1) {
            return 'Firefox';
          } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
            return 'Opera';
          } else if (userAgent.indexOf('Trident') > -1) {
            return 'Internet Explorer';
          } else if (userAgent.indexOf('Edge') > -1) {
            return 'Edge';
          } else if (userAgent.indexOf('Chrome') > -1) {
            return 'Chrome';
          } else if (userAgent.indexOf('Safari') > -1) {
            return 'Safari';
          } else {
            return 'unknown';
          }
        },
        
        /**
         * Lấy tên hệ điều hành
         * @returns {string} - Tên hệ điều hành
         */
        getOSName: () => {
          if (typeof window === 'undefined' || !window.navigator) return 'unknown';
          
          const userAgent = window.navigator.userAgent;
          
          if (userAgent.indexOf('Windows') > -1) {
            return 'Windows';
          } else if (userAgent.indexOf('Mac') > -1) {
            return 'MacOS';
          } else if (userAgent.indexOf('Linux') > -1) {
            return 'Linux';
          } else if (userAgent.indexOf('Android') > -1) {
            return 'Android';
          } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
            return 'iOS';
          } else {
            return 'unknown';
          }
        },
        
        /**
         * Kiểm tra thiết bị có hỗ trợ touch không
         * @returns {boolean} - true nếu hỗ trợ, false nếu không
         */
        isTouchDevice: () => {
          if (typeof window === 'undefined') return false;
          
          return (('ontouchstart' in window) ||
                 (navigator.maxTouchPoints > 0) ||
                 (navigator.msMaxTouchPoints > 0));
        }
      };
      
      // Các hàm xử lý performance
      export const performanceUtils = {
        /**
         * Đo thời gian thực thi hàm
         * @param {Function} fn - Hàm cần đo
         * @param {...any} args - Các tham số của hàm
         * @returns {Object} - Kết quả và thời gian thực thi
         */
        measureExecutionTime: (fn, ...args) => {
          if (typeof fn !== 'function') {
            throw new Error('First argument must be a function');
          }
          
          const start = performance.now();
          const result = fn(...args);
          const end = performance.now();
          
          return {
            result,
            executionTime: end - start
          };
        },
        
        /**
         * Debounce hàm
         * @param {Function} fn - Hàm cần debounce
         * @param {number} delay - Thời gian delay (ms)
         * @returns {Function} - Hàm đã được debounce
         */
        debounce: (fn, delay) => {
          if (typeof fn !== 'function') {
            throw new Error('First argument must be a function');
          }
          
          let timeoutId;
          
          return function(...args) {
            const context = this;
            
            clearTimeout(timeoutId);
            
            timeoutId = setTimeout(() => {
              fn.apply(context, args);
            }, delay);
          };
        },
        
        /**
         * Throttle hàm
         * @param {Function} fn - Hàm cần throttle
         * @param {number} limit - Thời gian giới hạn (ms)
         * @returns {Function} - Hàm đã được throttle
         */
        throttle: (fn, limit) => {
          if (typeof fn !== 'function') {
            throw new Error('First argument must be a function');
          }
          
          let waiting = false;
          
          return function(...args) {
            const context = this;
            
            if (!waiting) {
              fn.apply(context, args);
              waiting = true;
              
              setTimeout(() => {
                waiting = false;
              }, limit);
            }
          };
        },
        
        /**
         * Memoize hàm (cache kết quả)
         * @param {Function} fn - Hàm cần memoize
         * @returns {Function} - Hàm đã được memoize
         */
        memoize: (fn) => {
          if (typeof fn !== 'function') {
            throw new Error('First argument must be a function');
          }
          
          const cache = new Map();
          
          return function(...args) {
            const key = JSON.stringify(args);
            
            if (cache.has(key)) {
              return cache.get(key);
            }
            
            const result = fn.apply(this, args);
            cache.set(key, result);
            
            return result;
          };
        }
      };
      
      // Các hàm xử lý event
      export const eventUtils = {
        /**
         * Tạo và dispatch custom event
         * @param {string} eventName - Tên event
         * @param {Object} detail - Dữ liệu chi tiết
         * @param {Element} element - Element để dispatch (mặc định là window)
         */
        dispatchCustomEvent: (eventName, detail = {}, element = null) => {
          if (!eventName || typeof window === 'undefined') return;
          
          const target = element || window;
          const event = new CustomEvent(eventName, {
            detail,
            bubbles: true,
            cancelable: true
          });
          
          target.dispatchEvent(event);
        },
        
        /**
         * Lắng nghe custom event
         * @param {string} eventName - Tên event
         * @param {Function} callback - Hàm callback
         * @param {Element} element - Element để lắng nghe (mặc định là window)
         * @returns {Function} - Hàm để remove event listener
         */
        listenCustomEvent: (eventName, callback, element = null) => {
          if (!eventName || !callback || typeof window === 'undefined') {
            return () => {};
          }
          
          const target = element || window;
          
          const handler = (event) => {
            callback(event.detail, event);
          };
          
          target.addEventListener(eventName, handler);
          
          return () => {
            target.removeEventListener(eventName, handler);
          };
        },
        
        /**
         * Lắng nghe event một lần
         * @param {Element} element - Element để lắng nghe
         * @param {string} eventName - Tên event
         * @param {Function} callback - Hàm callback
         */
        listenOnce: (element, eventName, callback) => {
          if (!element || !eventName || !callback) return;
          
          const handler = (event) => {
            callback(event);
            element.removeEventListener(eventName, handler);
          };
          
          element.addEventListener(eventName, handler);
        },
        
        /**
         * Lắng nghe nhiều event
         * @param {Element} element - Element để lắng nghe
         * @param {Array} events - Mảng các tên event
         * @param {Function} callback - Hàm callback
         * @returns {Function} - Hàm để remove tất cả event listener
         */
        listenMultiple: (element, events, callback) => {
          if (!element || !events || !Array.isArray(events) || !callback) {
            return () => {};
          }
          
          events.forEach(eventName => {
            element.addEventListener(eventName, callback);
          });
          
          return () => {
            events.forEach(eventName => {
              element.removeEventListener(eventName, callback);
            });
          };
        }
      };
      
      // Các hàm xử lý animation
      export const animationUtils = {
        /**
         * Tạo animation với requestAnimationFrame
         * @param {Function} callback - Hàm callback cho mỗi frame
         * @param {number} duration - Thời gian (ms)
         * @returns {Object} - Các hàm điều khiển animation
         */
        animate: (callback, duration = 1000) => {
          if (!callback || typeof window === 'undefined') {
            return { start: () => {}, stop: () => {}, isRunning: () => false };
          }
          
          let startTime = null;
          let requestId = null;
          let isRunning = false;
          
          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            callback(progress);
            
            if (progress < 1) {
              requestId = window.requestAnimationFrame(step);
            } else {
              isRunning = false;
            }
          };
          
          const start = () => {
            if (isRunning) return;
            
            isRunning = true;
            startTime = null;
            requestId = window.requestAnimationFrame(step);
          };
          
          const stop = () => {
            if (!isRunning) return;
            
            window.cancelAnimationFrame(requestId);
            isRunning = false;
          };
          
          return {
            start,
            stop,
            isRunning: () => isRunning
          };
        },
        
        /**
         * Tạo hiệu ứng fade in
         * @param {Element} element - Element cần áp dụng
         * @param {number} duration - Thời gian (ms)
         * @returns {Promise} - Promise khi animation hoàn thành
         */
        fadeIn: (element, duration = 300) => {
          if (!element) return Promise.reject(new Error('Element is required'));
          
          return new Promise((resolve) => {
            element.style.opacity = '0';
            element.style.display = '';
            
            let start = null;
            
            const step = (timestamp) => {
              if (!start) start = timestamp;
              
              const elapsed = timestamp - start;
              const progress = Math.min(elapsed / duration, 1);
              
              element.style.opacity = progress.toString();
              
              if (progress < 1) {
                window.requestAnimationFrame(step);
              } else {
                resolve();
              }
            };
            
            window.requestAnimationFrame(step);
          });
        },
        
        /**
         * Tạo hiệu ứng fade out
         * @param {Element} element - Element cần áp dụng
         * @param {number} duration - Thời gian (ms)
         * @returns {Promise} - Promise khi animation hoàn thành
         */
        fadeOut: (element, duration = 300) => {
          if (!element) return Promise.reject(new Error('Element is required'));
          
          return new Promise((resolve) => {
            element.style.opacity = '1';
            
            let start = null;
            
            const step = (timestamp) => {
              if (!start) start = timestamp;
              
              const elapsed = timestamp - start;
              const progress = Math.min(elapsed / duration, 1);
              
              element.style.opacity = (1 - progress).toString();
              
              if (progress < 1) {
                window.requestAnimationFrame(step);
              } else {
                element.style.display = 'none';
                resolve();
              }
            };
            
            window.requestAnimationFrame(step);
          });
        },
        
        /**
         * Tạo hiệu ứng slide down
         * @param {Element} element - Element cần áp dụng
         * @param {number} duration - Thời gian (ms)
         * @returns {Promise} - Promise khi animation hoàn thành
         */
        slideDown: (element, duration = 300) => {
          if (!element) return Promise.reject(new Error('Element is required'));
          
          return new Promise((resolve) => {
            element.style.display = '';
            element.style.overflow = 'hidden';
            element.style.height = '0';
            
            const targetHeight = element.scrollHeight;
            
            let start = null;
            
            const step = (timestamp) => {
              if (!start) start = timestamp;
              
              const elapsed = timestamp - start;
              const progress = Math.min(elapsed / duration, 1);
              
              element.style.height = (targetHeight * progress) + 'px';
              
              if (progress < 1) {
                window.requestAnimationFrame(step);
              } else {
                element.style.height = '';
                element.style.overflow = '';
                resolve();
              }
            };
            
            window.requestAnimationFrame(step);
          });
        },
        
        /**
         * Tạo hiệu ứng slide up
         * @param {Element} element - Element cần áp dụng
         * @param {number} duration - Thời gian (ms)
         * @returns {Promise} - Promise khi animation hoàn thành
         */
        slideUp: (element, duration = 300) => {
          if (!element) return Promise.reject(new Error('Element is required'));
          
          return new Promise((resolve) => {
            element.style.overflow = 'hidden';
            element.style.height = element.scrollHeight + 'px';
            
            let start = null;
            
            const step = (timestamp) => {
              if (!start) start = timestamp;
              
              const elapsed = timestamp - start;
              const progress = Math.min(elapsed / duration, 1);
              
              element.style.height = (element.scrollHeight * (1 - progress)) + 'px';
              
              if (progress < 1) {
                window.requestAnimationFrame(step);
              } else {
                element.style.display = 'none';
                element.style.height = '';
                element.style.overflow = '';
                resolve();
              }
            };
            
            window.requestAnimationFrame(step);
          });
        }
      };
      
      // Export tất cả các utility functions
      export default {
        stringUtils,
        numberUtils,
        dateUtils,
        arrayUtils,
        objectUtils,
        validationUtils,
        domUtils,
        storageUtils,
        apiUtils,
        formUtils,
        urlUtils,
        fileUtils,
        deviceUtils,
        performanceUtils,
        eventUtils,
        animationUtils
      };
      performanceUtils,
        eventUtils,
        animationUtils
      };
      
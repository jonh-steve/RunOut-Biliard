/**
 * Middleware tối ưu hóa hiệu suất API
 * Cung cấp caching và pagination cho các endpoint API
 */

const NodeCache = require('node-cache');
const apiCache = new NodeCache({ stdTTL: 300, checkperiod: 120 }); // Cache mặc định 5 phút

/**
 * Middleware caching API
 * @param {number} ttl - Thời gian sống của cache tính bằng giây (mặc định: 300s)
 * @returns {Function} Express middleware
 */
const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    // Bỏ qua cache cho các request không phải GET
    if (req.method !== 'GET') {
      return next();
    }

    // Tạo khóa cache từ URL và query params
    const cacheKey = `${req.originalUrl || req.url}`;
    
    // Kiểm tra nếu response đã được cache
    const cachedResponse = apiCache.get(cacheKey);
    
    if (cachedResponse) {
      // Trả về response từ cache
      res.set('X-API-Cache', 'HIT');
      return res.status(200).send(cachedResponse);
    } else {
      // Cache miss - lưu response vào cache
      res.set('X-API-Cache', 'MISS');
      
      // Lưu phương thức send gốc
      const originalSend = res.send;
      
      // Ghi đè phương thức send để lưu response vào cache
      res.send = function(body) {
        // Chỉ cache các response thành công
        if (res.statusCode >= 200 && res.statusCode < 300) {
          apiCache.set(cacheKey, body, ttl);
        }
        // Gọi phương thức send gốc
        return originalSend.call(this, body);
      };
      
      next();
    }
  };
};

/**
 * Middleware pagination
 * Thêm pagination cho các endpoint trả về danh sách
 * @returns {Function} Express middleware
 */
const paginationMiddleware = () => {
  return (req, res, next) => {
    // Lấy tham số pagination từ query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Tính toán skip để sử dụng trong MongoDB
    const skip = (page - 1) * limit;
    
    // Thêm các hàm pagination vào req object
    req.pagination = {
      page,
      limit,
      skip,
      // Hàm format kết quả pagination
      formatResults: function(results, totalCount) {
        const totalPages = Math.ceil(totalCount / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;
        
        return {
          results,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages,
            hasNext,
            hasPrev,
            // Thêm các URL cho next/prev page nếu cần
            nextPage: hasNext ? `${req.baseUrl}${req.path}?page=${page + 1}&limit=${limit}` : null,
            prevPage: hasPrev ? `${req.baseUrl}${req.path}?page=${page - 1}&limit=${limit}` : null,
          }
        };
      }
    };
    
    next();
  };
};

/**
 * Middleware tối ưu hóa truy vấn MongoDB
 * @returns {Function} Express middleware
 */
const queryOptimizer = () => {
  return (req, res, next) => {
    // Thêm các hàm hỗ trợ tối ưu hóa truy vấn vào req
    req.optimizeQuery = {
      // Hàm tạo projection để chỉ lấy các trường cần thiết
      createProjection: function(fields) {
        if (!fields) return {};
        
        // Nếu fields là chuỗi, chuyển thành mảng
        if (typeof fields === 'string') {
          fields = fields.split(',').map(field => field.trim());
        }
        
        // Tạo object projection
        const projection = {};
        fields.forEach(field => {
          projection[field] = 1;
        });
        
        return projection;
      },
      
      // Hàm tạo sort options
      createSortOptions: function(sortBy = 'createdAt', sortOrder = 'desc') {
        const order = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
        const sortOptions = {};
        sortOptions[sortBy] = order;
        return sortOptions;
      }
    };
    
    next();
  };
};

/**
 * Middleware đo lường hiệu suất API
 * @returns {Function} Express middleware
 */
const performanceMonitor = () => {
  return (req, res, next) => {
    // Lưu thời gian bắt đầu
    const startTime = process.hrtime();
    
    // Khi response hoàn tất
    res.on('finish', () => {
      // Tính thời gian xử lý
      const hrtime = process.hrtime(startTime);
      const responseTime = hrtime[0] * 1000 + hrtime[1] / 1000000; // ms
      
      // Thêm header response time
      res.set('X-Response-Time', `${responseTime.toFixed(2)}ms`);
      
      // Log thời gian xử lý cho các request chậm (> 500ms)
      if (responseTime > 500) {
        console.warn(`Slow API request: ${req.method} ${req.originalUrl} - ${responseTime.toFixed(2)}ms`);
      }
    });
    
    next();
  };
};

/**
 * Xóa cache cho một endpoint cụ thể
 * @param {string} pattern - Mẫu URL để xóa cache (hỗ trợ wildcard *)
 */
const clearCache = (pattern) => {
  if (!pattern) {
    // Xóa toàn bộ cache nếu không có pattern
    apiCache.flushAll();
    return;
  }
  
  // Chuyển đổi pattern thành regex
  const regexPattern = new RegExp(pattern.replace(/\*/g, '.*'));
  
  // Lấy tất cả các khóa cache
  const keys = apiCache.keys();
  
  // Lọc và xóa các khóa phù hợp với pattern
  keys.forEach(key => {
    if (regexPattern.test(key)) {
      apiCache.del(key);
    }
  });
};

module.exports = {
  cacheMiddleware,
  paginationMiddleware,
  queryOptimizer,
  performanceMonitor,
  clearCache
};
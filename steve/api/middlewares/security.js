/**
 * Middleware bảo mật cho API
 * Cung cấp xác thực JWT, refresh token, và bảo vệ chống tấn công
 */

const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const csrf = require('csurf');
const { v4: uuidv4 } = require('uuid');

// Cấu hình từ biến môi trường
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Middleware xác thực JWT
 * Kiểm tra và xác thực token trong header Authorization
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Không tìm thấy token xác thực' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token đã hết hạn',
        expired: true
      });
    }
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }
};

/**
 * Middleware xác thực refresh token
 * Sử dụng để cấp mới access token khi token cũ hết hạn
 */
const authenticateRefreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Không tìm thấy refresh token' });
  }

  try {
    const user = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
  }
};

/**
 * Tạo access token và refresh token mới
 * @param {Object} user - Thông tin người dùng để lưu trong token
 * @returns {Object} - Access token và refresh token
 */
const generateTokens = (user) => {
  // Loại bỏ thông tin nhạy cảm
  const userInfo = {
    id: user.id || user._id,
    email: user.email,
    role: user.role,
    // Thêm các trường khác nếu cần
  };

  // Tạo access token
  const accessToken = jwt.sign(userInfo, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });

  // Tạo refresh token
  const refreshToken = jwt.sign(userInfo, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN
  });

  return {
    accessToken,
    refreshToken
  };
};

/**
 * Middleware kiểm tra quyền
 * @param {Array} roles - Mảng các vai trò được phép truy cập
 */
const checkRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Chưa xác thực' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    next();
  };
};

/**
 * Middleware giới hạn tốc độ yêu cầu
 * Bảo vệ chống brute force và DOS
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn mỗi IP 100 yêu cầu mỗi windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.'
  }
});

/**
 * Middleware giới hạn tốc độ đăng nhập
 * Bảo vệ chống brute force
 */
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 5, // Giới hạn 5 lần đăng nhập thất bại mỗi giờ
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau 1 giờ.'
  }
});

/**
 * Middleware bảo vệ CSRF
 * Sử dụng cho các route không phải API (ví dụ: form)
 */
const csrfProtection = csrf({ cookie: true });

/**
 * Middleware tạo CSRF token
 * Sử dụng cho SPA để nhận token
 */
const generateCSRFToken = (req, res, next) => {
  if (!req.csrfToken) {
    return next();
  }
  
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  next();
};

/**
 * Middleware bảo vệ chống XSS và các tấn công khác
 * Sử dụng helmet
 */
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net', 'fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'res.cloudinary.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      connectSrc: ["'self'", 'api.example.com'],
    },
  },
  crossOriginEmbedderPolicy: false, // Có thể cần điều chỉnh tùy theo yêu cầu
});

/**
 * Middleware ghi log hoạt động bảo mật
 */
const securityLogger = (req, res, next) => {
  // Tạo ID duy nhất cho mỗi request để theo dõi
  req.requestId = uuidv4();
  
  // Ghi log khi bắt đầu request
  console.info(`[${new Date().toISOString()}] [${req.requestId}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  
  // Ghi log khi kết thúc request
  res.on('finish', () => {
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    console[logLevel](`[${new Date().toISOString()}] [${req.requestId}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
    
    // Ghi log chi tiết hơn cho các lỗi bảo mật
    if (res.statusCode === 401 || res.statusCode === 403) {
      console.warn(`[${new Date().toISOString()}] [${req.requestId}] Lỗi bảo mật - IP: ${req.ip}, User-Agent: ${req.headers['user-agent']}`);
    }
  });
  
  next();
};

/**
 * Middleware kiểm tra IP đáng ngờ
 * Có thể mở rộng để kiểm tra IP trong danh sách đen
 */
const suspiciousIPCheck = (req, res, next) => {
  // Đây là nơi bạn có thể kiểm tra IP trong danh sách đen
  // hoặc kiểm tra các dấu hiệu đáng ngờ khác
  
  // Ví dụ đơn giản: kiểm tra số lượng request từ IP này
  // Trong thực tế, bạn sẽ sử dụng Redis hoặc cơ sở dữ liệu để theo dõi
  
  next();
};

module.exports = {
  authenticateJWT,
  authenticateRefreshToken,
  generateTokens,
  checkRole,
  apiLimiter,
  loginLimiter,
  csrfProtection,
  generateCSRFToken,
  securityHeaders,
  securityLogger,
  suspiciousIPCheck
};
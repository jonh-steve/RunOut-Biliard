/**
 * Frontend Review Validator
 * Các hàm kiểm tra dữ liệu đánh giá sản phẩm ở phía client
 */

/**
 * Kiểm tra đánh giá sao hợp lệ
 * @param {number|string} star - Đánh giá sao cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateReviewStar = (star) => {
  if (star === undefined || star === null) 
    return 'Đánh giá sao không được để trống';
  
  const numStar = Number(star);
  
  if (isNaN(numStar)) 
    return 'Đánh giá sao phải là số';
  
  if (numStar < 1 || numStar > 5) 
    return 'Đánh giá sao phải từ 1 đến 5';
  
  return true;
};

/**
 * Kiểm tra bình luận đánh giá hợp lệ
 * @param {string} comment - Bình luận cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateReviewComment = (comment) => {
  if (!comment) return true; // Không bắt buộc
  
  if (comment.trim() === '') 
    return 'Bình luận không được để trống nếu được cung cấp';
  
  return true;
};

/**
 * Kiểm tra ID sản phẩm hợp lệ
 * @param {string} productId - ID sản phẩm cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateProductId = (productId) => {
  if (!productId || productId.trim() === '') 
    return 'ID sản phẩm không được để trống';
  
  // Kiểm tra định dạng MongoDB ObjectId
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(productId)) 
    return 'ID sản phẩm không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra hình ảnh đánh giá hợp lệ
 * @param {Array} images - Mảng hình ảnh cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateReviewImages = (images) => {
  if (!images) return true; // Không bắt buộc
  
  if (!Array.isArray(images)) 
    return 'Hình ảnh phải là một mảng';
  
  return true;
};

/**
 * Kiểm tra nội dung phản hồi đánh giá hợp lệ
 * @param {string} content - Nội dung phản hồi cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateReplyContent = (content) => {
  if (!content || content.trim() === '') 
    return 'Nội dung phản hồi không được để trống';
  
  if (content.length > 500) 
    return 'Nội dung phản hồi không được vượt quá 500 ký tự';
  
  return true;
};

/**
 * Kiểm tra ID đánh giá hợp lệ
 * @param {string} reviewId - ID đánh giá cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateReviewId = (reviewId) => {
  if (!reviewId || reviewId.trim() === '') 
    return 'ID đánh giá không được để trống';
  
  // Kiểm tra định dạng MongoDB ObjectId
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(reviewId)) 
    return 'ID đánh giá không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra form tạo đánh giá sản phẩm
 * @param {Object} formData - Dữ liệu form đánh giá
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateCreateReviewForm = (formData) => {
  const errors = {};
  
  const starResult = validateReviewStar(formData.star);
  if (starResult !== true) errors.star = starResult;
  
  if (formData.comment !== undefined) {
    const commentResult = validateReviewComment(formData.comment);
    if (commentResult !== true) errors.comment = commentResult;
  }
  
  const productIdResult = validateProductId(formData.product);
  if (productIdResult !== true) errors.product = productIdResult;
  
  if (formData.images !== undefined) {
    const imagesResult = validateReviewImages(formData.images);
    if (imagesResult !== true) errors.images = imagesResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form cập nhật đánh giá sản phẩm
 * @param {Object} formData - Dữ liệu form cập nhật đánh giá
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateUpdateReviewForm = (formData) => {
  const errors = {};
  
  if (formData.star !== undefined) {
    const starResult = validateReviewStar(formData.star);
    if (starResult !== true) errors.star = starResult;
  }
  
  if (formData.comment !== undefined) {
    const commentResult = validateReviewComment(formData.comment);
    if (commentResult !== true) errors.comment = commentResult;
  }
  
  if (formData.images !== undefined) {
    const imagesResult = validateReviewImages(formData.images);
    if (imagesResult !== true) errors.images = imagesResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form phản hồi đánh giá
 * @param {Object} formData - Dữ liệu form phản hồi
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateReplyForm = (formData) => {
  const errors = {};
  
  const contentResult = validateReplyContent(formData.content);
  if (contentResult !== true) errors.content = contentResult;
  
  const reviewIdResult = validateReviewId(formData.reviewId);
  if (reviewIdResult !== true) errors.reviewId = reviewIdResult;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
/**
 * Frontend Product Validator
 * Các hàm kiểm tra dữ liệu sản phẩm ở phía client
 */

/**
 * Kiểm tra tên sản phẩm hợp lệ
 * @param {string} title - Tên sản phẩm cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateProductTitle = (title) => {
  if (!title || title.trim() === '') 
    return 'Tên sản phẩm không được để trống';
  
  if (title.length < 3) 
    return 'Tên sản phẩm phải có ít nhất 3 ký tự';
  
  return true;
};

/**
 * Kiểm tra giá sản phẩm hợp lệ
 * @param {number|string} price - Giá sản phẩm cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateProductPrice = (price) => {
  if (price === undefined || price === null || price === '') 
    return 'Giá sản phẩm không được để trống';
  
  const numPrice = Number(price);
  
  if (isNaN(numPrice)) 
    return 'Giá sản phẩm phải là số';
  
  if (numPrice <= 0) 
    return 'Giá sản ph���m phải lớn hơn 0';
  
  return true;
};

/**
 * Kiểm tra mô tả sản phẩm hợp lệ
 * @param {string} description - M�� tả sản phẩm cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateProductDescription = (description) => {
  if (!description || description.trim() === '') 
    return 'Mô tả sản phẩm không được để trống';
  
  if (description.length < 10) 
    return 'Mô tả sản phẩm phải có ít nhất 10 ký tự';
  
  return true;
};

/**
 * Kiểm tra danh mục sản phẩm hợp lệ
 * @param {string} category - Danh mục sản phẩm cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateProductCategory = (category) => {
  if (!category || category.trim() === '') 
    return 'Danh mục sản phẩm không được để trống';
  
  return true;
};

/**
 * Kiểm tra số lượng sản phẩm hợp lệ
 * @param {number|string} quantity - Số lượng sản phẩm cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateProductQuantity = (quantity) => {
  if (quantity === undefined || quantity === null || quantity === '') 
    return 'Số lượng sản phẩm không được để trống';
  
  const numQuantity = Number(quantity);
  
  if (isNaN(numQuantity) || !Number.isInteger(numQuantity)) 
    return 'Số lượng sản phẩm phải là số nguyên';
  
  if (numQuantity < 0) 
    return 'Số lượng sản phẩm không được âm';
  
  return true;
};

/**
 * Kiểm tra hình ảnh sản phẩm hợp lệ
 * @param {Array} images - Mảng hình ảnh sản phẩm cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateProductImages = (images) => {
  if (!images || !Array.isArray(images)) 
    return 'Hình ảnh sản phẩm phải là một mảng';
  
  if (images.length === 0) 
    return 'Sản phẩm phải có ít nhất một hình ảnh';
  
  return true;
};

/**
 * Kiểm tra form tạo/cập nhật sản phẩm
 * @param {Object} formData - Dữ liệu form sản phẩm
 * @param {boolean} isUpdate - Có phải đang cập nhật không (nếu true, một số trường có thể không bắt buộc)
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateProductForm = (formData, isUpdate = false) => {
  const errors = {};
  
  // Nếu đang cập nhật, chỉ kiểm tra các trường được cung cấp
  if (isUpdate) {
    if (formData.title !== undefined) {
      const titleResult = validateProductTitle(formData.title);
      if (titleResult !== true) errors.title = titleResult;
    }
    
    if (formData.price !== undefined) {
      const priceResult = validateProductPrice(formData.price);
      if (priceResult !== true) errors.price = priceResult;
    }
    
    if (formData.description !== undefined) {
      const descriptionResult = validateProductDescription(formData.description);
      if (descriptionResult !== true) errors.description = descriptionResult;
    }
    
    if (formData.category !== undefined) {
      const categoryResult = validateProductCategory(formData.category);
      if (categoryResult !== true) errors.category = categoryResult;
    }
    
    if (formData.quantity !== undefined) {
      const quantityResult = validateProductQuantity(formData.quantity);
      if (quantityResult !== true) errors.quantity = quantityResult;
    }
    
    if (formData.images !== undefined) {
      const imagesResult = validateProductImages(formData.images);
      if (imagesResult !== true) errors.images = imagesResult;
    }
  } else {
    // Nếu đang tạo mới, kiểm tra tất cả các trường bắt buộc
    const titleResult = validateProductTitle(formData.title);
    if (titleResult !== true) errors.title = titleResult;
    
    const priceResult = validateProductPrice(formData.price);
    if (priceResult !== true) errors.price = priceResult;
    
    const descriptionResult = validateProductDescription(formData.description);
    if (descriptionResult !== true) errors.description = descriptionResult;
    
    const categoryResult = validateProductCategory(formData.category);
    if (categoryResult !== true) errors.category = categoryResult;
    
    const quantityResult = validateProductQuantity(formData.quantity);
    if (quantityResult !== true) errors.quantity = quantityResult;
    
    const imagesResult = validateProductImages(formData.images);
    if (imagesResult !== true) errors.images = imagesResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra đánh giá sản phẩm hợp lệ
 * @param {Object} ratingData - Dữ liệu đánh giá
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateProductRating = (ratingData) => {
  const errors = {};
  
  if (ratingData.star === undefined || ratingData.star === null) {
    errors.star = 'Đánh giá sao không được để trống';
  } else {
    const starValue = Number(ratingData.star);
    if (isNaN(starValue) || starValue < 1 || starValue > 5) {
      errors.star = 'Đánh giá sao phải từ 1 đến 5';
    }
  }
  
  if (ratingData.comment && ratingData.comment.trim() === '') {
    errors.comment = 'Bình luận không được để trống nếu được cung cấp';
  }
  
  if (!ratingData.pid) {
    errors.pid = 'ID sản phẩm không được để trống';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
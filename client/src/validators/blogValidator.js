/**
 * Frontend Blog Validator
 * Các hàm kiểm tra dữ liệu bài viết ở phía client
 */

/**
 * Kiểm tra tiêu đề bài viết hợp lệ
 * @param {string} title - Tiêu đề bài viết cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateBlogTitle = (title) => {
  if (!title || title.trim() === '') 
    return 'Tiêu đề bài viết không được để trống';
  
  if (title.length < 5) 
    return 'Tiêu đề bài viết phải có ít nhất 5 ký tự';
  
  if (title.length > 200) 
    return 'Tiêu đề bài viết không được vượt quá 200 ký tự';
  
  return true;
};

/**
 * Kiểm tra mô tả bài viết hợp lệ
 * @param {string} description - Mô tả bài viết cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateBlogDescription = (description) => {
  if (!description || description.trim() === '') 
    return 'Mô tả bài viết không được để trống';
  
  if (description.length < 10) 
    return 'Mô tả bài viết phải có ít nhất 10 ký tự';
  
  return true;
};

/**
 * Kiểm tra danh mục bài viết hợp lệ
 * @param {string} category - Danh mục bài viết cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateBlogCategory = (category) => {
  if (!category || category.trim() === '') 
    return 'Danh mục bài viết không được để trống';
  
  return true;
};

/**
 * Kiểm tra nội dung bài viết hợp lệ
 * @param {string} content - Nội dung bài viết cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateBlogContent = (content) => {
  if (!content || content.trim() === '') 
    return 'Nội dung bài viết không được để trống';
  
  if (content.length < 50) 
    return 'Nội dung bài viết phải có ít nhất 50 ký tự';
  
  return true;
};

/**
 * Kiểm tra tags bài viết hợp lệ
 * @param {Array} tags - Tags bài viết cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateBlogTags = (tags) => {
  if (!tags) return true; // Không bắt buộc
  
  if (!Array.isArray(tags)) 
    return 'Tags phải là một mảng';
  
  return true;
};

/**
 * Kiểm tra nội dung bình luận hợp lệ
 * @param {string} content - Nội dung bình luận cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateCommentContent = (content) => {
  if (!content || content.trim() === '') 
    return 'Nội dung bình luận không được để trống';
  
  if (content.length > 1000) 
    return 'Nội dung bình luận không được vượt quá 1000 ký tự';
  
  return true;
};

/**
 * Kiểm tra form tạo/cập nhật bài viết
 * @param {Object} formData - Dữ liệu form bài viết
 * @param {boolean} isUpdate - Có phải đang cập nhật không (nếu true, một số trường có thể không bắt buộc)
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateBlogForm = (formData, isUpdate = false) => {
  const errors = {};
  
  // Nếu đang cập nhật, chỉ kiểm tra các trường được cung cấp
  if (isUpdate) {
    if (formData.title !== undefined) {
      const titleResult = validateBlogTitle(formData.title);
      if (titleResult !== true) errors.title = titleResult;
    }
    
    if (formData.description !== undefined) {
      const descriptionResult = validateBlogDescription(formData.description);
      if (descriptionResult !== true) errors.description = descriptionResult;
    }
    
    if (formData.category !== undefined) {
      const categoryResult = validateBlogCategory(formData.category);
      if (categoryResult !== true) errors.category = categoryResult;
    }
    
    if (formData.content !== undefined) {
      const contentResult = validateBlogContent(formData.content);
      if (contentResult !== true) errors.content = contentResult;
    }
    
    if (formData.tags !== undefined) {
      const tagsResult = validateBlogTags(formData.tags);
      if (tagsResult !== true) errors.tags = tagsResult;
    }
  } else {
    // Nếu đang tạo mới, kiểm tra tất cả các trường bắt buộc
    const titleResult = validateBlogTitle(formData.title);
    if (titleResult !== true) errors.title = titleResult;
    
    const descriptionResult = validateBlogDescription(formData.description);
    if (descriptionResult !== true) errors.description = descriptionResult;
    
    const categoryResult = validateBlogCategory(formData.category);
    if (categoryResult !== true) errors.category = categoryResult;
    
    const contentResult = validateBlogContent(formData.content);
    if (contentResult !== true) errors.content = contentResult;
    
    if (formData.tags !== undefined) {
      const tagsResult = validateBlogTags(formData.tags);
      if (tagsResult !== true) errors.tags = tagsResult;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form bình luận bài viết
 * @param {Object} formData - Dữ liệu form bình luận
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateCommentForm = (formData) => {
  const errors = {};
  
  const contentResult = validateCommentContent(formData.content);
  if (contentResult !== true) errors.content = contentResult;
  
  if (!formData.blog) {
    errors.blog = 'ID bài viết không được để trống';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
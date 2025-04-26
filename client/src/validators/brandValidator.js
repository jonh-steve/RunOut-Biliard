/**
 * Frontend Brand Validator
 * Các hàm kiểm tra dữ liệu thương hiệu ở phía client
 */

/**
 * Kiểm tra tên thương hiệu hợp lệ
 * @param {string} title - Tên thương hiệu cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateBrandTitle = (title) => {
  if (!title || title.trim() === '') 
    return 'Tên thương hiệu không được để trống';
  
  if (title.length < 2) 
    return 'Tên thương hiệu phải có ít nhất 2 ký tự';
  
  // Kiểm tra tên thương hiệu không chứa ký tự đặc biệt
  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharsRegex.test(title)) 
    return 'Tên thương hiệu không được chứa ký tự đặc biệt';
  
  return true;
};

/**
 * Kiểm tra mô tả thương hiệu hợp lệ
 * @param {string} description - Mô tả thương hiệu cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateBrandDescription = (description) => {
  if (!description) return true; // Không bắt buộc
  
  if (description.trim() === '') 
    return 'Mô tả thương hiệu không được để trống nếu được cung cấp';
  
  if (description.length < 10) 
    return 'Mô tả thương hiệu phải có ít nhất 10 ký tự';
  
  return true;
};

/**
 * Kiểm tra website thương hiệu hợp lệ
 * @param {string} website - Website thương hiệu cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateBrandWebsite = (website) => {
  if (!website) return true; // Không bắt buộc
  
  if (website.trim() === '') 
    return 'Website không được để trống nếu được cung cấp';
  
  // Kiểm tra URL hợp lệ
  try {
    new URL(website);
    return true;
  } catch (error) {
    return 'Website phải là một URL hợp lệ';
  }
};

/**
 * Kiểm tra form tạo/cập nhật thương hiệu
 * @param {Object} formData - Dữ liệu form thương hiệu
 * @param {boolean} isUpdate - Có phải đang cập nhật không (nếu true, một số trường có thể không bắt buộc)
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateBrandForm = (formData, isUpdate = false) => {
  const errors = {};
  
  // Nếu đang cập nhật, chỉ kiểm tra các trường được cung cấp
  if (isUpdate) {
    if (formData.title !== undefined) {
      const titleResult = validateBrandTitle(formData.title);
      if (titleResult !== true) errors.title = titleResult;
    }
    
    if (formData.description !== undefined) {
      const descriptionResult = validateBrandDescription(formData.description);
      if (descriptionResult !== true) errors.description = descriptionResult;
    }
    
    if (formData.website !== undefined) {
      const websiteResult = validateBrandWebsite(formData.website);
      if (websiteResult !== true) errors.website = websiteResult;
    }
  } else {
    // Nếu đang tạo mới, kiểm tra tất cả các trường bắt buộc
    const titleResult = validateBrandTitle(formData.title);
    if (titleResult !== true) errors.title = titleResult;
    
    if (formData.description !== undefined) {
      const descriptionResult = validateBrandDescription(formData.description);
      if (descriptionResult !== true) errors.description = descriptionResult;
    }
    
    if (formData.website !== undefined) {
      const websiteResult = validateBrandWebsite(formData.website);
      if (websiteResult !== true) errors.website = websiteResult;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
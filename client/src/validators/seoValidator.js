/**
 * Frontend SEO Validator
 * Các hàm kiểm tra dữ liệu SEO ở phía client
 */

/**
 * Kiểm tra tiêu đề meta hợp lệ
 * @param {string} metaTitle - Tiêu đề meta cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateMetaTitle = (metaTitle) => {
  if (!metaTitle) return true; // Không bắt buộc
  
  if (metaTitle.trim() === '') 
    return 'Tiêu đề meta không được để trống nếu được cung cấp';
  
  if (metaTitle.length < 5) 
    return 'Tiêu đề meta phải có ít nhất 5 ký tự';
  
  if (metaTitle.length > 70) 
    return 'Tiêu đề meta không được vượt quá 70 ký tự';
  
  return true;
};

/**
 * Kiểm tra mô tả meta hợp lệ
 * @param {string} metaDescription - Mô tả meta cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateMetaDescription = (metaDescription) => {
  if (!metaDescription) return true; // Không bắt buộc
  
  if (metaDescription.trim() === '') 
    return 'Mô tả meta không được để trống nếu được cung cấp';
  
  if (metaDescription.length < 50) 
    return 'Mô tả meta phải có ít nhất 50 ký tự';
  
  if (metaDescription.length > 160) 
    return 'Mô tả meta không được vượt quá 160 ký tự';
  
  return true;
};

/**
 * Kiểm tra từ khóa meta hợp lệ
 * @param {Array} metaKeywords - Từ khóa meta cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateMetaKeywords = (metaKeywords) => {
  if (!metaKeywords) return true; // Không bắt buộc
  
  if (!Array.isArray(metaKeywords)) 
    return 'Từ khóa meta phải là một mảng';
  
  return true;
};

/**
 * Kiểm tra tiêu đề Open Graph hợp lệ
 * @param {string} ogTitle - Tiêu đề Open Graph cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateOgTitle = (ogTitle) => {
  if (!ogTitle) return true; // Không bắt buộc
  
  if (ogTitle.trim() === '') 
    return 'Tiêu đề Open Graph không được để trống nếu được cung cấp';
  
  if (ogTitle.length < 5) 
    return 'Tiêu đề Open Graph phải có ít nhất 5 ký tự';
  
  if (ogTitle.length > 70) 
    return 'Tiêu đề Open Graph không được vượt quá 70 ký tự';
  
  return true;
};

/**
 * Kiểm tra mô tả Open Graph hợp lệ
 * @param {string} ogDescription - Mô tả Open Graph cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateOgDescription = (ogDescription) => {
  if (!ogDescription) return true; // Không bắt buộc
  
  if (ogDescription.trim() === '') 
    return 'Mô tả Open Graph không được để trống nếu được cung cấp';
  
  if (ogDescription.length < 50) 
    return 'Mô tả Open Graph phải có ít nhất 50 ký tự';
  
  if (ogDescription.length > 160) 
    return 'Mô tả Open Graph không được vượt quá 160 ký tự';
  
  return true;
};

/**
 * Kiểm tra tiêu đề Twitter hợp lệ
 * @param {string} twitterTitle - Tiêu đề Twitter cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp l���
 */
export const validateTwitterTitle = (twitterTitle) => {
  if (!twitterTitle) return true; // Không bắt buộc
  
  if (twitterTitle.trim() === '') 
    return 'Tiêu đề Twitter không được để trống nếu được cung cấp';
  
  if (twitterTitle.length < 5) 
    return 'Tiêu đề Twitter phải có ít nhất 5 ký tự';
  
  if (twitterTitle.length > 70) 
    return 'Tiêu đề Twitter không được vượt quá 70 ký tự';
  
  return true;
};

/**
 * Kiểm tra mô tả Twitter hợp lệ
 * @param {string} twitterDescription - Mô tả Twitter cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateTwitterDescription = (twitterDescription) => {
  if (!twitterDescription) return true; // Không bắt buộc
  
  if (twitterDescription.trim() === '') 
    return 'Mô tả Twitter không được để trống nếu được cung cấp';
  
  if (twitterDescription.length < 50) 
    return 'Mô tả Twitter phải có ít nhất 50 ký tự';
  
  if (twitterDescription.length > 160) 
    return 'Mô tả Twitter không được vượt quá 160 ký tự';
  
  return true;
};

/**
 * Kiểm tra URL chuẩn hợp lệ
 * @param {string} canonicalUrl - URL chuẩn cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateCanonicalUrl = (canonicalUrl) => {
  if (!canonicalUrl) return true; // Không bắt buộc
  
  if (canonicalUrl.trim() === '') 
    return 'URL chuẩn không được để trống nếu được cung cấp';
  
  try {
    new URL(canonicalUrl);
    return true;
  } catch (error) {
    return 'URL chuẩn phải là một URL hợp lệ';
  }
};

/**
 * Kiểm tra cài đặt sitemap hợp lệ
 * @param {Object} sitemapSettings - Cài đặt sitemap cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateSitemapSettings = (sitemapSettings) => {
  if (!sitemapSettings) return true; // Không bắt buộc
  
  if (typeof sitemapSettings !== 'object' || Array.isArray(sitemapSettings)) 
    return 'Cài đặt sitemap phải là một đối tượng';
  
  return true;
};

/**
 * Kiểm tra dữ liệu có cấu trúc hợp lệ
 * @param {Object} structuredData - Dữ liệu có cấu trúc cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateStructuredData = (structuredData) => {
  if (!structuredData) return true; // Không bắt buộc
  
  if (typeof structuredData !== 'object' || Array.isArray(structuredData)) 
    return 'Dữ liệu có cấu trúc phải là một đối tượng';
  
  return true;
};

/**
 * Kiểm tra ID trang hợp lệ
 * @param {string} pageId - ID trang cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validatePageId = (pageId) => {
  if (!pageId || pageId.trim() === '') 
    return 'ID trang không được để trống';
  
  // Kiểm tra định dạng MongoDB ObjectId
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(pageId)) 
    return 'ID trang không hợp lệ';
  
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
 * Kiểm tra ID bài viết hợp lệ
 * @param {string} blogId - ID bài viết cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateBlogId = (blogId) => {
  if (!blogId || blogId.trim() === '') 
    return 'ID bài viết không được để trống';
  
  // Kiểm tra định dạng MongoDB ObjectId
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(blogId)) 
    return 'ID bài viết không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra form cài đặt SEO
 * @param {Object} formData - Dữ liệu form cài đặt SEO
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateSeoSettingsForm = (formData) => {
  const errors = {};
  
  if (formData.metaTitle !== undefined) {
    const metaTitleResult = validateMetaTitle(formData.metaTitle);
    if (metaTitleResult !== true) errors.metaTitle = metaTitleResult;
  }
  
  if (formData.metaDescription !== undefined) {
    const metaDescriptionResult = validateMetaDescription(formData.metaDescription);
    if (metaDescriptionResult !== true) errors.metaDescription = metaDescriptionResult;
  }
  
  if (formData.metaKeywords !== undefined) {
    const metaKeywordsResult = validateMetaKeywords(formData.metaKeywords);
    if (metaKeywordsResult !== true) errors.metaKeywords = metaKeywordsResult;
  }
  
  if (formData.ogTitle !== undefined) {
    const ogTitleResult = validateOgTitle(formData.ogTitle);
    if (ogTitleResult !== true) errors.ogTitle = ogTitleResult;
  }
  
  if (formData.ogDescription !== undefined) {
    const ogDescriptionResult = validateOgDescription(formData.ogDescription);
    if (ogDescriptionResult !== true) errors.ogDescription = ogDescriptionResult;
  }
  
  if (formData.twitterTitle !== undefined) {
    const twitterTitleResult = validateTwitterTitle(formData.twitterTitle);
    if (twitterTitleResult !== true) errors.twitterTitle = twitterTitleResult;
  }
  
  if (formData.twitterDescription !== undefined) {
    const twitterDescriptionResult = validateTwitterDescription(formData.twitterDescription);
    if (twitterDescriptionResult !== true) errors.twitterDescription = twitterDescriptionResult;
  }
  
  if (formData.canonicalUrl !== undefined) {
    const canonicalUrlResult = validateCanonicalUrl(formData.canonicalUrl);
    if (canonicalUrlResult !== true) errors.canonicalUrl = canonicalUrlResult;
  }
  
  if (formData.sitemapSettings !== undefined) {
    const sitemapSettingsResult = validateSitemapSettings(formData.sitemapSettings);
    if (sitemapSettingsResult !== true) errors.sitemapSettings = sitemapSettingsResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form SEO trang
 * @param {Object} formData - Dữ liệu form SEO trang
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validatePageSeoForm = (formData) => {
  const errors = {};
  
  const pageIdResult = validatePageId(formData.pageId);
  if (pageIdResult !== true) errors.pageId = pageIdResult;
  
  if (formData.metaTitle !== undefined) {
    const metaTitleResult = validateMetaTitle(formData.metaTitle);
    if (metaTitleResult !== true) errors.metaTitle = metaTitleResult;
  }
  
  if (formData.metaDescription !== undefined) {
    const metaDescriptionResult = validateMetaDescription(formData.metaDescription);
    if (metaDescriptionResult !== true) errors.metaDescription = metaDescriptionResult;
  }
  
  if (formData.metaKeywords !== undefined) {
    const metaKeywordsResult = validateMetaKeywords(formData.metaKeywords);
    if (metaKeywordsResult !== true) errors.metaKeywords = metaKeywordsResult;
  }
  
  if (formData.ogTitle !== undefined) {
    const ogTitleResult = validateOgTitle(formData.ogTitle);
    if (ogTitleResult !== true) errors.ogTitle = ogTitleResult;
  }
  
  if (formData.ogDescription !== undefined) {
    const ogDescriptionResult = validateOgDescription(formData.ogDescription);
    if (ogDescriptionResult !== true) errors.ogDescription = ogDescriptionResult;
  }
  
  if (formData.canonicalUrl !== undefined) {
    const canonicalUrlResult = validateCanonicalUrl(formData.canonicalUrl);
    if (canonicalUrlResult !== true) errors.canonicalUrl = canonicalUrlResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form SEO sản phẩm
 * @param {Object} formData - Dữ liệu form SEO sản phẩm
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateProductSeoForm = (formData) => {
  const errors = {};
  
  const productIdResult = validateProductId(formData.productId);
  if (productIdResult !== true) errors.productId = productIdResult;
  
  if (formData.metaTitle !== undefined) {
    const metaTitleResult = validateMetaTitle(formData.metaTitle);
    if (metaTitleResult !== true) errors.metaTitle = metaTitleResult;
  }
  
  if (formData.metaDescription !== undefined) {
    const metaDescriptionResult = validateMetaDescription(formData.metaDescription);
    if (metaDescriptionResult !== true) errors.metaDescription = metaDescriptionResult;
  }
  
  if (formData.metaKeywords !== undefined) {
    const metaKeywordsResult = validateMetaKeywords(formData.metaKeywords);
    if (metaKeywordsResult !== true) errors.metaKeywords = metaKeywordsResult;
  }
  
  if (formData.ogTitle !== undefined) {
    const ogTitleResult = validateOgTitle(formData.ogTitle);
    if (ogTitleResult !== true) errors.ogTitle = ogTitleResult;
  }
  
  if (formData.ogDescription !== undefined) {
    const ogDescriptionResult = validateOgDescription(formData.ogDescription);
    if (ogDescriptionResult !== true) errors.ogDescription = ogDescriptionResult;
  }
  
  if (formData.canonicalUrl !== undefined) {
    const canonicalUrlResult = validateCanonicalUrl(formData.canonicalUrl);
    if (canonicalUrlResult !== true) errors.canonicalUrl = canonicalUrlResult;
  }
  
  if (formData.structuredData !== undefined) {
    const structuredDataResult = validateStructuredData(formData.structuredData);
    if (structuredDataResult !== true) errors.structuredData = structuredDataResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form SEO bài viết
 * @param {Object} formData - Dữ li���u form SEO bài viết
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateBlogSeoForm = (formData) => {
  const errors = {};
  
  const blogIdResult = validateBlogId(formData.blogId);
  if (blogIdResult !== true) errors.blogId = blogIdResult;
  
  if (formData.metaTitle !== undefined) {
    const metaTitleResult = validateMetaTitle(formData.metaTitle);
    if (metaTitleResult !== true) errors.metaTitle = metaTitleResult;
  }
  
  if (formData.metaDescription !== undefined) {
    const metaDescriptionResult = validateMetaDescription(formData.metaDescription);
    if (metaDescriptionResult !== true) errors.metaDescription = metaDescriptionResult;
  }
  
  if (formData.metaKeywords !== undefined) {
    const metaKeywordsResult = validateMetaKeywords(formData.metaKeywords);
    if (metaKeywordsResult !== true) errors.metaKeywords = metaKeywordsResult;
  }
  
  if (formData.ogTitle !== undefined) {
    const ogTitleResult = validateOgTitle(formData.ogTitle);
    if (ogTitleResult !== true) errors.ogTitle = ogTitleResult;
  }
  
  if (formData.ogDescription !== undefined) {
    const ogDescriptionResult = validateOgDescription(formData.ogDescription);
    if (ogDescriptionResult !== true) errors.ogDescription = ogDescriptionResult;
  }
  
  if (formData.canonicalUrl !== undefined) {
    const canonicalUrlResult = validateCanonicalUrl(formData.canonicalUrl);
    if (canonicalUrlResult !== true) errors.canonicalUrl = canonicalUrlResult;
  }
  
  if (formData.structuredData !== undefined) {
    const structuredDataResult = validateStructuredData(formData.structuredData);
    if (structuredDataResult !== true) errors.structuredData = structuredDataResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
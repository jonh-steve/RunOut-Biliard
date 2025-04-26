/**
 * Frontend Notification Validator
 * Các hàm kiểm tra dữ liệu thông báo ở phía client
 */

/**
 * Kiểm tra tiêu đề thông báo hợp lệ
 * @param {string} title - Tiêu đề thông báo cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateNotificationTitle = (title) => {
  if (!title || title.trim() === '') 
    return 'Tiêu đề thông báo không được để trống';
  
  if (title.length < 3) 
    return 'Tiêu đề thông báo phải có ít nhất 3 ký tự';
  
  if (title.length > 100) 
    return 'Tiêu đề thông báo không được vượt quá 100 ký tự';
  
  return true;
};

/**
 * Kiểm tra nội dung thông báo hợp lệ
 * @param {string} content - Nội dung thông báo cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateNotificationContent = (content) => {
  if (!content || content.trim() === '') 
    return 'Nội dung thông báo không đ��ợc để trống';
  
  if (content.length < 5) 
    return 'Nội dung thông báo phải có ít nhất 5 ký tự';
  
  return true;
};

/**
 * Kiểm tra loại thông báo hợp lệ
 * @param {string} type - Loại thông báo cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateNotificationType = (type) => {
  if (!type) return true; // Không bắt buộc
  
  const validTypes = ['order', 'system', 'promotion', 'account'];
  if (!validTypes.includes(type)) 
    return 'Loại thông báo không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra danh sách người nhận thông báo hợp lệ
 * @param {Array} recipients - Danh sách người nhận cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateNotificationRecipients = (recipients) => {
  if (!recipients) return true; // Không bắt buộc
  
  if (!Array.isArray(recipients)) 
    return 'Danh sách người nhận phải là một mảng';
  
  return true;
};

/**
 * Kiểm tra ID thông báo hợp lệ
 * @param {string} notificationId - ID thông báo cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateNotificationId = (notificationId) => {
  if (!notificationId || notificationId.trim() === '') 
    return 'ID thông báo không được để trống';
  
  // Kiểm tra định dạng MongoDB ObjectId
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(notificationId)) 
    return 'ID thông báo không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra form tạo thông báo
 * @param {Object} formData - Dữ liệu form tạo thông báo
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateCreateNotificationForm = (formData) => {
  const errors = {};
  
  const titleResult = validateNotificationTitle(formData.title);
  if (titleResult !== true) errors.title = titleResult;
  
  const contentResult = validateNotificationContent(formData.content);
  if (contentResult !== true) errors.content = contentResult;
  
  if (formData.type !== undefined) {
    const typeResult = validateNotificationType(formData.type);
    if (typeResult !== true) errors.type = typeResult;
  }
  
  if (formData.recipients !== undefined) {
    const recipientsResult = validateNotificationRecipients(formData.recipients);
    if (recipientsResult !== true) errors.recipients = recipientsResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form cập nhật thông báo
 * @param {Object} formData - Dữ liệu form cập nhật thông báo
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateUpdateNotificationForm = (formData) => {
  const errors = {};
  
  if (formData.title !== undefined) {
    const titleResult = validateNotificationTitle(formData.title);
    if (titleResult !== true) errors.title = titleResult;
  }
  
  if (formData.content !== undefined) {
    const contentResult = validateNotificationContent(formData.content);
    if (contentResult !== true) errors.content = contentResult;
  }
  
  if (formData.type !== undefined) {
    const typeResult = validateNotificationType(formData.type);
    if (typeResult !== true) errors.type = typeResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form đánh dấu thông báo đã đọc
 * @param {Object} formData - Dữ liệu form đánh dấu đã đọc
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateMarkAsReadForm = (formData) => {
  const errors = {};
  
  const notificationIdResult = validateNotificationId(formData.notificationId);
  if (notificationIdResult !== true) errors.notificationId = notificationIdResult;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
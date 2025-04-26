/**
 * Frontend Newsletter Validator
 * Các hàm kiểm tra dữ liệu bản tin ở phía client
 */

/**
 * Kiểm tra email đăng ký bản tin hợp lệ
 * @param {string} email - Email cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateNewsletterEmail = (email) => {
  if (!email || email.trim() === '') 
    return 'Email không được để trống';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) 
    return 'Email không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra tên người đăng ký bản tin hợp lệ
 * @param {string} name - Tên cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateNewsletterName = (name) => {
  if (!name) return true; // Không bắt buộc
  
  if (name.trim() === '') 
    return 'Tên không được để trống nếu được cung cấp';
  
  if (name.length < 2) 
    return 'Tên phải có ít nhất 2 ký tự';
  
  return true;
};

/**
 * Kiểm tra lý do hủy đăng ký bản tin hợp lệ
 * @param {string} reason - Lý do cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateUnsubscribeReason = (reason) => {
  if (!reason) return true; // Không bắt buộc
  
  if (reason.trim() === '') 
    return 'Lý do không được để trống nếu được cung cấp';
  
  if (reason.length < 5) 
    return 'Lý do phải có ít nhất 5 ký tự';
  
  return true;
};

/**
 * Kiểm tra tiêu đề chiến dịch bản tin hợp lệ
 * @param {string} title - Tiêu đề cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateCampaignTitle = (title) => {
  if (!title || title.trim() === '') 
    return 'Tiêu đề chiến dịch không được để trống';
  
  if (title.length < 5) 
    return 'Tiêu đề chiến dịch phải có ít nhất 5 ký tự';
  
  return true;
};

/**
 * Kiểm tra nội dung email bản tin hợp lệ
 * @param {string} content - Nội dung cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateCampaignContent = (content) => {
  if (!content || content.trim() === '') 
    return 'Nội dung email không được để trống';
  
  if (content.length < 20) 
    return 'Nội dung email phải có ít nhất 20 ký tự';
  
  return true;
};

/**
 * Kiểm tra chủ đề email bản tin hợp lệ
 * @param {string} subject - Chủ đề cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateCampaignSubject = (subject) => {
  if (!subject || subject.trim() === '') 
    return 'Chủ đề email không được để trống';
  
  if (subject.length < 5) 
    return 'Chủ đề email phải có ít nhất 5 ký tự';
  
  return true;
};

/**
 * Kiểm tra danh sách người nhận bản tin hợp lệ
 * @param {Array} recipients - Danh sách người nhận cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateCampaignRecipients = (recipients) => {
  if (!recipients) return true; // Không bắt buộc nếu gửi cho tất cả
  
  if (!Array.isArray(recipients)) 
    return 'Danh sách người nhận phải là một mảng';
  
  return true;
};

/**
 * Kiểm tra ngày lên lịch gửi bản tin hợp lệ
 * @param {string|Date} scheduledDate - Ngày lên lịch cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateScheduledDate = (scheduledDate) => {
  if (!scheduledDate) return true; // Không bắt buộc
  
  let date;
  
  if (scheduledDate instanceof Date) {
    date = scheduledDate;
  } else {
    date = new Date(scheduledDate);
  }
  
  if (isNaN(date.getTime())) 
    return 'Ngày lên lịch không hợp lệ';
  
  const currentDate = new Date();
  if (date <= currentDate) 
    return 'Ngày lên lịch phải lớn hơn ngày hiện tại';
  
  return true;
};

/**
 * Kiểm tra form đăng ký bản tin
 * @param {Object} formData - Dữ liệu form đăng ký bản tin
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateNewsletterSubscriptionForm = (formData) => {
  const errors = {};
  
  const emailResult = validateNewsletterEmail(formData.email);
  if (emailResult !== true) errors.email = emailResult;
  
  if (formData.name !== undefined) {
    const nameResult = validateNewsletterName(formData.name);
    if (nameResult !== true) errors.name = nameResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form hủy đăng ký bản tin
 * @param {Object} formData - Dữ liệu form hủy đăng ký bản tin
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateNewsletterUnsubscriptionForm = (formData) => {
  const errors = {};
  
  const emailResult = validateNewsletterEmail(formData.email);
  if (emailResult !== true) errors.email = emailResult;
  
  if (formData.reason !== undefined) {
    const reasonResult = validateUnsubscribeReason(formData.reason);
    if (reasonResult !== true) errors.reason = reasonResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form tạo chiến dịch bản tin
 * @param {Object} formData - Dữ liệu form tạo chiến dịch bản tin
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateNewsletterCampaignForm = (formData) => {
  const errors = {};
  
  const titleResult = validateCampaignTitle(formData.title);
  if (titleResult !== true) errors.title = titleResult;
  
  const contentResult = validateCampaignContent(formData.content);
  if (contentResult !== true) errors.content = contentResult;
  
  const subjectResult = validateCampaignSubject(formData.subject);
  if (subjectResult !== true) errors.subject = subjectResult;
  
  if (formData.recipients !== undefined) {
    const recipientsResult = validateCampaignRecipients(formData.recipients);
    if (recipientsResult !== true) errors.recipients = recipientsResult;
  }
  
  if (formData.scheduledDate !== undefined) {
    const scheduledDateResult = validateScheduledDate(formData.scheduledDate);
    if (scheduledDateResult !== true) errors.scheduledDate = scheduledDateResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
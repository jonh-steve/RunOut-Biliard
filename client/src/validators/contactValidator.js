/**
 * Frontend Contact Validator
 * Các hàm kiểm tra dữ liệu liên hệ ở phía client
 */

/**
 * Kiểm tra họ tên người liên hệ hợp lệ
 * @param {string} name - Họ tên cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateContactName = (name) => {
  if (!name || name.trim() === '') 
    return 'Họ tên không được để trống';
  
  if (name.length < 3) 
    return 'Họ tên phải có ít nhất 3 ký tự';
  
  return true;
};

/**
 * Kiểm tra email liên hệ hợp lệ
 * @param {string} email - Email cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateContactEmail = (email) => {
  if (!email || email.trim() === '') 
    return 'Email không được để trống';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) 
    return 'Email không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra số điện thoại liên hệ hợp lệ
 * @param {string} phone - Số điện thoại cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateContactPhone = (phone) => {
  if (!phone) return true; // Không bắt buộc
  
  // Kiểm tra số điện thoại Việt Nam
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!phoneRegex.test(phone)) 
    return 'Số điện thoại không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra tiêu đề liên hệ hợp lệ
 * @param {string} subject - Tiêu đề cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateContactSubject = (subject) => {
  if (!subject || subject.trim() === '') 
    return 'Tiêu đề không được để trống';
  
  if (subject.length < 5) 
    return 'Tiêu đề phải có ít nhất 5 ký tự';
  
  return true;
};

/**
 * Kiểm tra nội dung tin nhắn liên hệ hợp lệ
 * @param {string} message - Nội dung tin nhắn cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp l��
 */
export const validateContactMessage = (message) => {
  if (!message || message.trim() === '') 
    return 'Nội dung tin nhắn không được để trống';
  
  if (message.length < 10) 
    return 'Nội dung tin nhắn phải có ít nhất 10 ký tự';
  
  return true;
};

/**
 * Kiểm tra ID liên hệ hợp lệ
 * @param {string} contactId - ID liên hệ cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateContactId = (contactId) => {
  if (!contactId || contactId.trim() === '') 
    return 'ID liên hệ không được để trống';
  
  // Kiểm tra định dạng MongoDB ObjectId
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(contactId)) 
    return 'ID liên hệ không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra nội dung phản hồi liên hệ hợp lệ
 * @param {string} response - Nội dung phản hồi cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateContactResponse = (response) => {
  if (!response || response.trim() === '') 
    return 'Nội dung phản hồi không đ��ợc để trống';
  
  if (response.length < 10) 
    return 'Nội dung phản hồi phải có ít nhất 10 ký tự';
  
  return true;
};

/**
 * Kiểm tra trạng thái liên hệ hợp lệ
 * @param {string} status - Trạng thái cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateContactStatus = (status) => {
  if (!status) return true; // Không bắt buộc
  
  const validStatuses = ['pending', 'responded', 'closed'];
  if (!validStatuses.includes(status)) 
    return 'Trạng thái không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra form gửi liên hệ
 * @param {Object} formData - Dữ liệu form liên hệ
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateContactForm = (formData) => {
  const errors = {};
  
  const nameResult = validateContactName(formData.name);
  if (nameResult !== true) errors.name = nameResult;
  
  const emailResult = validateContactEmail(formData.email);
  if (emailResult !== true) errors.email = emailResult;
  
  if (formData.phone !== undefined) {
    const phoneResult = validateContactPhone(formData.phone);
    if (phoneResult !== true) errors.phone = phoneResult;
  }
  
  const subjectResult = validateContactSubject(formData.subject);
  if (subjectResult !== true) errors.subject = subjectResult;
  
  const messageResult = validateContactMessage(formData.message);
  if (messageResult !== true) errors.message = messageResult;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form phản hồi liên hệ
 * @param {Object} formData - Dữ liệu form phản hồi liên hệ
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateContactResponseForm = (formData) => {
  const errors = {};
  
  const contactIdResult = validateContactId(formData.contactId);
  if (contactIdResult !== true) errors.contactId = contactIdResult;
  
  const responseResult = validateContactResponse(formData.response);
  if (responseResult !== true) errors.response = responseResult;
  
  if (formData.status !== undefined) {
    const statusResult = validateContactStatus(formData.status);
    if (statusResult !== true) errors.status = statusResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
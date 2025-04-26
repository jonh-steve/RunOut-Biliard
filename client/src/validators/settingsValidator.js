/**
 * Frontend Settings Validator
 * Các hàm kiểm tra dữ liệu cài đặt ở phía client
 */

/**
 * Kiểm tra tên trang web hợp lệ
 * @param {string} siteName - Tên trang web cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateSiteName = (siteName) => {
  if (!siteName) return true; // Không bắt buộc
  
  if (siteName.trim() === '') 
    return 'Tên trang web không được để trống nếu được cung cấp';
  
  if (siteName.length < 2) 
    return 'Tên trang web phải có ít nhất 2 ký tự';
  
  if (siteName.length > 100) 
    return 'Tên trang web không được vượt quá 100 ký tự';
  
  return true;
};

/**
 * Kiểm tra mô tả trang web hợp lệ
 * @param {string} siteDescription - Mô tả trang web cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateSiteDescription = (siteDescription) => {
  if (!siteDescription) return true; // Không bắt buộc
  
  if (siteDescription.trim() === '') 
    return 'Mô tả trang web không được để trống nếu được cung cấp';
  
  if (siteDescription.length < 10) 
    return 'Mô tả trang web phải có ít nhất 10 ký tự';
  
  if (siteDescription.length > 500) 
    return 'Mô tả trang web không được vượt quá 500 ký tự';
  
  return true;
};

/**
 * Kiểm tra email liên hệ hợp lệ
 * @param {string} contactEmail - Email liên hệ cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateContactEmail = (contactEmail) => {
  if (!contactEmail) return true; // Không bắt buộc
  
  if (contactEmail.trim() === '') 
    return 'Email liên hệ không được để trống nếu được cung cấp';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactEmail)) 
    return 'Email liên hệ không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra số điện thoại liên hệ hợp lệ
 * @param {string} contactPhone - Số điện thoại liên hệ cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateContactPhone = (contactPhone) => {
  if (!contactPhone) return true; // Không bắt buộc
  
  if (contactPhone.trim() === '') 
    return 'Số điện thoại liên hệ không được để trống nếu được cung cấp';
  
  // Kiểm tra số điện thoại Việt Nam
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!phoneRegex.test(contactPhone)) 
    return 'Số điện thoại liên hệ không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra địa chỉ hợp lệ
 * @param {string} address - Địa chỉ cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateAddress = (address) => {
  if (!address) return true; // Không bắt buộc
  
  if (address.trim() === '') 
    return 'Địa chỉ không được để trống nếu được cung cấp';
  
  if (address.length < 10) 
    return 'Địa chỉ phải có ít nhất 10 ký tự';
  
  return true;
};

/**
 * Kiểm tra liên kết mạng xã hội hợp lệ
 * @param {Object} socialLinks - Liên kết mạng xã hội cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateSocialLinks = (socialLinks) => {
  if (!socialLinks) return true; // Không bắt buộc
  
  if (typeof socialLinks !== 'object' || Array.isArray(socialLinks)) 
    return 'Liên kết mạng xã hội phải là một đối tượng';
  
  // Kiểm tra từng URL trong đối tượng
  for (const [platform, url] of Object.entries(socialLinks)) {
    if (url && url.trim() !== '') {
      try {
        new URL(url);
      } catch (error) {
        return `URL ${platform} không hợp lệ`;
      }
    }
  }
  
  return true;
};

/**
 * Kiểm tra đơn vị tiền tệ hợp lệ
 * @param {string} currency - Đơn vị tiền tệ cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateCurrency = (currency) => {
  if (!currency) return true; // Không bắt buộc
  
  if (currency.trim() === '') 
    return 'Đơn vị tiền tệ không được để trống nếu được cung cấp';
  
  if (currency.length < 1 || currency.length > 10) 
    return 'Đơn vị tiền tệ không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra phương thức thanh toán hợp lệ
 * @param {Array} paymentMethods - Phương thức thanh toán cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validatePaymentMethods = (paymentMethods) => {
  if (!paymentMethods) return true; // Không bắt buộc
  
  if (!Array.isArray(paymentMethods)) 
    return 'Phương thức thanh toán phải là một mảng';
  
  return true;
};

/**
 * Kiểm tra dịch vụ email hợp lệ
 * @param {string} emailService - Dịch vụ email cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateEmailService = (emailService) => {
  if (!emailService) return true; // Không bắt buộc
  
  const validServices = ['smtp', 'sendgrid', 'mailgun'];
  if (!validServices.includes(emailService)) 
    return 'Dịch vụ email không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra cổng SMTP hợp lệ
 * @param {number|string} smtpPort - Cổng SMTP cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateSmtpPort = (smtpPort) => {
  if (!smtpPort) return true; // Không bắt buộc
  
  const port = Number(smtpPort);
  
  if (isNaN(port) || !Number.isInteger(port)) 
    return 'Cổng SMTP phải là số nguyên';
  
  if (port < 1 || port > 65535) 
    return 'Cổng SMTP phải từ 1 đến 65535';
  
  return true;
};

/**
 * Kiểm tra email gửi đi hợp lệ
 * @param {string} emailFrom - Email gửi đi cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateEmailFrom = (emailFrom) => {
  if (!emailFrom) return true; // Không bắt buộc
  
  if (emailFrom.trim() === '') 
    return 'Email gửi đi không được để trống nếu được cung cấp';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailFrom)) 
    return 'Email gửi đi không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra email trả lời hợp lệ
 * @param {string} emailReplyTo - Email trả lời cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateEmailReplyTo = (emailReplyTo) => {
  if (!emailReplyTo) return true; // Không bắt buộc
  
  if (emailReplyTo.trim() === '') 
    return 'Email trả lời không được để trống nếu được cung cấp';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailReplyTo)) 
    return 'Email trả lời không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra phương thức vận chuyển hợp lệ
 * @param {Array} shippingMethods - Phương thức vận chuyển cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateShippingMethods = (shippingMethods) => {
  if (!shippingMethods) return true; // Không bắt buộc
  
  if (!Array.isArray(shippingMethods)) 
    return 'Phương thức vận chuyển phải là một mảng';
  
  return true;
};

/**
 * Kiểm tra ngưỡng miễn phí vận chuyển hợp lệ
 * @param {number|string} freeShippingThreshold - Ngưỡng miễn phí vận chuyển cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateFreeShippingThreshold = (freeShippingThreshold) => {
  if (freeShippingThreshold === undefined || freeShippingThreshold === null) return true; // Không bắt buộc
  
  const threshold = Number(freeShippingThreshold);
  
  if (isNaN(threshold)) 
    return 'Ngưỡng miễn phí vận chuyển phải là số';
  
  if (threshold < 0) 
    return 'Ngưỡng miễn phí vận chuyển không được âm';
  
  return true;
};

/**
 * Kiểm tra phí vận chuyển mặc định hợp lệ
 * @param {number|string} defaultShippingFee - Phí vận chuyển mặc định cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateDefaultShippingFee = (defaultShippingFee) => {
  if (defaultShippingFee === undefined || defaultShippingFee === null) return true; // Không bắt buộc
  
  const fee = Number(defaultShippingFee);
  
  if (isNaN(fee)) 
    return 'Phí vận chuyển mặc định phải là số';
  
  if (fee < 0) 
    return 'Phí vận chuyển mặc định không được âm';
  
  return true;
};

/**
 * Kiểm tra vùng vận chuyển hợp lệ
 * @param {Array} shippingZones - Vùng vận chuyển cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateShippingZones = (shippingZones) => {
  if (!shippingZones) return true; // Không bắt buộc
  
  if (!Array.isArray(shippingZones)) 
    return 'Vùng vận chuyển phải là một mảng';
  
  return true;
};

/**
 * Kiểm tra form cài đặt chung
 * @param {Object} formData - Dữ liệu form cài đặt chung
 * @returns {Object} - K��t quả kiểm tra với isValid và errors
 */
export const validateGeneralSettingsForm = (formData) => {
  const errors = {};
  
  if (formData.siteName !== undefined) {
    const siteNameResult = validateSiteName(formData.siteName);
    if (siteNameResult !== true) errors.siteName = siteNameResult;
  }
  
  if (formData.siteDescription !== undefined) {
    const siteDescriptionResult = validateSiteDescription(formData.siteDescription);
    if (siteDescriptionResult !== true) errors.siteDescription = siteDescriptionResult;
  }
  
  if (formData.contactEmail !== undefined) {
    const contactEmailResult = validateContactEmail(formData.contactEmail);
    if (contactEmailResult !== true) errors.contactEmail = contactEmailResult;
  }
  
  if (formData.contactPhone !== undefined) {
    const contactPhoneResult = validateContactPhone(formData.contactPhone);
    if (contactPhoneResult !== true) errors.contactPhone = contactPhoneResult;
  }
  
  if (formData.address !== undefined) {
    const addressResult = validateAddress(formData.address);
    if (addressResult !== true) errors.address = addressResult;
  }
  
  if (formData.socialLinks !== undefined) {
    const socialLinksResult = validateSocialLinks(formData.socialLinks);
    if (socialLinksResult !== true) errors.socialLinks = socialLinksResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form cài đặt thanh toán
 * @param {Object} formData - Dữ liệu form cài đặt thanh toán
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validatePaymentSettingsForm = (formData) => {
  const errors = {};
  
  if (formData.currency !== undefined) {
    const currencyResult = validateCurrency(formData.currency);
    if (currencyResult !== true) errors.currency = currencyResult;
  }
  
  if (formData.paymentMethods !== undefined) {
    const paymentMethodsResult = validatePaymentMethods(formData.paymentMethods);
    if (paymentMethodsResult !== true) errors.paymentMethods = paymentMethodsResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form cài đặt email
 * @param {Object} formData - Dữ liệu form cài đặt email
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateEmailSettingsForm = (formData) => {
  const errors = {};
  
  if (formData.emailService !== undefined) {
    const emailServiceResult = validateEmailService(formData.emailService);
    if (emailServiceResult !== true) errors.emailService = emailServiceResult;
  }
  
  if (formData.smtpPort !== undefined) {
    const smtpPortResult = validateSmtpPort(formData.smtpPort);
    if (smtpPortResult !== true) errors.smtpPort = smtpPortResult;
  }
  
  if (formData.emailFrom !== undefined) {
    const emailFromResult = validateEmailFrom(formData.emailFrom);
    if (emailFromResult !== true) errors.emailFrom = emailFromResult;
  }
  
  if (formData.emailReplyTo !== undefined) {
    const emailReplyToResult = validateEmailReplyTo(formData.emailReplyTo);
    if (emailReplyToResult !== true) errors.emailReplyTo = emailReplyToResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form cài đặt vận chuyển
 * @param {Object} formData - Dữ liệu form cài đặt vận chuyển
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateShippingSettingsForm = (formData) => {
  const errors = {};
  
  if (formData.shippingMethods !== undefined) {
    const shippingMethodsResult = validateShippingMethods(formData.shippingMethods);
    if (shippingMethodsResult !== true) errors.shippingMethods = shippingMethodsResult;
  }
  
  if (formData.freeShippingThreshold !== undefined) {
    const freeShippingThresholdResult = validateFreeShippingThreshold(formData.freeShippingThreshold);
    if (freeShippingThresholdResult !== true) errors.freeShippingThreshold = freeShippingThresholdResult;
  }
  
  if (formData.defaultShippingFee !== undefined) {
    const defaultShippingFeeResult = validateDefaultShippingFee(formData.defaultShippingFee);
    if (defaultShippingFeeResult !== true) errors.defaultShippingFee = defaultShippingFeeResult;
  }
  
  if (formData.shippingZones !== undefined) {
    const shippingZonesResult = validateShippingZones(formData.shippingZones);
    if (shippingZonesResult !== true) errors.shippingZones = shippingZonesResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
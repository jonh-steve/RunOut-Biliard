/**
 * Frontend Address Validator
 * Các hàm kiểm tra dữ liệu địa chỉ ở phía client
 */

/**
 * Kiểm tra họ tên người nhận hợp lệ
 * @param {string} fullName - Họ tên cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateFullName = (fullName) => {
  if (!fullName || fullName.trim() === '') 
    return 'Họ tên không được để trống';
  
  if (fullName.length < 3) 
    return 'Họ tên phải có ít nhất 3 ký tự';
  
  return true;
};

/**
 * Kiểm tra số điện thoại hợp lệ
 * @param {string} phone - Số điện thoại cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') 
    return 'Số điện thoại không được để trống';
  
  // Kiểm tra số điện thoại Việt Nam
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!phoneRegex.test(phone)) 
    return 'Số điện thoại không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra tỉnh/thành phố hợp lệ
 * @param {string} province - Tỉnh/thành phố cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateProvince = (province) => {
  if (!province || province.trim() === '') 
    return 'Tỉnh/Thành phố không được để trống';
  
  return true;
};

/**
 * Kiểm tra quận/huyện hợp lệ
 * @param {string} district - Quận/huyện cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateDistrict = (district) => {
  if (!district || district.trim() === '') 
    return 'Quận/Huyện không được để trống';
  
  return true;
};

/**
 * Kiểm tra phường/xã hợp lệ
 * @param {string} ward - Phường/xã cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateWard = (ward) => {
  if (!ward || ward.trim() === '') 
    return 'Phường/Xã không được để trống';
  
  return true;
};

/**
 * Kiểm tra địa chỉ chi tiết hợp lệ
 * @param {string} street - Địa ch��� chi tiết cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateStreet = (street) => {
  if (!street || street.trim() === '') 
    return 'Địa chỉ chi tiết không được để trống';
  
  if (street.length < 5) 
    return 'Địa chỉ chi tiết phải có ít nhất 5 ký tự';
  
  return true;
};

/**
 * Kiểm tra form tạo/cập nhật địa chỉ
 * @param {Object} formData - Dữ liệu form địa chỉ
 * @param {boolean} isUpdate - Có phải đang cập nhật không (nếu true, một số trường có thể không bắt buộc)
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateAddressForm = (formData, isUpdate = false) => {
  const errors = {};
  
  // Nếu đang cập nhật, chỉ kiểm tra các trường được cung cấp
  if (isUpdate) {
    if (formData.fullName !== undefined) {
      const fullNameResult = validateFullName(formData.fullName);
      if (fullNameResult !== true) errors.fullName = fullNameResult;
    }
    
    if (formData.phone !== undefined) {
      const phoneResult = validatePhone(formData.phone);
      if (phoneResult !== true) errors.phone = phoneResult;
    }
    
    if (formData.province !== undefined) {
      const provinceResult = validateProvince(formData.province);
      if (provinceResult !== true) errors.province = provinceResult;
    }
    
    if (formData.district !== undefined) {
      const districtResult = validateDistrict(formData.district);
      if (districtResult !== true) errors.district = districtResult;
    }
    
    if (formData.ward !== undefined) {
      const wardResult = validateWard(formData.ward);
      if (wardResult !== true) errors.ward = wardResult;
    }
    
    if (formData.street !== undefined) {
      const streetResult = validateStreet(formData.street);
      if (streetResult !== true) errors.street = streetResult;
    }
  } else {
    // Nếu đang tạo mới, kiểm tra tất cả các trường bắt buộc
    const fullNameResult = validateFullName(formData.fullName);
    if (fullNameResult !== true) errors.fullName = fullNameResult;
    
    const phoneResult = validatePhone(formData.phone);
    if (phoneResult !== true) errors.phone = phoneResult;
    
    const provinceResult = validateProvince(formData.province);
    if (provinceResult !== true) errors.province = provinceResult;
    
    const districtResult = validateDistrict(formData.district);
    if (districtResult !== true) errors.district = districtResult;
    
    const wardResult = validateWard(formData.ward);
    if (wardResult !== true) errors.ward = wardResult;
    
    const streetResult = validateStreet(formData.street);
    if (streetResult !== true) errors.street = streetResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
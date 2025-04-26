/**
 * Frontend Admin Validator
 * Các hàm kiểm tra dữ liệu quản trị ở phía client
 */

/**
 * Kiểm tra vai trò người dùng hợp lệ
 * @param {string} role - Vai trò cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateRole = (role) => {
  if (!role || role.trim() === '') 
    return 'Vai trò không được để trống';
  
  const validRoles = ['user', 'admin', 'editor', 'manager'];
  if (!validRoles.includes(role)) 
    return 'Vai trò không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra trạng thái người dùng hợp lệ
 * @param {string} status - Trạng thái cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateStatus = (status) => {
  if (!status || status.trim() === '') 
    return 'Trạng thái không được để trống';
  
  const validStatuses = ['active', 'inactive', 'blocked'];
  if (!validStatuses.includes(status)) 
    return 'Trạng thái không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra ID người dùng hợp lệ
 * @param {string} userId - ID người dùng cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateUserId = (userId) => {
  if (!userId || userId.trim() === '') 
    return 'ID người dùng không được để trống';
  
  // Kiểm tra định dạng MongoDB ObjectId
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(userId)) 
    return 'ID người dùng không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra mật khẩu mới hợp lệ
 * @param {string} newPassword - Mật khẩu mới cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateNewPassword = (newPassword) => {
  if (!newPassword || newPassword.trim() === '') 
    return 'Mật khẩu mới không được để trống';
  
  if (newPassword.length < 6) 
    return 'Mật khẩu mới phải có ít nhất 6 ký tự';
  
  return true;
};

/**
 * Kiểm tra trạng thái phê duyệt hợp lệ
 * @param {string} status - Trạng thái phê duyệt cần kiểm tra
 * @returns {boolean|string} - true nếu h���p lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateApprovalStatus = (status) => {
  if (!status || status.trim() === '') 
    return 'Trạng thái không được để trống';
  
  const validStatuses = ['approved', 'rejected', 'pending'];
  if (!validStatuses.includes(status)) 
    return 'Trạng thái không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra lý do từ chối hợp lệ
 * @param {string} reason - Lý do từ chối cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateRejectionReason = (reason) => {
  if (!reason) return true; // Không bắt buộc nếu không từ chối
  
  if (reason.trim() === '') 
    return 'Lý do không được để trống nếu được cung cấp';
  
  if (reason.length < 5) 
    return 'Lý do phải có ít nhất 5 ký tự';
  
  return true;
};

/**
 * Kiểm tra ngày bắt đầu hợp lệ
 * @param {string|Date} startDate - Ngày bắt đầu cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateStartDate = (startDate) => {
  if (!startDate) return true; // Không bắt buộc
  
  try {
    new Date(startDate);
    return true;
  } catch (error) {
    return 'Ngày bắt đầu không hợp lệ';
  }
};

/**
 * Kiểm tra ngày kết thúc hợp lệ
 * @param {string|Date} endDate - Ngày kết thúc cần kiểm tra
 * @param {string|Date} startDate - Ngày bắt đầu để so sánh
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateEndDate = (endDate, startDate) => {
  if (!endDate) return true; // Không bắt buộc
  
  try {
    const end = new Date(endDate);
    
    if (startDate) {
      const start = new Date(startDate);
      if (end <= start) {
        return 'Ngày kết thúc phải lớn hơn ngày bắt đầu';
      }
    }
    
    return true;
  } catch (error) {
    return 'Ngày kết thúc không hợp lệ';
  }
};

/**
 * Kiểm tra tham số tìm kiếm người dùng hợp lệ
 * @param {Object} searchParams - Tham số tìm kiếm cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateUserSearchParams = (searchParams) => {
  if (!searchParams) return true;
  
  if (searchParams.role && !['user', 'admin', 'editor', 'manager', 'all'].includes(searchParams.role)) {
    return 'Vai trò tìm kiếm không hợp lệ';
  }
  
  if (searchParams.status && !['active', 'inactive', 'blocked', 'all'].includes(searchParams.status)) {
    return 'Trạng thái tìm kiếm không hợp lệ';
  }
  
  if (searchParams.sortBy && !['createdAt', 'firstname', 'lastname', 'email', 'role', 'status'].includes(searchParams.sortBy)) {
    return 'Trường sắp xếp không hợp lệ';
  }
  
  if (searchParams.sortOrder && !['asc', 'desc'].includes(searchParams.sortOrder)) {
    return 'Thứ tự sắp xếp không hợp lệ';
  }
  
  return true;
};

/**
 * Kiểm tra form tạo người dùng bởi admin
 * @param {Object} formData - Dữ liệu form tạo người dùng
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateAdminCreateUserForm = (formData) => {
  const errors = {};
  
  if (!formData.firstname || formData.firstname.trim() === '') {
    errors.firstname = 'Họ không được để trống';
  } else if (formData.firstname.length < 2) {
    errors.firstname = 'Họ phải có ít nhất 2 ký tự';
  }
  
  if (!formData.lastname || formData.lastname.trim() === '') {
    errors.lastname = 'Tên không được để trống';
  } else if (formData.lastname.length < 2) {
    errors.lastname = 'Tên phải có ít nhất 2 ký tự';
  }
  
  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'Email không được để trống';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }
  }
  
  if (!formData.password || formData.password.trim() === '') {
    errors.password = 'Mật khẩu không được để trống';
  } else if (formData.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }
  
  if (formData.mobile) {
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.mobile)) {
      errors.mobile = 'Số điện thoại không hợp lệ';
    }
  }
  
  const roleResult = validateRole(formData.role);
  if (roleResult !== true) errors.role = roleResult;
  
  if (formData.status) {
    const statusResult = validateStatus(formData.status);
    if (statusResult !== true) errors.status = statusResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form cập nhật người dùng bởi admin
 * @param {Object} formData - Dữ liệu form cập nhật người dùng
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateAdminUpdateUserForm = (formData) => {
  const errors = {};
  
  if (formData.firstname !== undefined) {
    if (formData.firstname.trim() === '') {
      errors.firstname = 'Họ không được để trống nếu được cung cấp';
    } else if (formData.firstname.length < 2) {
      errors.firstname = 'Họ phải có ít nhất 2 ký tự';
    }
  }
  
  if (formData.lastname !== undefined) {
    if (formData.lastname.trim() === '') {
      errors.lastname = 'Tên không được để trống nếu được cung cấp';
    } else if (formData.lastname.length < 2) {
      errors.lastname = 'Tên phải có ít nhất 2 ký tự';
    }
  }
  
  if (formData.email !== undefined) {
    if (formData.email.trim() === '') {
      errors.email = 'Email không được để trống nếu được cung cấp';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Email không hợp lệ';
      }
    }
  }
  
  if (formData.mobile !== undefined && formData.mobile !== '') {
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.mobile)) {
      errors.mobile = 'Số điện thoại không hợp lệ';
    }
  }
  
  if (formData.role !== undefined) {
    const roleResult = validateRole(formData.role);
    if (roleResult !== true) errors.role = roleResult;
  }
  
  if (formData.status !== undefined) {
    const statusResult = validateStatus(formData.status);
    if (statusResult !== true) errors.status = statusResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form đặt lại mật khẩu bởi admin
 * @param {Object} formData - Dữ liệu form đặt lại mật khẩu
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateAdminResetPasswordForm = (formData) => {
  const errors = {};
  
  const userIdResult = validateUserId(formData.userId);
  if (userIdResult !== true) errors.userId = userIdResult;
  
  const newPasswordResult = validateNewPassword(formData.newPassword);
  if (newPasswordResult !== true) errors.newPassword = newPasswordResult;
  
  if (formData.confirmPassword !== formData.newPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form cập nhật trạng thái người dùng bởi admin
 * @param {Object} formData - Dữ liệu form cập nhật trạng thái
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateAdminUpdateUserStatusForm = (formData) => {
  const errors = {};
  
  const userIdResult = validateUserId(formData.userId);
  if (userIdResult !== true) errors.userId = userIdResult;
  
  const statusResult = validateStatus(formData.status);
  if (statusResult !== true) errors.status = statusResult;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form cập nhật vai trò người dùng bởi admin
 * @param {Object} formData - Dữ liệu form cập nhật vai trò
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateAdminUpdateUserRoleForm = (formData) => {
  const errors = {};
  
  const userIdResult = validateUserId(formData.userId);
  if (userIdResult !== true) errors.userId = userIdResult;
  
  const roleResult = validateRole(formData.role);
  if (roleResult !== true) errors.role = roleResult;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form phê duyệt sản phẩm bởi admin
 * @param {Object} formData - Dữ liệu form phê duyệt sản phẩm
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateAdminProductApprovalForm = (formData) => {
  const errors = {};
  
  if (!formData.productId || formData.productId.trim() === '') {
    errors.productId = 'ID sản phẩm không được để trống';
  } else {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(formData.productId)) {
      errors.productId = 'ID sản phẩm không hợp lệ';
    }
  }
  
  const statusResult = validateApprovalStatus(formData.status);
  if (statusResult !== true) errors.status = statusResult;
  
  if (formData.status === 'rejected') {
    const reasonResult = validateRejectionReason(formData.reason);
    if (reasonResult !== true) errors.reason = reasonResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form phê duyệt bài viết bởi admin
 * @param {Object} formData - Dữ liệu form phê duyệt bài viết
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateAdminBlogApprovalForm = (formData) => {
  const errors = {};
  
  if (!formData.blogId || formData.blogId.trim() === '') {
    errors.blogId = 'ID bài viết không được để trống';
  } else {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(formData.blogId)) {
      errors.blogId = 'ID bài viết không hợp lệ';
    }
  }
  
  const statusResult = validateApprovalStatus(formData.status);
  if (statusResult !== true) errors.status = statusResult;
  
  if (formData.status === 'rejected') {
    const reasonResult = validateRejectionReason(formData.reason);
    if (reasonResult !== true) errors.reason = reasonResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form khoảng thời gian bảng điều khiển admin
 * @param {Object} formData - Dữ liệu form khoảng thời gian
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateAdminDashboardDateRangeForm = (formData) => {
  const errors = {};
  
  const startDateResult = validateStartDate(formData.startDate);
  if (startDateResult !== true) errors.startDate = startDateResult;
  
  const endDateResult = validateEndDate(formData.endDate, formData.startDate);
  if (endDateResult !== true) errors.endDate = endDateResult;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
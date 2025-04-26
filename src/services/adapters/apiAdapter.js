/**
 * Adapter cho dữ liệu người dùng
 * @param {Object} userData - Dữ liệu người dùng từ API
 * @returns {Object} - Dữ liệu người dùng đã được chuyển đổi
 */
export const adaptUserData = (userData) => {
  if (!userData) return null;
  
  return {
    id: userData.id,
    name: userData.name || userData.fullName,
    email: userData.email,
    phone: userData.phone || userData.phoneNumber,
    avatar: userData.avatar || userData.profileImage || null,
    role: userData.role || 'user',
    createdAt: userData.createdAt ? new Date(userData.createdAt) : null,
    updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : null,
    // Thêm các trường khác nếu cần
  };
};

/**
 * Adapter cho dữ liệu sản phẩm
 * @param {Object} productData - Dữ liệu sản phẩm từ API
 * @returns {Object} - Dữ liệu sản phẩm đã được chuyển đổi
 */
export const adaptProductData = (productData) => {
  if (!productData) return null;
  
  return {
    id: productData.id,
    name: productData.name || productData.title,
    description: productData.description,
    price: productData.price,
    originalPrice: productData.originalPrice || productData.price,
    discount: productData.discount || 0,
    images: Array.isArray(productData.images) 
      ? productData.images 
      : (productData.image ? [productData.image] : []),
    thumbnail: productData.thumbnail || (Array.isArray(productData.images) ? productData.images[0] : productData.image),
    category: productData.category,
    categoryId: productData.categoryId || (productData.category ? productData.category.id : null),
    stock: productData.stock || productData.inventory || 0,
    rating: productData.rating || productData.averageRating || 0,
    reviewCount: productData.reviewCount || 0,
    isNew: productData.isNew || false,
    isFeatured: productData.isFeatured || false,
    createdAt: productData.createdAt ? new Date(productData.createdAt) : null,
    updatedAt: productData.updatedAt ? new Date(productData.updatedAt) : null,
  };
};

/**
 * Adapter cho dữ liệu giỏ hàng
 * @param {Object} cartData - Dữ liệu giỏ hàng từ API
 * @returns {Object} - Dữ liệu giỏ hàng đã được chuyển đổi
 */
export const adaptCartData = (cartData) => {
  if (!cartData) return { items: [], totalItems: 0, subtotal: 0, total: 0 };
  
  const items = Array.isArray(cartData.items) 
    ? cartData.items.map(item => ({
        id: item.id,
        productId: item.productId,
        product: item.product ? adaptProductData(item.product) : null,
        quantity: item.quantity,
        price: item.price,
        total: item.total || item.price * item.quantity,
      }))
    : [];
  
  return {
    id: cartData.id,
    items,
    totalItems: cartData.totalItems || items.length,
    subtotal: cartData.subtotal || items.reduce((sum, item) => sum + item.total, 0),
    discount: cartData.discount || 0,
    coupon: cartData.coupon || null,
    total: cartData.total || (cartData.subtotal - cartData.discount) || 0,
  };
};

/**
 * Adapter cho dữ liệu đơn hàng
 * @param {Object} orderData - Dữ liệu đơn hàng từ API
 * @returns {Object} - Dữ liệu đơn hàng đã được chuyển đổi
 */
export const adaptOrderData = (orderData) => {
  if (!orderData) return null;
  
  const items = Array.isArray(orderData.items) 
    ? orderData.items.map(item => ({
        id: item.id,
        productId: item.productId,
        product: item.product ? adaptProductData(item.product) : null,
        quantity: item.quantity,
        price: item.price,
        total: item.total || item.price * item.quantity,
      }))
    : [];
  
  return {
    id: orderData.id,
    orderNumber: orderData.orderNumber,
    userId: orderData.userId,
    items,
    status: orderData.status,
    paymentStatus: orderData.paymentStatus,
    paymentMethod: orderData.paymentMethod,
    shippingAddress: orderData.shippingAddress,
    billingAddress: orderData.billingAddress,
    subtotal: orderData.subtotal,
    shippingFee: orderData.shippingFee || 0,
    discount: orderData.discount || 0,
    tax: orderData.tax || 0,
    total: orderData.total,
    notes: orderData.notes || '',
    createdAt: orderData.createdAt ? new Date(orderData.createdAt) : null,
    updatedAt: orderData.updatedAt ? new Date(orderData.updatedAt) : null,
  };
};

/**
 * Adapter cho dữ liệu đánh giá
 * @param {Object} reviewData - Dữ liệu đánh giá từ API
 * @returns {Object} - Dữ liệu đánh giá đã được chuyển đổi
 */
export const adaptReviewData = (reviewData) => {
  if (!reviewData) return null;
  
  return {
    id: reviewData.id,
    productId: reviewData.productId,
    userId: reviewData.userId,
    user: reviewData.user ? adaptUserData(reviewData.user) : null,
    rating: reviewData.rating,
    comment: reviewData.comment || reviewData.content || '',
    createdAt: reviewData.createdAt ? new Date(reviewData.createdAt) : null,
    updatedAt: reviewData.updatedAt ? new Date(reviewData.updatedAt) : null,
  };
};
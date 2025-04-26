/**
 * Frontend Validators Index
 * Tập hợp tất cả các validator ở phía client để dễ dàng import
 */

// Import các validator
import * as userValidator from './userValidator';
import * as productValidator from './productValidator';
import * as orderValidator from './orderValidator';
import * as couponValidator from './couponValidator';
import * as blogValidator from './blogValidator';
import * as brandValidator from './brandValidator';
import * as addressValidator from './addressValidator';
import * as reviewValidator from './reviewValidator';
import * as paymentValidator from './paymentValidator';
import * as wishlistValidator from './wishlistValidator';
import * as cartValidator from './cartValidator';
import * as notificationValidator from './notificationValidator';
import * as contactValidator from './contactValidator';
import * as newsletterValidator from './newsletterValidator';
import * as settingsValidator from './settingsValidator';
import * as seoValidator from './seoValidator';
import * as adminValidator from './adminValidator';

// Export tất cả các validator
export {
    userValidator,
    productValidator,
    orderValidator,
    couponValidator,
    blogValidator,
    brandValidator,
    addressValidator,
    reviewValidator,
    paymentValidator,
    wishlistValidator,
    cartValidator,
    notificationValidator,
    contactValidator,
    newsletterValidator,
    settingsValidator,
    seoValidator,
    adminValidator
};

// Export các hàm validator cụ thể để dễ dàng sử dụng
export const {
    validateEmail,
    validatePassword,
    validateFirstname,
    validateLastname,
    validateMobile,
    validateRegisterForm,
    validateLoginForm,
    validateUpdateUserForm,
    validateResetPasswordForm
} = userValidator;

export const {
    validateProductTitle,
    validateProductPrice,
    validateProductDescription,
    validateProductCategory,
    validateProductQuantity,
    validateProductImages,
    validateProductForm,
    validateProductRating
} = productValidator;

export const {
    validateOrderProducts,
    validateOrderAddress,
    validatePaymentMethod,
    validateTotalPrice,
    validateOrderStatus,
    validateOrderForm,
    validateUpdateOrderStatusForm
} = orderValidator;

export const {
    validateCouponName,
    validateCouponDiscount,
    validateCouponExpiry,
    validateMinOrderAmount,
    validateMaxUsage,
    validateCouponForm,
    validateApplyCouponForm
} = couponValidator;

export const {
    validateBlogTitle,
    validateBlogDescription,
    validateBlogCategory,
    validateBlogContent,
    validateBlogTags,
    validateCommentContent,
    validateBlogForm,
    validateCommentForm
} = blogValidator;

export const {
    validateBrandTitle,
    validateBrandDescription,
    validateBrandWebsite,
    validateBrandForm
} = brandValidator;

export const {
    validateFullName,
    validatePhone,
    validateProvince,
    validateDistrict,
    validateWard,
    validateStreet,
    validateAddressForm
} = addressValidator;

export const {
    validateReviewStar,
    validateReviewComment,
    validateProductId,
    validateReviewImages,
    validateReplyContent,
    validateReviewId,
    validateCreateReviewForm,
    validateUpdateReviewForm,
    validateReplyForm
} = reviewValidator;

export const {
    validateOrderId,
    validatePaymentAmount,
    validatePaymentMethod: validatePaymentMethodType,
    validatePaymentStatus,
    validatePaymentId,
    validateTransactionId,
    validateRefundReason,
    validateCreatePaymentForm,
    validateUpdatePaymentForm,
    validateVerifyPaymentForm,
    validateRefundRequestForm
} = paymentValidator;

export const {
    validateProductId: validateWishlistProductId,
    validateAddToWishlistForm,
    validateRemoveFromWishlistForm
} = wishlistValidator;

export const {
    validateProductId: validateCartProductId,
    validateQuantity,
    validateCartItemId,
    validateCouponCode,
    validateAddToCartForm,
    validateUpdateCartItemForm,
    validateRemoveFromCartForm,
    validateApplyCouponForm: validateCartApplyCouponForm
} = cartValidator;

export const {
    validateNotificationTitle,
    validateNotificationContent,
    validateNotificationType,
    validateNotificationRecipients,
    validateNotificationId,
    validateCreateNotificationForm,
    validateUpdateNotificationForm,
    validateMarkAsReadForm
} = notificationValidator;

export const {
    validateContactName,
    validateContactEmail,
    validateContactPhone,
    validateContactSubject,
    validateContactMessage,
    validateContactId,
    validateContactResponse,
    validateContactStatus,
    validateContactForm,
    validateContactResponseForm
} = contactValidator;

export const {
    validateNewsletterEmail,
    validateNewsletterName,
    validateUnsubscribeReason,
    validateCampaignTitle,
    validateCampaignContent,
    validateCampaignSubject,
    validateCampaignRecipients,
    validateScheduledDate,
    validateNewsletterSubscriptionForm,
    validateNewsletterUnsubscriptionForm,
    validateNewsletterCampaignForm
} = newsletterValidator;

export const {
    validateSiteName,
    validateSiteDescription,
    validateContactEmail: validateSettingsContactEmail,
    validateContactPhone: validateSettingsContactPhone,
    validateAddress: validateSettingsAddress,
    validateSocialLinks,
    validateCurrency,
    validatePaymentMethods,
    validateEmailService,
    validateSmtpPort,
    validateEmailFrom,
    validateEmailReplyTo,
    validateShippingMethods,
    validateFreeShippingThreshold,
    validateDefaultShippingFee,
    validateShippingZones,
    validateGeneralSettingsForm,
    validatePaymentSettingsForm,
    validateEmailSettingsForm,
    validateShippingSettingsForm
} = settingsValidator;

export const {
    validateMetaTitle,
    validateMetaDescription,
    validateMetaKeywords,
    validateOgTitle,
    validateOgDescription,
    validateTwitterTitle,
    validateTwitterDescription,
    validateCanonicalUrl,
    validateSitemapSettings,
    validateStructuredData,
    validatePageId,
    validateProductId: validateSeoProductId,
    validateBlogId,
    validateSeoSettingsForm,
    validatePageSeoForm,
    validateProductSeoForm,
    validateBlogSeoForm
} = seoValidator;

export const {
    validateRole,
    validateStatus,
    validateAdminCreateUserForm,
    validateAdminUpdateUserForm,
    validateUserId,
    validateUserSearchParams
} = adminValidator;
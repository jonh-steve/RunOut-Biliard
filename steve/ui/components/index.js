/**
 * Thư viện component nội bộ
 * Tập hợp các component dùng chung từ dự án RunOut
 */

// Layout Components
export { default as Header } from './layout/Header';
export { default as Footer } from './layout/Footer';
export { default as Sidebar } from './layout/Sidebar';
export { default as Container } from './layout/Container';
export { default as PageLayout } from './layout/PageLayout';

// UI Components
export { default as Button } from './ui/Button';
export { default as Card } from './ui/Card';
export { default as Modal } from './ui/Modal';
export { default as Dropdown } from './ui/Dropdown';
export { default as Table } from './ui/Table';
export { default as Pagination } from './ui/Pagination';
export { default as Tabs } from './ui/Tabs';
export { default as Alert } from './ui/Alert';
export { default as Badge } from './ui/Badge';
export { default as Spinner } from './ui/Spinner';
export { default as Tooltip } from './ui/Tooltip';

// Form Components
export { default as Input } from './form/Input';
export { default as Select } from './form/Select';
export { default as Checkbox } from './form/Checkbox';
export { default as RadioButton } from './form/RadioButton';
export { default as TextArea } from './form/TextArea';
export { default as DatePicker } from './form/DatePicker';
export { default as FileUpload } from './form/FileUpload';
export { default as Form } from './form/Form';
export { default as FormGroup } from './form/FormGroup';
export { default as FormLabel } from './form/FormLabel';
export { default as FormError } from './form/FormError';

// Data Display Components
export { default as ProductCard } from './data-display/ProductCard';
export { default as OrderSummary } from './data-display/OrderSummary';
export { default as UserProfile } from './data-display/UserProfile';
export { default as CategoryList } from './data-display/CategoryList';
export { default as ReviewItem } from './data-display/ReviewItem';
export { default as PriceTag } from './data-display/PriceTag';
export { default as Breadcrumbs } from './data-display/Breadcrumbs';

// Chart Components
export { default as LineChart } from './charts/LineChart';
export { default as BarChart } from './charts/BarChart';
export { default as PieChart } from './charts/PieChart';
export { default as DashboardStats } from './charts/DashboardStats';

// Utility Components
export { default as ErrorBoundary } from './utility/ErrorBoundary';
export { default as LazyImage } from './utility/LazyImage';
export { default as SEO } from './utility/SEO';
export { default as ScrollToTop } from './utility/ScrollToTop';
export { default as PrivateRoute } from './utility/PrivateRoute';

/**
 * Hướng dẫn sử dụng:
 * 
 * Import các component từ thư viện:
 * ```
 * import { Button, Card, ProductCard } from '@steve/components';
 * ```
 * 
 * Để xem tài liệu và ví dụ sử dụng, chạy Storybook:
 * ```
 * npm run storybook
 * ```
 */
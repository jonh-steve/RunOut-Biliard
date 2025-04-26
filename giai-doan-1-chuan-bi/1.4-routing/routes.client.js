import React from 'react';
import { Navigate } from 'react-router-dom';

// Layout
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';
import DashboardLayout from '../components/layout/DashboardLayout';

// Pages
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import ProfilePage from '../pages/account/ProfilePage';
import OrdersPage from '../pages/account/OrdersPage';
import OrderDetailPage from '../pages/account/OrderDetailPage';
import AddressesPage from '../pages/account/AddressesPage';
import WishlistPage from '../pages/account/WishlistPage';
import NotFoundPage from '../pages/NotFoundPage';

// Auth guard
import AuthGuard from '../components/guards/AuthGuard';
import GuestGuard from '../components/guards/GuestGuard';

/**
 * Application routes configuration
 * 
 * This file defines all routes for the application, organized by layout.
 * Each route object contains:
 * - path: URL path for the route
 * - element: Component to render for this route
 * - children: Nested routes (if applicable)
 * 
 * Routes are protected using AuthGuard (for authenticated users only)
 * or GuestGuard (for non-authenticated users only) when necessary.
 */
const routes = [
  // Main layout routes (public pages)
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/:id', element: <ProductDetailPage /> },
      { path: '/cart', element: <CartPage /> },
      {
        path: '/checkout',
        element: (
          <AuthGuard>
            <CheckoutPage />
          </AuthGuard>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  
  // Auth layout routes (login, register, etc.)
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: '/auth', element: <Navigate to="/auth/login" /> },
      {
        path: '/auth/login',
        element: (
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        ),
      },
      {
        path: '/auth/register',
        element: (
          <GuestGuard>
            <RegisterPage />
          </GuestGuard>
        ),
      },
      { path: '/auth/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/auth/reset-password', element: <ResetPasswordPage /> },
    ],
  },
  
  // Dashboard layout routes (protected account pages)
  {
    path: '/account',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { path: '/account', element: <Navigate to="/account/profile" /> },
      { path: '/account/profile', element: <ProfilePage /> },
      { path: '/account/orders', element: <OrdersPage /> },
      { path: '/account/orders/:id', element: <OrderDetailPage /> },
      { path: '/account/addresses', element: <AddressesPage /> },
      { path: '/account/wishlist', element: <WishlistPage /> },
    ],
  },
];

export default routes;
import React from 'react';
import { Navigate } from 'react-router-dom';

// Layout
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import DashboardLayout from '../components/layouts/DashboardLayout';

// Pages
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import ProfilePage from '../pages/ProfilePage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import AddressesPage from '../pages/AddressesPage';
import WishlistPage from '../pages/WishlistPage';
import NotFoundPage from '../pages/NotFoundPage';

// Auth guard
import AuthGuard from '../components/guards/AuthGuard';
import GuestGuard from '../components/guards/GuestGuard';

const routes = [
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
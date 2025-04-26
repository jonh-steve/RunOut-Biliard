import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppProvider from './context/AppProvider';
import './App.css';

// Placeholder components - sẽ được thay thế bằng components thực tế sau này
const HomePage = () => <div>Home Page</div>;
const LoginPage = () => <div>Login Page</div>;
const RegisterPage = () => <div>Register Page</div>;
const ProductsPage = () => <div>Products Page</div>;
const ProductDetailPage = () => <div>Product Detail Page</div>;
const CartPage = () => <div>Cart Page</div>;
const CheckoutPage = () => <div>Checkout Page</div>;
const ProfilePage = () => <div>Profile Page</div>;
const NotFoundPage = () => <div>404 - Page Not Found</div>;

// Protected Route component
const ProtectedRoute = ({ children }) => {
  // Sử dụng useAuth hook từ AuthContext
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
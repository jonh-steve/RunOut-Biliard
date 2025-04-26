import React, { createContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useLocalStorage('wishlist', []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Add item to wishlist
  const addToWishlist = (product) => {
    setError(null);
    
    // Check if product already exists in wishlist
    if (wishlistItems.some(item => item.id === product.id)) {
      setError('Sản phẩm đã có trong danh sách yêu thích');
      return false;
    }
    
    // Add product to wishlist
    setWishlistItems([...wishlistItems, product]);
    return true;
  };
  
  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== productId));
  };
  
  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };
  
  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
  };
  
  // Toggle wishlist (add if not exists, remove if exists)
  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  };
  
  return (
    <WishlistContext.Provider
      value={{
        wishlist: {
          items: wishlistItems,
          count: wishlistItems.length
        },
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        toggleWishlist,
        isLoading,
        error
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
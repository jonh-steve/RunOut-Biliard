import React from 'react';
import AppProviders from '../context/AppProviders';
import RouterConfig from '../routing/RouterConfig';

/**
 * App component
 * 
 * Component gốc của ứng dụng, tích hợp tất cả các thành phần.
 * 
 * @returns {React.ReactElement} App component
 */
const App = () => {
  return (
    <AppProviders>
      <RouterConfig />
    </AppProviders>
  );
};

export default App;
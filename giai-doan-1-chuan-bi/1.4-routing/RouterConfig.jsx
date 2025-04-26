import React from 'react';
import { BrowserRouter, Routes, Route, useRoutes } from 'react-router-dom';
import routes from './routes.client';

/**
 * AppRoutes component
 * 
 * Uses the useRoutes hook to create routes from configuration.
 * This approach allows for a more declarative routing setup.
 * 
 * @returns {React.ReactElement} Rendered routes
 */
const AppRoutes = () => {
  const routing = useRoutes(routes);
  return routing;
};

/**
 * RouterConfig component
 * 
 * Sets up the router for the application.
 * Wraps the entire app with BrowserRouter and renders routes.
 * 
 * @returns {React.ReactElement} Router configuration
 */
const RouterConfig = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

/**
 * Alternative implementation using explicit Routes and Route components
 * This approach is more verbose but might be easier to understand for some developers
 */
const RouterConfigAlternative = () => {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => (
          <Route 
            key={index} 
            path={route.path} 
            element={route.element}
          >
            {route.children?.map((childRoute, childIndex) => (
              <Route
                key={childIndex}
                path={childRoute.path.replace(route.path, '')}
                element={childRoute.element}
              />
            ))}
          </Route>
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default RouterConfig;
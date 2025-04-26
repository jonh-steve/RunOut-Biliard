/**
 * Route Mapping Tool
 * 
 * Công cụ này giúp phân tích và đồng bộ hóa routing giữa giao diện User và Client
 * Sử dụng: node route-mapping-tool.js <đường_dẫn_user> <đường_dẫn_client> <output_path>
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

// Chuyển đổi các hàm callback thành Promise
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Cấu hình
const CONFIG = {
  // Các pattern để tìm route definitions
  routePatterns: [
    // React Router patterns
    /<Route[^>]*path=["'`]([^"'`]+)["'`][^>]*>/g,
    /path:\s*["'`]([^"'`]+)["'`]/g,
    /useRouteMatch\(["'`]([^"'`]+)["'`]\)/g,
    /useParams\(\)/g,
    // Navigation patterns
    /history\.push\(["'`]([^"'`]+)["'`]/g,
    /history\.replace\(["'`]([^"'`]+)["'`]/g,
    /navigate\(["'`]([^"'`]+)["'`]/g,
    /Link\s+to=["'`]([^"'`]+)["'`]/g,
    /NavLink\s+to=["'`]([^"'`]+)["'`]/g,
    // Route constants
    /const\s+([A-Z_]+)_ROUTE\s*=\s*["'`]([^"'`]+)["'`]/g,
    /export\s+const\s+([A-Za-z0-9_]+)\s*=\s*["'`]\/[^"'`]+["'`]/g,
    // Router configuration
    /createBrowserRouter\(/g,
    /RouterProvider\s+router=/g,
    /BrowserRouter/g,
    /Routes/g,
  ],
  // Các file cần bỏ qua
  ignoreFiles: ['.DS_Store', 'Thumbs.db', '.env', 'package.json', 'package-lock.json', 'yarn.lock'],
  // Các thư mục cần bỏ qua
  ignoreFolders: ['node_modules', '.git', 'build', 'dist', '.next', 'coverage'],
  // Các extension cần phân tích
  analyzeExtensions: ['.js', '.jsx', '.ts', '.tsx'],
  // Các file có khả năng chứa route definitions
  routeFilePatterns: [
    'routes?',
    'router',
    'navigation',
    'app',
    'index',
    'main',
  ],
};

/**
 * Tìm tất cả các file trong thư mục và các thư mục con
 * @param {string} dir - Thư mục cần tìm
 * @returns {Promise<string[]>} - Danh sách đường dẫn file
 */
async function findFiles(dir) {
  let results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!CONFIG.ignoreFolders.includes(entry.name)) {
        const subResults = await findFiles(fullPath);
        results = results.concat(subResults);
      }
    } else {
      if (!CONFIG.ignoreFiles.includes(entry.name)) {
        const ext = path.extname(entry.name).toLowerCase();
        if (CONFIG.analyzeExtensions.includes(ext)) {
          results.push(fullPath);
        }
      }
    }
  }
  
  return results;
}

/**
 * Kiểm tra xem file có khả năng chứa route definitions không
 * @param {string} filePath - Đường dẫn file
 * @returns {boolean} - True nếu file có khả năng chứa route definitions
 */
function isPotentialRouteFile(filePath) {
  const fileName = path.basename(filePath).toLowerCase();
  const fileNameWithoutExt = fileName.split('.')[0];
  
  // Kiểm tra tên file có chứa các pattern liên quan đến route không
  for (const pattern of CONFIG.routeFilePatterns) {
    if (fileNameWithoutExt.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Phân tích file để tìm route definitions
 * @param {string} filePath - Đường dẫn file cần phân tích
 * @returns {Promise<Object[]>} - Danh sách route definitions tìm thấy
 */
async function analyzeFile(filePath) {
  const content = await readFile(filePath, 'utf8');
  const relativePath = filePath.split('/').slice(-3).join('/'); // Lấy 3 cấp cuối của đường dẫn
  const results = [];
  
  // Kiểm tra xem file có chứa các pattern liên quan đến route không
  let isRouteRelated = isPotentialRouteFile(filePath);
  
  // Nếu không phải là file liên quan đến route theo tên, kiểm tra nội dung
  if (!isRouteRelated) {
    for (const pattern of CONFIG.routePatterns) {
      if (pattern.test(content)) {
        isRouteRelated = true;
        break;
      }
    }
  }
  
  // Nếu không phải là file liên quan đến route, bỏ qua
  if (!isRouteRelated) {
    return results;
  }
  
  // Tìm các route definitions
  for (const pattern of CONFIG.routePatterns) {
    const matches = [...content.matchAll(pattern)];
    
    for (const match of matches) {
      let route = '';
      let component = '';
      let routeName = '';
      
      // Xử lý các pattern khác nhau
      if (pattern.toString().includes('Route') && match[1]) {
        route = match[1]; // <Route path="/path" />
        
        // Tìm component được render bởi route này
        const componentMatch = content.substring(match.index, match.index + 200).match(/component={([^}]+)}/);
        if (componentMatch) {
          component = componentMatch[1].trim();
        } else {
          const elementMatch = content.substring(match.index, match.index + 200).match(/element={<([^>]+)>/);
          if (elementMatch) {
            component = elementMatch[1].trim();
          }
        }
      } else if (pattern.toString().includes('path:') && match[1]) {
        route = match[1]; // path: "/path"
        
        // Tìm component trong object route config
        const componentMatch = content.substring(match.index - 50, match.index + 200).match(/component:\s*([A-Za-z0-9_]+)/);
        if (componentMatch) {
          component = componentMatch[1].trim();
        } else {
          const elementMatch = content.substring(match.index - 50, match.index + 200).match(/element:\s*<([^>]+)>/);
          if (elementMatch) {
            component = elementMatch[1].trim();
          }
        }
      } else if ((pattern.toString().includes('history.push') || 
                 pattern.toString().includes('history.replace') || 
                 pattern.toString().includes('navigate')) && match[1]) {
        route = match[1]; // history.push("/path") or navigate("/path")
      } else if ((pattern.toString().includes('Link') || 
                 pattern.toString().includes('NavLink')) && match[1]) {
        route = match[1]; // <Link to="/path" />
      } else if (pattern.toString().includes('_ROUTE') && match[2]) {
        route = match[2]; // const HOME_ROUTE = "/home"
        routeName = match[1]; // HOME_ROUTE
      } else if (pattern.toString().includes('export') && match[1]) {
        // Tìm giá trị của route constant
        const routeValueMatch = content.substring(match.index, match.index + 100).match(/["'`](\/[^"'`]+)["'`]/);
        if (routeValueMatch) {
          route = routeValueMatch[1];
          routeName = match[1]; // exportedRouteName
        }
      }
      
      // Loại bỏ các route không hợp lệ hoặc trùng lặp
      if (route && 
          !results.some(r => r.route === route)) {
        
        // Tìm các tham số trong route
        const params = [];
        const paramMatches = [...route.matchAll(/:([^/]+)/g)];
        for (const paramMatch of paramMatches) {
          params.push(paramMatch[1]);
        }
        
        // Tìm các route guards hoặc middleware
        let guards = [];
        const guardMatches = content.substring(Math.max(0, match.index - 300), match.index + 300).match(/isAuthenticated|requireAuth|authGuard|privateRoute|PrivateRoute/g);
        if (guardMatches) {
          guards = [...new Set(guardMatches)];
        }
        
        results.push({
          route,
          component,
          routeName,
          params,
          guards,
          file: relativePath,
          lineNumber: getLineNumber(content, match[0])
        });
      }
    }
  }
  
  return results;
}

/**
 * Lấy số dòng của một chuỗi trong nội dung
 * @param {string} content - Nội dung file
 * @param {string} searchString - Chuỗi cần tìm
 * @returns {number} - Số dòng
 */
function getLineNumber(content, searchString) {
  const index = content.indexOf(searchString);
  if (index === -1) return -1;
  
  const lines = content.substring(0, index).split('\n');
  return lines.length;
}

/**
 * Phân tích thư mục để tìm tất cả route definitions
 * @param {string} dir - Thư mục cần phân tích
 * @returns {Promise<Object[]>} - Danh sách route definitions tìm thấy
 */
async function analyzeDirectory(dir) {
  const files = await findFiles(dir);
  let results = [];
  
  for (const file of files) {
    const fileResults = await analyzeFile(file);
    results = results.concat(fileResults);
  }
  
  // Loại bỏ các route trùng lặp
  const uniqueRoutes = [];
  const seen = new Set();
  
  for (const item of results) {
    if (!seen.has(item.route)) {
      seen.add(item.route);
      uniqueRoutes.push(item);
    }
  }
  
  return uniqueRoutes;
}

/**
 * So sánh route definitions giữa hai thư mục
 * @param {Object[]} userRoutes - Route definitions từ thư mục User
 * @param {Object[]} clientRoutes - Route definitions từ thư mục Client
 * @returns {Object} - Kết quả so sánh
 */
function compareRoutes(userRoutes, clientRoutes) {
  // Tạo map từ route path để dễ tìm kiếm
  const userMap = new Map();
  for (const route of userRoutes) {
    userMap.set(route.route, route);
  }
  
  const clientMap = new Map();
  for (const route of clientRoutes) {
    clientMap.set(route.route, route);
  }
  
  // Tìm các route chung, chỉ có trong User và chỉ có trong Client
  const common = [];
  const onlyInUser = [];
  const onlyInClient = [];
  
  for (const [path, route] of userMap.entries()) {
    if (clientMap.has(path)) {
      common.push({
        route: path,
        userComponent: route.component,
        clientComponent: clientMap.get(path).component,
        userParams: route.params,
        clientParams: clientMap.get(path).params,
        userGuards: route.guards,
        clientGuards: clientMap.get(path).guards,
        userFile: route.file,
        clientFile: clientMap.get(path).file
      });
    } else {
      // Kiểm tra xem có route tương tự không (khác tham số)
      let found = false;
      for (const [clientPath, clientRoute] of clientMap.entries()) {
        // Chuyển đổi route thành regex pattern
        const userPattern = path.replace(/:[^/]+/g, '[^/]+');
        const clientPattern = clientPath.replace(/:[^/]+/g, '[^/]+');
        
        if (userPattern === clientPattern) {
          common.push({
            route: path,
            similarRoute: clientPath,
            userComponent: route.component,
            clientComponent: clientRoute.component,
            userParams: route.params,
            clientParams: clientRoute.params,
            userGuards: route.guards,
            clientGuards: clientRoute.guards,
            userFile: route.file,
            clientFile: clientRoute.file,
            paramsDiff: true
          });
          found = true;
          break;
        }
      }
      
      if (!found) {
        onlyInUser.push(route);
      }
    }
  }
  
  for (const [path, route] of clientMap.entries()) {
    if (!userMap.has(path)) {
      // Kiểm tra xem đã được xử lý trong phần so sánh tương tự chưa
      let found = false;
      for (const commonRoute of common) {
        if (commonRoute.similarRoute === path) {
          found = true;
          break;
        }
      }
      
      if (!found) {
        onlyInClient.push(route);
      }
    }
  }
  
  return {
    common,
    onlyInUser,
    onlyInClient,
    summary: {
      totalUserRoutes: userRoutes.length,
      totalClientRoutes: clientRoutes.length,
      commonRoutes: common.length,
      onlyInUser: onlyInUser.length,
      onlyInClient: onlyInClient.length,
      mappingCompleteness: `${Math.round((common.length / userRoutes.length) * 100)}%`
    }
  };
}

/**
 * Tạo báo cáo Markdown từ kết quả so sánh
 * @param {Object} comparison - Kết quả so sánh
 * @returns {string} - Báo cáo Markdown
 */
function generateMarkdownReport(comparison) {
  const { common, onlyInUser, onlyInClient, summary } = comparison;
  
  let markdown = `# Route Mapping Report\n\n`;
  
  // Thêm tóm tắt
  markdown += `## Summary\n\n`;
  markdown += `- Total User routes: ${summary.totalUserRoutes}\n`;
  markdown += `- Total Client routes: ${summary.totalClientRoutes}\n`;
  markdown += `- Common routes: ${summary.commonRoutes}\n`;
  markdown += `- Only in User: ${summary.onlyInUser}\n`;
  markdown += `- Only in Client: ${summary.onlyInClient}\n`;
  markdown += `- Mapping completeness: ${summary.mappingCompleteness}\n\n`;
  
  // Thêm bảng các route chung
  markdown += `## Common Routes\n\n`;
  markdown += `| Route | User Component | Client Component | Params Match | Guards Match | Status |\n`;
  markdown += `|-------|---------------|-----------------|-------------|-------------|--------|\n`;
  
  for (const item of common) {
    const paramsMatch = JSON.stringify(item.userParams) === JSON.stringify(item.clientParams) ? '✅' : '⚠️';
    const guardsMatch = JSON.stringify(item.userGuards) === JSON.stringify(item.clientGuards) ? '✅' : '⚠️';
    const status = item.paramsDiff ? '⚠️ Param names differ' : '✅';
    const routeDisplay = item.similarRoute ? `${item.route} ↔️ ${item.similarRoute}` : item.route;
    
    markdown += `| \`${routeDisplay}\` | ${item.userComponent || '-'} | ${item.clientComponent || '-'} | ${paramsMatch} | ${guardsMatch} | ${status} |\n`;
  }
  
  // Thêm bảng các route chỉ có trong User
  markdown += `\n## Routes Only in User\n\n`;
  markdown += `| Route | Component | Params | Guards | File |\n`;
  markdown += `|-------|-----------|--------|--------|------|\n`;
  
  for (const item of onlyInUser) {
    markdown += `| \`${item.route}\` | ${item.component || '-'} | ${item.params.join(', ') || '-'} | ${item.guards.join(', ') || '-'} | ${item.file} |\n`;
  }
  
  // Thêm bảng các route chỉ có trong Client
  markdown += `\n## Routes Only in Client\n\n`;
  markdown += `| Route | Component | Params | Guards | File |\n`;
  markdown += `|-------|-----------|--------|--------|------|\n`;
  
  for (const item of onlyInClient) {
    markdown += `| \`${item.route}\` | ${item.component || '-'} | ${item.params.join(', ') || '-'} | ${item.guards.join(', ') || '-'} | ${item.file} |\n`;
  }
  
  // Thêm hướng dẫn tiếp theo
  markdown += `\n## Next Steps\n\n`;
  markdown += `1. Review các route chỉ có trong User và quyết định xem có cần thêm vào Client không\n`;
  markdown += `2. Kiểm tra các route có cảnh báo về sự khác biệt trong tham số hoặc guards\n`;
  markdown += `3. Xác nhận các route chỉ có trong Client có phải là tính năng mới không\n`;
  markdown += `4. Tạo adapter hoặc wrapper cho hệ thống routing để đảm bảo tính nhất quán\n`;
  
  return markdown;
}

/**
 * Tạo báo cáo JSON từ kết quả so sánh
 * @param {Object} comparison - Kết quả so sánh
 * @returns {string} - Báo cáo JSON
 */
function generateJsonReport(comparison) {
  return JSON.stringify(comparison, null, 2);
}

/**
 * Tạo adapter code để đồng bộ hóa routing
 * @param {Object} comparison - Kết quả so sánh
 * @returns {string} - Mã nguồn adapter
 */
function generateRouteAdapter(comparison) {
  const { common, onlyInUser, onlyInClient } = comparison;
  
  let code = `/**
 * Route Adapter
 * 
 * File này cung cấp các hàm và constants để đồng bộ hóa routing giữa giao diện User và Client
 * Được tạo tự động bởi route-mapping-tool.js
 */

// Kiểm tra môi trường hiện tại
const isClientInterface = process.env.REACT_APP_INTERFACE === 'client';

/**
 * Route Constants
 * Các constant này có thể được sử dụng trong cả hai giao diện
 */
`;

  // Thêm các route constants
  for (const item of common) {
    const routeName = item.route.replace(/^\//, '').replace(/\//g, '_').replace(/:/g, '').toUpperCase() + '_ROUTE';
    const routeValue = item.similarRoute || item.route;
    code += `export const ${routeName} = "${routeValue}";\n`;
  }
  
  code += `\n/**
 * Route Mapping
 * Map giữa các route của User và Client
 */
export const ROUTE_MAPPING = {
`;

  // Thêm mapping giữa các route
  for (const item of common) {
    if (item.similarRoute) {
      code += `  "${item.route}": "${item.similarRoute}",\n`;
    }
  }
  
  code += `};\n\n`;
  
  // Thêm các route params mapping
  code += `/**
 * Route Params Mapping
 * Map giữa các tham số route của User và Client
 */
export const PARAMS_MAPPING = {
`;

  for (const item of common) {
    if (item.paramsDiff && item.userParams.length > 0 && item.clientParams.length > 0) {
      code += `  "${item.route}": {\n`;
      for (let i = 0; i < Math.min(item.userParams.length, item.clientParams.length); i++) {
        code += `    "${item.userParams[i]}": "${item.clientParams[i]}",\n`;
      }
      code += `  },\n`;
    }
  }
  
  code += `};\n\n`;
  
  // Thêm các hàm helper
  code += `/**
 * Chuyển đổi route từ User sang Client
 * @param {string} userRoute - Route từ giao diện User
 * @param {Object} params - Các tham số route
 * @returns {string} - Route tương ứng trong giao diện Client
 */
export function mapUserToClientRoute(userRoute, params = {}) {
  // Nếu không phải là Client interface, trả về route gốc
  if (!isClientInterface) {
    return userRoute;
  }
  
  // Tìm route mapping
  let clientRoute = ROUTE_MAPPING[userRoute] || userRoute;
  
  // Map các tham số
  if (params && PARAMS_MAPPING[userRoute]) {
    const mappedParams = {};
    for (const [userParam, clientParam] of Object.entries(PARAMS_MAPPING[userRoute])) {
      if (params[userParam] !== undefined) {
        mappedParams[clientParam] = params[userParam];
      }
    }
    
    // Thay thế các tham số trong route
    for (const [param, value] of Object.entries(mappedParams)) {
      clientRoute = clientRoute.replace(new RegExp(\`:\${param}\`, 'g'), value);
    }
  } else {
    // Thay thế các tham số trong route
    for (const [param, value] of Object.entries(params)) {
      clientRoute = clientRoute.replace(new RegExp(\`:\${param}\`, 'g'), value);
    }
  }
  
  return clientRoute;
}

/**
 * Chuyển đổi route từ Client sang User
 * @param {string} clientRoute - Route từ giao diện Client
 * @param {Object} params - Các tham số route
 * @returns {string} - Route tương ứng trong giao diện User
 */
export function mapClientToUserRoute(clientRoute, params = {}) {
  // Nếu là Client interface, trả về route gốc
  if (isClientInterface) {
    return clientRoute;
  }
  
  // Tìm route mapping ngược
  let userRoute = clientRoute;
  for (const [user, client] of Object.entries(ROUTE_MAPPING)) {
    if (client === clientRoute) {
      userRoute = user;
      break;
    }
  }
  
  // Map các tham số ngược
  if (params) {
    for (const [userRoute, paramsMap] of Object.entries(PARAMS_MAPPING)) {
      const reversedMap = {};
      for (const [userParam, clientParam] of Object.entries(paramsMap)) {
        reversedMap[clientParam] = userParam;
      }
      
      const mappedParams = {};
      for (const [clientParam, userParam] of Object.entries(reversedMap)) {
        if (params[clientParam] !== undefined) {
          mappedParams[userParam] = params[clientParam];
        }
      }
      
      // Thay thế các tham số trong route
      for (const [param, value] of Object.entries(mappedParams)) {
        userRoute = userRoute.replace(new RegExp(\`:\${param}\`, 'g'), value);
      }
    }
  } else {
    // Thay thế các tham số trong route
    for (const [param, value] of Object.entries(params)) {
      userRoute = userRoute.replace(new RegExp(\`:\${param}\`, 'g'), value);
    }
  }
  
  return userRoute;
}

/**
 * Hook để sử dụng routing thống nhất
 * @param {Object} history - History object từ react-router
 * @returns {Object} - Các hàm navigation thống nhất
 */
export function useUnifiedRouting(history) {
  return {
    /**
     * Điều hướng đến route
     * @param {string} route - Route cần điều hướng đến
     * @param {Object} params - Các tham số route
     * @param {Object} state - State object để truyền trong history
     */
    navigateTo: (route, params = {}, state = {}) => {
      const targetRoute = isClientInterface 
        ? mapUserToClientRoute(route, params)
        : mapClientToUserRoute(route, params);
      
      history.push(targetRoute, state);
    },
    
    /**
     * Thay thế route hiện tại
     * @param {string} route - Route cần thay thế
     * @param {Object} params - Các tham số route
     * @param {Object} state - State object để truyền trong history
     */
    replaceTo: (route, params = {}, state = {}) => {
      const targetRoute = isClientInterface 
        ? mapUserToClientRoute(route, params)
        : mapClientToUserRoute(route, params);
      
      history.replace(targetRoute, state);
    },
    
    /**
     * Tạo URL cho route
     * @param {string} route - Route cần tạo URL
     * @param {Object} params - Các tham số route
     * @returns {string} - URL đã được tạo
     */
    createUrl: (route, params = {}) => {
      return isClientInterface 
        ? mapUserToClientRoute(route, params)
        : mapClientToUserRoute(route, params);
    }
  };
}

export default {
  mapUserToClientRoute,
  mapClientToUserRoute,
  useUnifiedRouting,
  ROUTE_MAPPING,
  PARAMS_MAPPING
};`;

  return code;
}

/**
 * Hàm chính để chạy công cụ
 */
async function main() {
  try {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.error('Sử dụng: node route-mapping-tool.js <đường_dẫn_user> <đường_dẫn_client> [output_path]');
      process.exit(1);
    }
    
    const userPath = args[0];
    const clientPath = args[1];
    const outputPath = args[2] || './route-mapping';
    
    console.log(`Đang phân tích routes trong thư mục User: ${userPath}`);
    const userRoutes = await analyzeDirectory(userPath);
    
    console.log(`Đang phân tích routes trong thư mục Client: ${clientPath}`);
    const clientRoutes = await analyzeDirectory(clientPath);
    
    console.log('Đang so sánh routes...');
    const comparison = compareRoutes(userRoutes, clientRoutes);
    
    // Tạo báo cáo Markdown
    const markdownReport = generateMarkdownReport(comparison);
    await writeFile(`${outputPath}-report.md`, markdownReport);
    
    // Tạo báo cáo JSON
    const jsonReport = generateJsonReport(comparison);
    await writeFile(`${outputPath}-report.json`, jsonReport);
    
    // Tạo adapter code
    const adapterCode = generateRouteAdapter(comparison);
    await writeFile(`${outputPath}-adapter.js`, adapterCode);
    
    console.log(`Báo cáo đã được lưu vào: ${outputPath}-report.md và ${outputPath}-report.json`);
    console.log(`Adapter code đã được lưu vào: ${outputPath}-adapter.js`);
    
    // In tóm tắt
    console.log('\n===== TÓM TẮT PHÂN TÍCH ROUTES =====');
    console.log(`- Tổng số route trong User: ${comparison.summary.totalUserRoutes}`);
    console.log(`- Tổng số route trong Client: ${comparison.summary.totalClientRoutes}`);
    console.log(`- Số route chung: ${comparison.summary.commonRoutes}`);
    console.log(`- Số route chỉ có trong User: ${comparison.summary.onlyInUser}`);
    console.log(`- Số route chỉ có trong Client: ${comparison.summary.onlyInClient}`);
    console.log(`- Mức độ hoàn thành mapping: ${comparison.summary.mappingCompleteness}`);
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
}


  
  /**
   * Ghi nội dung vào file
   * @param {string} filePath - Đường dẫn file
   * @param {string} content - Nội dung cần ghi
   * @returns {Promise<void>}
   */
  async function writeFile(filePath, content) {
    const fs = require('fs').promises;
    const path = require('path');
    
    try {
      // Đảm bảo thư mục tồn tại
      const directory = path.dirname(filePath);
      await fs.mkdir(directory, { recursive: true });
      
      // Ghi file
      await fs.writeFile(filePath, content, 'utf8');
    } catch (error) {
      console.error(`Lỗi khi ghi file ${filePath}:`, error);
      throw error;
    }
  }
  
  // Chạy hàm main khi script được thực thi trực tiếp
  if (require.main === module) {
    main().catch(error => {
      console.error('Lỗi không xử lý được:', error);
      process.exit(1);
    });
  }
  
  // Export các hàm để có thể sử dụng như một module
  module.exports = {
    analyzeDirectory,
    analyzeFile,
    findFiles,
    compareRoutes,
    generateMarkdownReport,
    generateJsonReport,
    generateRouteAdapter,
    writeFile,
    main
  };
  
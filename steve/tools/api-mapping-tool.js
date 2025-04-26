/**
 * API Mapping Tool
 * 
 * Công cụ này giúp phân tích và ánh xạ API endpoints giữa giao diện User và Client
 * Sử dụng: node api-mapping-tool.js <đường_dẫn_user> <đường_dẫn_client> <output_path>
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
  // Các pattern để tìm API calls
  apiPatterns: [
    // Axios patterns
    /axios\s*\.\s*(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
    /axios\s*\(\s*\{\s*url\s*:\s*['"`]([^'"`]+)['"`]/g,
    // Fetch patterns
    /fetch\s*\(\s*['"`]([^'"`]+)['"`]/g,
    /fetch\s*\(\s*`([^`]+)`/g,
    // Custom API calls
    /api\s*\.\s*(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
    /apiCall\s*\(\s*['"`]([^'"`]+)['"`]/g,
    // URL construction
    /const\s+url\s*=\s*['"`]([^'"`]+)['"`]\s*;[\s\S]{1,100}(axios|fetch)/g,
    /const\s+endpoint\s*=\s*['"`]([^'"`]+)['"`]\s*;[\s\S]{1,100}(axios|fetch)/g,
    // Template literals with base URL
    /\${API_URL}\s*\+\s*['"`]([^'"`]+)['"`]/g,
    /\${baseUrl}\s*\+\s*['"`]([^'"`]+)['"`]/g,
    // Common API URL patterns
    /\/api\/[a-zA-Z0-9\/_-]+/g,
  ],
  // Các file cần bỏ qua
  ignoreFiles: ['.DS_Store', 'Thumbs.db', '.env', 'package.json', 'package-lock.json', 'yarn.lock'],
  // Các thư mục cần bỏ qua
  ignoreFolders: ['node_modules', '.git', 'build', 'dist', '.next', 'coverage'],
  // Các extension cần phân tích
  analyzeExtensions: ['.js', '.jsx', '.ts', '.tsx'],
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
 * Phân tích file để tìm API endpoints
 * @param {string} filePath - Đường dẫn file cần phân tích
 * @returns {Promise<Object[]>} - Danh sách API endpoints tìm thấy
 */
async function analyzeFile(filePath) {
  const content = await readFile(filePath, 'utf8');
  const relativePath = filePath.split('/').slice(-3).join('/'); // Lấy 3 cấp cuối của đường dẫn
  const results = [];
  
  for (const pattern of CONFIG.apiPatterns) {
    const matches = [...content.matchAll(pattern)];
    
    for (const match of matches) {
      let endpoint = '';
      
      // Xử lý các pattern khác nhau
      if (pattern.toString().includes('axios') && match[2]) {
        endpoint = match[2]; // axios.get(endpoint)
      } else if (pattern.toString().includes('api') && match[2]) {
        endpoint = match[2]; // api.get(endpoint)
      } else if (match[1] && !match[1].includes('${')) {
        endpoint = match[1]; // fetch(endpoint) hoặc const url = endpoint
      }
      
      // Loại bỏ các endpoint không hợp lệ ho��c trùng lặp
      if (endpoint && 
          !endpoint.includes('${') && 
          !endpoint.includes('http://localhost') && 
          !endpoint.includes('https://') && 
          !endpoint.startsWith('`') &&
          !results.some(r => r.endpoint === endpoint)) {
        
        // Tìm các tham số trong nội dung xung quanh endpoint
        const surroundingContent = content.substring(
          Math.max(0, content.indexOf(endpoint) - 200),
          Math.min(content.length, content.indexOf(endpoint) + 200)
        );
        
        // Tìm method (GET, POST, etc.)
        let method = 'GET'; // Mặc định là GET
        if (surroundingContent.includes('.post(') || surroundingContent.includes('method: "POST"') || surroundingContent.includes("method: 'POST'")) {
          method = 'POST';
        } else if (surroundingContent.includes('.put(') || surroundingContent.includes('method: "PUT"') || surroundingContent.includes("method: 'PUT'")) {
          method = 'PUT';
        } else if (surroundingContent.includes('.delete(') || surroundingContent.includes('method: "DELETE"') || surroundingContent.includes("method: 'DELETE'")) {
          method = 'DELETE';
        } else if (surroundingContent.includes('.patch(') || surroundingContent.includes('method: "PATCH"') || surroundingContent.includes("method: 'PATCH'")) {
          method = 'PATCH';
        }
        
        // Tìm các tham số
        const paramsMatch = surroundingContent.match(/params\s*:\s*{([^}]*)}/);
        const dataMatch = surroundingContent.match(/data\s*:\s*{([^}]*)}/);
        const bodyMatch = surroundingContent.match(/body\s*:\s*{([^}]*)}/);
        
        let params = '';
        if (paramsMatch) params = paramsMatch[1].trim();
        else if (dataMatch) params = dataMatch[1].trim();
        else if (bodyMatch) params = bodyMatch[1].trim();
        
        results.push({
          endpoint,
          method,
          params,
          file: relativePath,
          lineNumber: getLineNumber(content, endpoint)
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
 * Phân tích thư mục để tìm tất cả API endpoints
 * @param {string} dir - Thư mục cần phân tích
 * @returns {Promise<Object[]>} - Danh sách API endpoints tìm thấy
 */
async function analyzeDirectory(dir) {
  const files = await findFiles(dir);
  let results = [];
  
  for (const file of files) {
    const fileResults = await analyzeFile(file);
    results = results.concat(fileResults);
  }
  
  // Loại bỏ các endpoint trùng lặp
  const uniqueEndpoints = [];
  const seen = new Set();
  
  for (const item of results) {
    const key = `${item.method}:${item.endpoint}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueEndpoints.push(item);
    }
  }
  
  return uniqueEndpoints;
}

/**
 * So sánh API endpoints giữa hai thư mục
 * @param {Object[]} userEndpoints - API endpoints từ thư mục User
 * @param {Object[]} clientEndpoints - API endpoints từ thư mục Client
 * @returns {Object} - Kết quả so sánh
 */
function compareEndpoints(userEndpoints, clientEndpoints) {
  // Tạo map từ endpoint và method để dễ tìm kiếm
  const userMap = new Map();
  for (const endpoint of userEndpoints) {
    const key = `${endpoint.method}:${endpoint.endpoint}`;
    userMap.set(key, endpoint);
  }
  
  const clientMap = new Map();
  for (const endpoint of clientEndpoints) {
    const key = `${endpoint.method}:${endpoint.endpoint}`;
    clientMap.set(key, endpoint);
  }
  
  // Tìm các endpoint chung, chỉ có trong User và chỉ có trong Client
  const common = [];
  const onlyInUser = [];
  const onlyInClient = [];
  
  for (const [key, endpoint] of userMap.entries()) {
    if (clientMap.has(key)) {
      common.push({
        endpoint: endpoint.endpoint,
        method: endpoint.method,
        userFile: endpoint.file,
        clientFile: clientMap.get(key).file,
        userParams: endpoint.params,
        clientParams: clientMap.get(key).params
      });
    } else {
      onlyInUser.push(endpoint);
    }
  }
  
  for (const [key, endpoint] of clientMap.entries()) {
    if (!userMap.has(key)) {
      onlyInClient.push(endpoint);
    }
  }
  
  return {
    common,
    onlyInUser,
    onlyInClient,
    summary: {
      totalUserEndpoints: userEndpoints.length,
      totalClientEndpoints: clientEndpoints.length,
      commonEndpoints: common.length,
      onlyInUser: onlyInUser.length,
      onlyInClient: onlyInClient.length,
      mappingCompleteness: `${Math.round((common.length / userEndpoints.length) * 100)}%`
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
  
  let markdown = `# API Endpoints Mapping Report\n\n`;
  
  // Thêm tóm tắt
  markdown += `## Summary\n\n`;
  markdown += `- Total User endpoints: ${summary.totalUserEndpoints}\n`;
  markdown += `- Total Client endpoints: ${summary.totalClientEndpoints}\n`;
  markdown += `- Common endpoints: ${summary.commonEndpoints}\n`;
  markdown += `- Only in User: ${summary.onlyInUser}\n`;
  markdown += `- Only in Client: ${summary.onlyInClient}\n`;
  markdown += `- Mapping completeness: ${summary.mappingCompleteness}\n\n`;
  
  // Thêm bảng các endpoint chung
  markdown += `## Common Endpoints\n\n`;
  markdown += `| Method | Endpoint | User File | Client File | Status |\n`;
  markdown += `|--------|----------|-----------|-------------|--------|\n`;
  
  for (const item of common) {
    const paramsMatch = item.userParams === item.clientParams ? '✅' : '⚠️';
    markdown += `| ${item.method} | \`${item.endpoint}\` | ${item.userFile} | ${item.clientFile} | ${paramsMatch} |\n`;
  }
  
  // Thêm bảng các endpoint chỉ có trong User
  markdown += `\n## Endpoints Only in User\n\n`;
  markdown += `| Method | Endpoint | File | Params |\n`;
  markdown += `|--------|----------|------|--------|\n`;
  
  for (const item of onlyInUser) {
    markdown += `| ${item.method} | \`${item.endpoint}\` | ${item.file} | ${item.params || '-'} |\n`;
  }
  
  // Thêm bảng các endpoint chỉ có trong Client
  markdown += `\n## Endpoints Only in Client\n\n`;
  markdown += `| Method | Endpoint | File | Params |\n`;
  markdown += `|--------|----------|------|--------|\n`;
  
  for (const item of onlyInClient) {
    markdown += `| ${item.method} | \`${item.endpoint}\` | ${item.file} | ${item.params || '-'} |\n`;
  }
  
  // Thêm hướng dẫn tiếp theo
  markdown += `\n## Next Steps\n\n`;
  markdown += `1. Review các endpoint chỉ có trong User và quyết định xem có cần thêm vào Client không\n`;
  markdown += `2. Kiểm tra các endpoint có cảnh báo (⚠️) về sự khác biệt trong tham số\n`;
  markdown += `3. Xác nhận các endpoint chỉ có trong Client có phải là tính năng mới không\n`;
  markdown += `4. Tạo adapter hoặc wrapper cho các API calls để đảm bảo tính nhất quán\n`;
  
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
 * Hàm chính để chạy công cụ
 */
async function main() {
  try {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.error('Sử dụng: node api-mapping-tool.js <đường_dẫn_user> <đường_dẫn_client> [output_path]');
      process.exit(1);
    }
    
    const userPath = args[0];
    const clientPath = args[1];
    const outputPath = args[2] || './api-mapping-report';
    
    console.log(`Đang phân tích API endpoints trong thư mục User: ${userPath}`);
    const userEndpoints = await analyzeDirectory(userPath);
    
    console.log(`Đang phân tích API endpoints trong thư mục Client: ${clientPath}`);
    const clientEndpoints = await analyzeDirectory(clientPath);
    
    console.log('Đang so sánh API endpoints...');
    const comparison = compareEndpoints(userEndpoints, clientEndpoints);
    
    // Tạo báo cáo Markdown
    const markdownReport = generateMarkdownReport(comparison);
    await writeFile(`${outputPath}.md`, markdownReport);
    
    // Tạo báo cáo JSON
    const jsonReport = generateJsonReport(comparison);
    await writeFile(`${outputPath}.json`, jsonReport);
    
    console.log(`Báo cáo đã được lưu vào: ${outputPath}.md và ${outputPath}.json`);
    
    // In tóm tắt
    console.log('\n===== TÓM TẮT PHÂN TÍCH API =====');
    console.log(`- Tổng số endpoint trong User: ${comparison.summary.totalUserEndpoints}`);
    console.log(`- Tổng số endpoint trong Client: ${comparison.summary.totalClientEndpoints}`);
    console.log(`- Số endpoint chung: ${comparison.summary.commonEndpoints}`);
    console.log(`- Số endpoint chỉ có trong User: ${comparison.summary.onlyInUser}`);
    console.log(`- Số endpoint chỉ có trong Client: ${comparison.summary.onlyInClient}`);
    console.log(`- Mức độ hoàn thành mapping: ${comparison.summary.mappingCompleteness}`);
    
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
}

// Chạy hàm main
main();
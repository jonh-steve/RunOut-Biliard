/**
 * API Analyzer
 * 
 * Công cụ này sẽ phân tích các API endpoints được sử dụng trong thư mục User,
 * bao gồm các tham số, cấu trúc request/response, và phương thức xác thực.
 */

const fs = require('fs');
const path = require('path');
const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

// Đường dẫn đến thư mục User
const USER_DIR = path.resolve(__dirname, '../User');

// Kết quả phân tích
const result = {
  endpoints: [],
  authMethods: [],
  dataStructures: {}
};

/**
 * Quét thư mục để tìm các file JavaScript/TypeScript
 * @param {string} dir - Đường dẫn thư mục cần quét
 * @returns {string[]} - Danh sách đường dẫn file
 */
function findJsFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      if (item === 'node_modules' || item === 'build' || item === 'dist') continue;
      results = results.concat(findJsFiles(itemPath));
    } else {
      const ext = path.extname(item).toLowerCase();
      if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
        results.push(itemPath);
      }
    }
  }
  
  return results;
}

/**
 * Phân tích file để tìm API calls
 * @param {string} filePath - Đường dẫn file cần phân tích
 */
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Bỏ qua các file quá lớn
    if (content.length > 1000000) {
      console.log(`Skipping large file: ${filePath}`);
      return;
    }
    
    // Parse file thành AST
    let ast;
    try {
      ast = esprima.parseScript(content, { jsx: true, loc: true });
    } catch (error) {
      // Thử parse lại với module
      try {
        ast = esprima.parseModule(content, { jsx: true, loc: true });
      } catch (innerError) {
        console.error(`Error parsing ${filePath}: ${innerError.message}`);
        return;
      }
    }
    
    // Duyệt qua AST để tìm API calls
    estraverse.traverse(ast, {
      enter: function(node, parent) {
        // Tìm axios calls
        findAxiosCalls(node, filePath);
        
        // Tìm fetch calls
        findFetchCalls(node, filePath);
        
        // Tìm phương thức xác thực
        findAuthMethods(node, filePath);
        
        // Tìm cấu trúc dữ liệu
        findDataStructures(node, filePath);
      }
    });
  } catch (error) {
    console.error(`Error analyzing file ${filePath}: ${error.message}`);
  }
}

/**
 * Tìm axios calls trong AST
 * @param {Object} node - Node trong AST
 * @param {string} filePath - Đường dẫn file
 */
function findAxiosCalls(node, filePath) {
  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object &&
    node.callee.object.name === 'axios'
  ) {
    const method = node.callee.property.name.toUpperCase();
    let url = '';
    let params = null;
    let data = null;
    
    // Lấy URL và params từ arguments
    if (node.arguments.length > 0) {
      if (typeof node.arguments[0].value === 'string') {
        url = node.arguments[0].value;
      } else if (node.arguments[0].type === 'ObjectExpression') {
        // Tìm url trong object
        for (const prop of node.arguments[0].properties) {
          if (prop.key.name === 'url' && prop.value.type === 'Literal') {
            url = prop.value.value;
          } else if (prop.key.name === 'params') {
            params = extractObjectStructure(prop.value);
          } else if (prop.key.name === 'data') {
            data = extractObjectStructure(prop.value);
          }
        }
      }
    }
    
    // Lấy data từ argument thứ 2 (cho POST, PUT, etc.)
    if (node.arguments.length > 1 && ['POST', 'PUT', 'PATCH'].includes(method)) {
      data = extractObjectStructure(node.arguments[1]);
    }
    
    if (url) {
      result.endpoints.push({
        method,
        url,
        params,
        data,
        file: path.relative(USER_DIR, filePath),
        line: node.loc.start.line
      });
    }
  }
}

/**
 * Tìm fetch calls trong AST
 * @param {Object} node - Node trong AST
 * @param {string} filePath - Đường dẫn file
 */
function findFetchCalls(node, filePath) {
  if (
    node.type === 'CallExpression' &&
    node.callee.name === 'fetch'
  ) {
    let url = '';
    let method = 'GET';
    let params = null;
    let data = null;
    
    // Lấy URL từ argument đầu tiên
    if (node.arguments.length > 0 && node.arguments[0].type === 'Literal') {
      url = node.arguments[0].value;
    }
    
    // Lấy options từ argument thứ hai
    if (node.arguments.length > 1 && node.arguments[1].type === 'ObjectExpression') {
      for (const prop of node.arguments[1].properties) {
        if (prop.key.name === 'method' && prop.value.type === 'Literal') {
          method = prop.value.value.toUpperCase();
        } else if (prop.key.name === 'body') {
          data = extractObjectStructure(prop.value);
        }
      }
    }
    
    if (url) {
      result.endpoints.push({
        method,
        url,
        params,
        data,
        file: path.relative(USER_DIR, filePath),
        line: node.loc.start.line
      });
    }
  }
}

/**
 * Tìm phương thức xác thực trong AST
 * @param {Object} node - Node trong AST
 * @param {string} filePath - Đường dẫn file
 */
function findAuthMethods(node, filePath) {
  // Tìm các pattern liên quan đến xác thực
  const authPatterns = [
    { type: 'token', pattern: /token|jwt|auth|bearer/i },
    { type: 'localStorage', pattern: /localStorage\.getItem|localStorage\.setItem/i },
    { type: 'sessionStorage', pattern: /sessionStorage\.getItem|sessionStorage\.setItem/i },
    { type: 'cookie', pattern: /document\.cookie|cookies/i }
  ];
  
  if (node.type === 'Identifier' || 
      (node.type === 'MemberExpression' && node.property && node.property.type === 'Identifier')) {
    const code = escodegen.generate(node);
    
    for (const pattern of authPatterns) {
      if (pattern.pattern.test(code)) {
        result.authMethods.push({
          type: pattern.type,
          code,
          file: path.relative(USER_DIR, filePath),
          line: node.loc.start.line
        });
        break;
      }
    }
  }
}

/**
 * Tìm cấu trúc dữ liệu trong AST
 * @param {Object} node - Node trong AST
 * @param {string} filePath - Đường dẫn file
 */
function findDataStructures(node, filePath) {
  // Tìm các khai báo interface hoặc type (TypeScript)
  if (node.type === 'TSInterfaceDeclaration' && node.id && node.id.name) {
    const name = node.id.name;
    const structure = extractTypeScriptInterface(node);
    
    if (!result.dataStructures[name]) {
      result.dataStructures[name] = {
        type: 'interface',
        structure,
        file: path.relative(USER_DIR, filePath),
        line: node.loc.start.line
      };
    }
  }
  
  // Tìm các khai báo class
  if (node.type === 'ClassDeclaration' && node.id && node.id.name) {
    const name = node.id.name;
    const structure = extractClassStructure(node);
    
    if (!result.dataStructures[name]) {
      result.dataStructures[name] = {
        type: 'class',
        structure,
        file: path.relative(USER_DIR, filePath),
        line: node.loc.start.line
      };
    }
  }
}

/**
 * Trích xuất cấu trúc object từ node
 * @param {Object} node - Node trong AST
 * @returns {Object|null} - Cấu trúc object
 */
function extractObjectStructure(node) {
  if (!node) return null;
  
  if (node.type === 'ObjectExpression') {
    const result = {};
    
    for (const prop of node.properties) {
      if (prop.key.type === 'Identifier') {
        const key = prop.key.name;
        
        if (prop.value.type === 'Literal') {
          result[key] = prop.value.value;
        } else if (prop.value.type === 'ObjectExpression') {
          result[key] = extractObjectStructure(prop.value);
        } else if (prop.value.type === 'ArrayExpression') {
          result[key] = extractArrayStructure(prop.value);
        } else {
          result[key] = `<${prop.value.type}>`;
        }
      }
    }
    
    return result;
  }
  
  return null;
}

/**
 * Trích xuất cấu trúc array từ node
 * @param {Object} node - Node trong AST
 * @returns {Array|null} - Cấu trúc array
 */
function extractArrayStructure(node) {
  if (!node || node.type !== 'ArrayExpression') return null;
  
  const result = [];
  
  for (const element of node.elements) {
    if (element.type === 'Literal') {
      result.push(element.value);
    } else if (element.type === 'ObjectExpression') {
      result.push(extractObjectStructure(element));
    } else if (element.type === 'ArrayExpression') {
      result.push(extractArrayStructure(element));
    } else {
      result.push(`<${element.type}>`);
    }
  }
  
  return result;
}

/**
 * Trích xuất cấu trúc interface TypeScript
 * @param {Object} node - Node trong AST
 * @returns {Object} - Cấu trúc interface
 */
function extractTypeScriptInterface(node) {
  const result = {};
  
  if (node.body && node.body.body) {
    for (const prop of node.body.body) {
      if (prop.key && prop.key.name) {
        const key = prop.key.name;
        let type = '';
        
        if (prop.typeAnnotation) {
          type = escodegen.generate(prop.typeAnnotation);
        }
        
        result[key] = type;
      }
    }
  }
  
  return result;
}

/**
 * Trích xuất cấu trúc class
 * @param {Object} node - Node trong AST
 * @returns {Object} - Cấu trúc class
 */
function extractClassStructure(node) {
  const result = {
    properties: {},
    methods: []
  };
  
  if (node.body && node.body.body) {
    for (const member of node.body.body) {
      if (member.type === 'ClassProperty' && member.key && member.key.name) {
        const key = member.key.name;
        result.properties[key] = member.value ? escodegen.generate(member.value) : null;
      } else if (member.type === 'MethodDefinition' && member.key && member.key.name) {
        const name = member.key.name;
        result.methods.push(name);
      }
    }
  }
  
  return result;
}

/**
 * Tạo báo cáo phân tích
 */
function generateReport() {
  // Loại bỏ các endpoint trùng lặp
  const uniqueEndpoints = [];
  const endpointMap = new Map();
  
  for (const endpoint of result.endpoints) {
    const key = `${endpoint.method}:${endpoint.url}`;
    
    if (!endpointMap.has(key)) {
      endpointMap.set(key, endpoint);
      uniqueEndpoints.push(endpoint);
    }
  }
  
  result.endpoints = uniqueEndpoints;
  
  // Loại bỏ các auth method trùng lặp
  const uniqueAuthMethods = [];
  const authMethodMap = new Map();
  
  for (const method of result.authMethods) {
    const key = `${method.type}:${method.code}`;
    
    if (!authMethodMap.has(key)) {
      authMethodMap.set(key, method);
      uniqueAuthMethods.push(method);
    }
  }
  
  result.authMethods = uniqueAuthMethods;
  
  // Ghi báo cáo ra file
  fs.writeFileSync(
    path.resolve(__dirname, 'user-api-analysis.json'),
    JSON.stringify(result, null, 2)
  );
  
  console.log('Phân tích API hoàn tất. Kết quả được lưu trong file user-api-analysis.json');
  
  // In tóm tắt
  console.log('\n=== TÓM TẮT PHÂN TÍCH API ===');
  console.log(`Số lượng endpoints: ${result.endpoints.length}`);
  console.log(`Số lượng phương thức xác thực: ${result.authMethods.length}`);
  console.log(`Số lượng cấu trúc dữ liệu: ${Object.keys(result.dataStructures).length}`);
  
  // In danh sách endpoints
  console.log('\n=== DANH SÁCH ENDPOINTS ===');
  for (const endpoint of result.endpoints.slice(0, 10)) {
    console.log(`${endpoint.method} ${endpoint.url} (${endpoint.file}:${endpoint.line})`);
  }
  if (result.endpoints.length > 10) {
    console.log(`... và ${result.endpoints.length - 10} endpoints khác`);
  }
}

// Bắt đầu phân tích
console.log('Bắt đầu phân tích API trong thư mục User...');
const jsFiles = findJsFiles(USER_DIR);
console.log(`Tìm thấy ${jsFiles.length} file JavaScript/TypeScript`);

for (const file of jsFiles) {
  analyzeFile(file);
}

generateReport();
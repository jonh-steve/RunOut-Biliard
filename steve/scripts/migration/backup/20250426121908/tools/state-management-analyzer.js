/**
 * State Management Analyzer
 * 
 * Công cụ này sẽ phân tích cách quản lý trạng thái trong thư mục User,
 * bao gồm các state, context, redux, và các biến trạng thái khác.
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
  stateHooks: [],
  contextProviders: [],
  reduxStores: [],
  reduxActions: [],
  reduxReducers: [],
  globalStates: [],
  localStates: []
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
 * Phân tích file để tìm quản lý trạng thái
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
    
    // Kiểm tra nhanh xem file có chứa các từ khóa liên quan đến state không
    const hasStateKeywords = /useState|useReducer|createContext|Provider|createStore|combineReducers|useSelector|useDispatch|connect|mapStateToProps|this\.state|setState/g.test(content);
    
    if (!hasStateKeywords) {
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
    
    // Duyệt qua AST để tìm quản lý trạng thái
    estraverse.traverse(ast, {
      enter: function(node, parent) {
        // Tìm React Hooks (useState, useReducer)
        findReactHooks(node, filePath);
        
        // Tìm Context API
        findContextAPI(node, filePath);
        
        // Tìm Redux
        findRedux(node, filePath);
        
        // Tìm Class Component State
        findClassComponentState(node, filePath);
      }
    });
  } catch (error) {
    console.error(`Error analyzing file ${filePath}: ${error.message}`);
  }
}

/**
 * Tìm React Hooks trong AST
 * @param {Object} node - Node trong AST
 * @param {string} filePath - Đường dẫn file
 */
function findReactHooks(node, filePath) {
  // Tìm useState và useReducer
  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    (node.callee.name === 'useState' || node.callee.name === 'useReducer')
  ) {
    const hookType = node.callee.name;
    let stateName = '';
    let initialValue = null;
    
    // Tìm tên state từ destructuring assignment
    if (parent && parent.type === 'VariableDeclarator' && parent.id.type === 'ArrayPattern') {
      if (parent.id.elements[0] && parent.id.elements[0].type === 'Identifier') {
        stateName = parent.id.elements[0].name;
      }
    }
    
    // Lấy giá trị khởi tạo
    if (node.arguments.length > 0) {
      if (node.arguments[0].type === 'Literal') {
        initialValue = node.arguments[0].value;
      } else if (node.arguments[0].type === 'ObjectExpression') {
        initialValue = extractObjectStructure(node.arguments[0]);
      } else if (node.arguments[0].type === 'ArrayExpression') {
        initialValue = extractArrayStructure(node.arguments[0]);
      } else {
        initialValue = escodegen.generate(node.arguments[0]);
      }
    }
    
    result.stateHooks.push({
      type: hookType,
      name: stateName,
      initialValue,
      file: path.relative(USER_DIR, filePath),
      line: node.loc.start.line
    });
  }
}

/**
 * Tìm Context API trong AST
 * @param {Object} node - Node trong AST
 * @param {string} filePath - Đường dẫn file
 */
function findContextAPI(node, filePath) {
  // Tìm createContext
  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'createContext'
  ) {
    let contextName = '';
    let initialValue = null;
    
    // Tìm tên context từ variable declaration
    if (parent && parent.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
      contextName = parent.id.name;
    }
    
    // Lấy giá trị khởi tạo
    if (node.arguments.length > 0) {
      if (node.arguments[0].type === 'Literal') {
        initialValue = node.arguments[0].value;
      } else if (node.arguments[0].type === 'ObjectExpression') {
        initialValue = extractObjectStructure(node.arguments[0]);
      } else if (node.arguments[0].type === 'ArrayExpression') {
        initialValue = extractArrayStructure(node.arguments[0]);
      } else {
        initialValue = escodegen.generate(node.arguments[0]);
      }
    }
    
    result.contextProviders.push({
      name: contextName,
      initialValue,
      file: path.relative(USER_DIR, filePath),
      line: node.loc.start.line
    });
  }
  
  // Tìm Context.Provider
  if (
    node.type === 'JSXElement' &&
    node.openingElement &&
    node.openingElement.name &&
    node.openingElement.name.type === 'JSXMemberExpression' &&
    node.openingElement.name.property &&
    node.openingElement.name.property.name === 'Provider'
  ) {
    let contextName = '';
    let value = null;
    
    // Lấy tên context
    if (node.openingElement.name.object && node.openingElement.name.object.type === 'JSXIdentifier') {
      contextName = node.openingElement.name.object.name;
    }
    
    // Lấy giá trị từ thuộc tính value
    for (const attr of node.openingElement.attributes) {
      if (attr.name && attr.name.name === 'value') {
        if (attr.value && attr.value.expression) {
          value = escodegen.generate(attr.value.expression);
        }
        break;
      }
    }
    
    result.contextProviders.push({
      name: contextName,
      value,
      isProvider: true,
      file: path.relative(USER_DIR, filePath),
      line: node.loc.start.line
    });
  }
}

/**
 * Tìm Redux trong AST
 * @param {Object} node - Node trong AST
 * @param {string} filePath - Đường dẫn file
 */
function findRedux(node, filePath) {
  // Tìm createStore
  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'createStore'
  ) {
    let reducer = null;
    
    // Lấy reducer
    if (node.arguments.length > 0) {
      if (node.arguments[0].type === 'Identifier') {
        reducer = node.arguments[0].name;
      } else {
        reducer = escodegen.generate(node.arguments[0]);
      }
    }
    
    result.reduxStores.push({
      reducer,
      file: path.relative(USER_DIR, filePath),
      line: node.loc.start.line
    });
  }
  
  // Tìm combineReducers
  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'combineReducers'
  ) {
    let reducers = null;
    
    // Lấy reducers
    if (node.arguments.length > 0 && node.arguments[0].type === 'ObjectExpression') {
      reducers = extractObjectStructure(node.arguments[0]);
    }
    
    result.reduxReducers.push({
      reducers,
      file: path.relative(USER_DIR, filePath),
      line: node.loc.start.line
    });
  }
  
  // Tìm action creators
  if (
    node.type === 'FunctionDeclaration' &&
    node.id &&
    node.id.name &&
    node.body &&
    node.body.type === 'BlockStatement'
  ) {
    // Kiểm tra xem function có return một object với type không
    let isActionCreator = false;
    let actionType = null;
    
    estraverse.traverse(node.body, {
      enter: function(subNode) {
        if (
          subNode.type === 'ReturnStatement' &&
          subNode.argument &&
          subNode.argument.type === 'ObjectExpression'
        ) {
          for (const prop of subNode.argument.properties) {
            if (
              prop.key &&
              prop.key.name === 'type' &&
              prop.value &&
              prop.value.type === 'Literal'
            ) {
              isActionCreator = true;
              actionType = prop.value.value;
              break;
            }
          }
        }
      }
    });
    
    if (isActionCreator) {
      result.reduxActions.push({
        name: node.id.name,
        type: actionType,
        file: path.relative(USER_DIR, filePath),
        line: node.loc.start.line
      });
    }
  }
  
  // Tìm reducer functions
  if (
    node.type === 'FunctionDeclaration' &&
    node.id &&
    node.id.name &&
    node.params &&
    node.params.length >= 2 &&
    node.body &&
    node.body.type === 'BlockStatement'
  ) {
    // Kiểm tra xem function có switch-case trên action.type không
    let isReducer = false;
    let cases = [];
    
    estraverse.traverse(node.body, {
      enter: function(subNode) {
        if (
          subNode.type === 'SwitchStatement' &&
          subNode.discriminant &&
          subNode.discriminant.type === 'MemberExpression' &&
          subNode.discriminant.property &&
          subNode.discriminant.property.name === 'type'
        ) {
          isReducer = true;
          
          // Lấy các case
          for (const caseNode of subNode.cases) {
            if (caseNode.test && caseNode.test.type === 'Literal') {
              cases.push(caseNode.test.value);
            }
          }
        }
      }
    });
    
    if (isReducer) {
      result.reduxReducers.push({
        name: node.id.name,
        cases,
        file: path.relative(USER_DIR, filePath),
        line: node.loc.start.line
      });
    }
  }
}

/**
 * Tìm Class Component State trong AST
 * @param {Object} node - Node trong AST
 * @param {string} filePath - Đường dẫn file
 */
function findClassComponentState(node, filePath) {
  // Tìm this.state và this.setState
  if (
    node.type === 'ClassDeclaration' &&
    node.id &&
    node.id.name
  ) {
    const className = node.id.name;
    let initialState = null;
    let stateUpdates = [];
    
    // Duyệt qua các phương thức và thuộc tính của class
    estraverse.traverse(node, {
      enter: function(subNode) {
        // Tìm constructor với this.state
        if (
          subNode.type === 'MethodDefinition' &&
          subNode.key &&
          subNode.key.name === 'constructor'
        ) {
          estraverse.traverse(subNode.value.body, {
            enter: function(constructorNode) {
              if (
                constructorNode.type === 'AssignmentExpression' &&
                constructorNode.left.type === 'MemberExpression' &&
                constructorNode.left.object.type === 'ThisExpression' &&
                constructorNode.left.property.name === 'state'
              ) {
                if (constructorNode.right.type === 'ObjectExpression') {
                  initialState = extractObjectStructure(constructorNode.right);
                }
              }
            }
          });
        }
        
        // Tìm this.setState
        if (
          subNode.type === 'CallExpression' &&
          subNode.callee.type === 'MemberExpression' &&
          subNode.callee.object.type === 'ThisExpression' &&
          subNode.callee.property.name === 'setState'
        ) {
          let update = null;
          
          if (subNode.arguments.length > 0) {
            if (subNode.arguments[0].type === 'ObjectExpression') {
              update = extractObjectStructure(subNode.arguments[0]);
            } else if (subNode.arguments[0].type === 'ArrowFunctionExpression' || 
                      subNode.arguments[0].type === 'FunctionExpression') {
              update = escodegen.generate(subNode.arguments[0]);
            }
          }
          
          if (update) {
            stateUpdates.push({
              update,
              line: subNode.loc.start.line
            });
          }
        }
      }
    });
    
    if (initialState || stateUpdates.length > 0) {
      result.localStates.push({
        className,
        initialState,
        stateUpdates,
        file: path.relative(USER_DIR, filePath),
        line: node.loc.start.line
      });
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
      if (prop.key.type === 'Identifier' || prop.key.type === 'Literal') {
        const key = prop.key.type === 'Identifier' ? prop.key.name : prop.key.value;
        
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
    if (!element) continue;
    
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
 * Tạo báo cáo phân tích
 */
function generateReport() {
  // Ghi báo cáo ra file
  fs.writeFileSync(
    path.resolve(__dirname, 'user-state-analysis.json'),
    JSON.stringify(result, null, 2)
  );
  
  console.log('Phân tích quản lý trạng thái hoàn tất. Kết quả được lưu trong file user-state-analysis.json');
  
  // In tóm tắt
  console.log('\n=== TÓM TẮT PHÂN TÍCH QUẢN LÝ TRẠNG THÁI ===');
  console.log(`Số lượng React Hooks: ${result.stateHooks.length}`);
  console.log(`Số lượng Context Providers: ${result.contextProviders.length}`);
  console.log(`Số lượng Redux Stores: ${result.reduxStores.length}`);
  console.log(`Số lượng Redux Actions: ${result.reduxActions.length}`);
  console.log(`Số lượng Redux Reducers: ${result.reduxReducers.length}`);
  console.log(`Số lượng Class Component States: ${result.localStates.length}`);
  
  // In chi tiết về các loại state management
  if (result.stateHooks.length > 0) {
    console.log('\n=== REACT HOOKS ===');
    for (const hook of result.stateHooks.slice(0, 5)) {
      console.log(`${hook.type} "${hook.name}" (${hook.file}:${hook.line})`);
    }
    if (result.stateHooks.length > 5) {
      console.log(`... và ${result.stateHooks.length - 5} hooks khác`);
    }
  }
  
  if (result.contextProviders.length > 0) {
    console.log('\n=== CONTEXT PROVIDERS ===');
    for (const context of result.contextProviders.slice(0, 5)) {
      console.log(`${context.name} (${context.file}:${context.line})`);
    }
    if (result.contextProviders.length > 5) {
      console.log(`... và ${result.contextProviders.length - 5} context providers khác`);
    }
  }
  
  if (result.reduxStores.length > 0 || result.reduxReducers.length > 0 || result.reduxActions.length > 0) {
    console.log('\n=== REDUX ===');
    console.log(`Stores: ${result.reduxStores.length}`);
    console.log(`Reducers: ${result.reduxReducers.length}`);
    console.log(`Actions: ${result.reduxActions.length}`);
  }
}

// Bắt đầu phân tích
console.log('Bắt đầu phân tích quản lý trạng thái trong thư mục User...');
const jsFiles = findJsFiles(USER_DIR);
console.log(`Tìm thấy ${jsFiles.length} file JavaScript/TypeScript`);

for (const file of jsFiles) {
  analyzeFile(file);
}

generateReport();
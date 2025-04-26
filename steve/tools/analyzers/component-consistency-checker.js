#!/usr/bin/env node

/**
 * Component Consistency Checker
 * 
 * Công cụ kiểm tra tính nhất quán giữa các component Material UI và Tailwind CSS
 * Sử dụng: node component-consistency-checker.js <mui_component_path> <tailwind_component_path>
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const chalk = require('chalk');
const diff = require('diff');
const inquirer = require('inquirer');

// Cấu hình
const CONFIG = {
  // Các thuộc tính cần kiểm tra tính nhất quán
  propsToCheck: {
    // Button
    Button: ['variant', 'color', 'size', 'disabled', 'startIcon', 'endIcon', 'fullWidth', 'href', 'onClick'],
    
    // TextField
    TextField: ['label', 'variant', 'size', 'disabled', 'error', 'helperText', 'fullWidth', 'placeholder', 'value', 'onChange'],
    
    // Card
    Card: ['elevation', 'variant', 'raised'],
    CardHeader: ['title', 'subheader', 'avatar', 'action'],
    CardContent: [],
    CardActions: ['disableSpacing'],
    
    // Typography
    Typography: ['variant', 'component', 'color', 'align', 'gutterBottom', 'noWrap', 'paragraph'],
    
    // Layout
    Container: ['maxWidth', 'fixed', 'disableGutters'],
    Grid: ['container', 'item', 'spacing', 'xs', 'sm', 'md', 'lg', 'xl', 'direction', 'justifyContent', 'alignItems'],
    Box: ['m', 'p', 'mt', 'mb', 'ml', 'mr', 'pt', 'pb', 'pl', 'pr', 'display', 'flexDirection', 'alignItems', 'justifyContent'],
    
    // Các component khác
    Checkbox: ['checked', 'disabled', 'indeterminate', 'color', 'onChange'],
    Radio: ['checked', 'disabled', 'color', 'onChange'],
    Select: ['value', 'disabled', 'multiple', 'variant', 'onChange'],
    Switch: ['checked', 'disabled', 'color', 'onChange'],
    Slider: ['value', 'min', 'max', 'step', 'disabled', 'onChange'],
    
    // Mặc định cho các component khác
    default: ['className', 'style', 'id', 'data-testid']
  },
  
  // Ánh xạ tên component giữa Material UI và Tailwind CSS
  componentMapping: {
    'Button': 'Button',
    'TextField': 'TextField',
    'Card': 'Card',
    'CardHeader': 'CardHeader',
    'CardContent': 'CardContent',
    'CardActions': 'CardFooter',
    'Typography': 'Typography',
    'Container': 'Container',
    'Grid': 'Grid',
    'Box': 'Box',
    'Checkbox': 'Checkbox',
    'Radio': 'Radio',
    'Select': 'Select',
    'Switch': 'Switch',
    'Slider': 'Slider',
    'Hidden': 'div', // Hidden được thay thế bằng div với className
    'Divider': 'Divider',
    'Paper': 'Paper',
    'List': 'List',
    'ListItem': 'ListItem',
    'ListItemText': 'ListItemText',
    'ListItemIcon': 'ListItemIcon',
    'Avatar': 'Avatar',
    'AppBar': 'AppBar',
    'Toolbar': 'Toolbar',
    'IconButton': 'IconButton',
    'Menu': 'Menu',
    'MenuItem': 'MenuItem',
    'Dialog': 'Dialog',
    'DialogTitle': 'DialogTitle',
    'DialogContent': 'DialogContent',
    'DialogActions': 'DialogFooter',
    'Tabs': 'Tabs',
    'Tab': 'Tab',
    'Snackbar': 'Snackbar',
    'Alert': 'Alert',
    'CircularProgress': 'Spinner',
    'LinearProgress': 'Progress',
    'Badge': 'Badge',
    'Breadcrumbs': 'Breadcrumbs',
    'Chip': 'Badge', // Chip thường được thay thế bằng Badge trong Tailwind
    'Tooltip': 'Tooltip',
    'Table': 'Table',
    'TableBody': 'TableBody',
    'TableCell': 'TableCell',
    'TableContainer': 'TableContainer',
    'TableHead': 'TableHead',
    'TableRow': 'TableRow',
    'Accordion': 'Disclosure',
    'AccordionSummary': 'DisclosureButton',
    'AccordionDetails': 'DisclosurePanel',
    'Drawer': 'Drawer',
    'Fab': 'Button', // Fab thường được thay thế bằng Button với className
    'FormControl': 'FormControl',
    'FormGroup': 'FormGroup',
    'FormControlLabel': 'FormLabel',
    'FormHelperText': 'FormHelperText',
    'InputLabel': 'Label',
    'Pagination': 'Pagination',
    'Stepper': 'Stepper',
    'Step': 'Step',
    'StepLabel': 'StepLabel',
    'MobileStepper': 'Stepper'
  },
  
  // Ánh xạ props giữa Material UI và Tailwind CSS
  propsMapping: {
    // Button
    Button: {
      'variant': {
        'contained': 'primary',
        'outlined': 'outline',
        'text': 'ghost'
      },
      'color': {
        'primary': 'primary',
        'secondary': 'secondary',
        'default': 'default',
        'inherit': 'default',
        'error': 'danger'
      },
      'size': {
        'small': 'sm',
        'medium': 'md',
        'large': 'lg'
      },
      'startIcon': 'icon',
      'endIcon': 'rightIcon'
    },
    
    // TextField
    TextField: {
      'variant': {
        'outlined': 'outlined',
        'filled': 'filled',
        'standard': 'standard'
      },
      'size': {
        'small': 'sm',
        'medium': 'md'
      }
    },
    
    // Typography
    Typography: {
      'variant': {
        'h1': 'h1',
        'h2': 'h2',
        'h3': 'h3',
        'h4': 'h4',
        'h5': 'h5',
        'h6': 'h6',
        'subtitle1': 'subtitle',
        'subtitle2': 'subtitle2',
        'body1': 'body',
        'body2': 'body2',
        'caption': 'caption',
        'button': 'button',
        'overline': 'overline'
      },
      'align': 'align',
      'color': {
        'primary': 'primary',
        'secondary': 'secondary',
        'textPrimary': 'default',
        'textSecondary': 'muted',
        'error': 'danger'
      }
    },
    
    // Grid
    Grid: {
      'spacing': 'gap',
      'xs': 'xs',
      'sm': 'sm',
      'md': 'md',
      'lg': 'lg',
      'xl': 'xl',
      'direction': 'direction',
      'justifyContent': 'justify',
      'alignItems': 'items'
    }
  }
};

/**
 * Phân tích component từ file
 * @param {string} filePath - Đường dẫn file
 * @returns {Object} - Thông tin component
 */
function parseComponent(filePath) {
  try {
    // Đọc nội dung file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Parse code thành AST
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'classProperties', 'decorators-legacy']
    });
    
    // Thông tin component
    const componentInfo = {
      name: path.basename(filePath, path.extname(filePath)),
      imports: [],
      exports: [],
      props: [],
      jsx: [],
      hooks: [],
      functions: []
    };
    
    // Traverse AST để phân tích component
    traverse(ast, {
      // Phân tích imports
      ImportDeclaration(path) {
        componentInfo.imports.push({
          source: path.node.source.value,
          specifiers: path.node.specifiers.map(specifier => {
            if (t.isImportDefaultSpecifier(specifier)) {
              return {
                type: 'default',
                local: specifier.local.name
              };
            } else if (t.isImportSpecifier(specifier)) {
              return {
                type: 'named',
                imported: specifier.imported.name,
                local: specifier.local.name
              };
            } else if (t.isImportNamespaceSpecifier(specifier)) {
              return {
                type: 'namespace',
                local: specifier.local.name
              };
            }
          })
        });
      },
      
      // Phân tích exports
      ExportDefaultDeclaration(path) {
        if (t.isFunctionDeclaration(path.node.declaration)) {
          componentInfo.exports.push({
            type: 'default',
            name: path.node.declaration.id ? path.node.declaration.id.name : 'Anonymous'
          });
        } else if (t.isClassDeclaration(path.node.declaration)) {
          componentInfo.exports.push({
            type: 'default',
            name: path.node.declaration.id.name
          });
        } else if (t.isIdentifier(path.node.declaration)) {
          componentInfo.exports.push({
            type: 'default',
            name: path.node.declaration.name
          });
        }
      },
      
      ExportNamedDeclaration(path) {
        if (t.isFunctionDeclaration(path.node.declaration)) {
          componentInfo.exports.push({
            type: 'named',
            name: path.node.declaration.id.name
          });
        } else if (t.isClassDeclaration(path.node.declaration)) {
          componentInfo.exports.push({
            type: 'named',
            name: path.node.declaration.id.name
          });
        } else if (path.node.specifiers.length > 0) {
          path.node.specifiers.forEach(specifier => {
            componentInfo.exports.push({
              type: 'named',
              name: specifier.exported.name,
              local: specifier.local.name
            });
          });
        }
      },
      
      // Phân tích JSX
      JSXElement(path) {
        const openingElement = path.node.openingElement;
        
        // Lấy tên component
        let componentName = '';
        if (t.isJSXIdentifier(openingElement.name)) {
          componentName = openingElement.name.name;
        } else if (t.isJSXMemberExpression(openingElement.name)) {
          componentName = openingElement.name.property.name;
        }
        
        // Lấy props
        const props = openingElement.attributes.map(attr => {
          if (t.isJSXAttribute(attr)) {
            let value = null;
            
            if (t.isJSXExpressionContainer(attr.value)) {
              if (t.isStringLiteral(attr.value.expression)) {
                value = attr.value.expression.value;
              } else if (t.isNumericLiteral(attr.value.expression)) {
                value = attr.value.expression.value;
              } else if (t.isBooleanLiteral(attr.value.expression)) {
                value = attr.value.expression.value;
              } else if (t.isIdentifier(attr.value.expression)) {
                value = attr.value.expression.name;
              } else if (t.isObjectExpression(attr.value.expression)) {
                value = 'object';
              } else if (t.isArrayExpression(attr.value.expression)) {
                value = 'array';
              } else if (t.isJSXElement(attr.value.expression)) {
                value = 'jsx';
              } else if (t.isArrowFunctionExpression(attr.value.expression) || t.isFunctionExpression(attr.value.expression)) {
                value = 'function';
              } else {
                value = 'expression';
              }
            } else if (t.isStringLiteral(attr.value)) {
              value = attr.value.value;
            } else if (attr.value === null) {
              value = true;
            }
            
            return {
              name: attr.name.name,
              value
            };
          }
          
          return null;
        }).filter(Boolean);
        
        componentInfo.jsx.push({
          name: componentName,
          props
        });
      },
      
      // Phân tích hooks
      CallExpression(path) {
        if (t.isIdentifier(path.node.callee) && path.node.callee.name.startsWith('use')) {
          componentInfo.hooks.push({
            name: path.node.callee.name,
            arguments: path.node.arguments.length
          });
        }
      },
      
      // Phân tích functions
      FunctionDeclaration(path) {
        componentInfo.functions.push({
          name: path.node.id.name,
          params: path.node.params.length
        });
      },
      
      ArrowFunctionExpression(path) {
        if (path.parent && t.isVariableDeclarator(path.parent) && path.parent.id) {
          componentInfo.functions.push({
            name: path.parent.id.name,
            params: path.node.params.length
          });
        }
      }
    });
    
    return componentInfo;
  } catch (error) {
    console.error(chalk.red(`Lỗi khi phân tích file ${filePath}:`), error);
    return null;
  }
}

/**
 * So sánh hai component
 * @param {Object} muiComponent - Component Material UI
 * @param {Object} tailwindComponent - Component Tailwind CSS
 * @returns {Object} - Kết quả so sánh
 */
function compareComponents(muiComponent, tailwindComponent) {
  const result = {
    name: {
      match: muiComponent.name === tailwindComponent.name,
      mui: muiComponent.name,
      tailwind: tailwindComponent.name
    },
    props: {
      match: true,
      missing: [],
      different: [],
      extra: []
    },
    jsx: {
      match: true,
      missing: [],
      different: [],
      extra: []
    },
    hooks: {
      match: true,
      missing: [],
      different: [],
      extra: []
    },
    functions: {
      match: true,
      missing: [],
      different: [],
      extra: []
    }
  };
  
  // So sánh props
  const muiProps = new Set(muiComponent.props.map(p => p.name));
  const tailwindProps = new Set(tailwindComponent.props.map(p => p.name));
  
  // Tìm props thiếu
  muiProps.forEach(prop => {
    if (!tailwindProps.has(prop)) {
      result.props.missing.push(prop);
      result.props.match = false;
    }
  });
  
  // Tìm props thừa
  tailwindProps.forEach(prop => {
    if (!muiProps.has(prop)) {
      result.props.extra.push(prop);
      result.props.match = false;
    }
  });
  
  // So sánh JSX
  const muiJSX = new Map(muiComponent.jsx.map(j => [j.name, j]));
  const tailwindJSX = new Map(tailwindComponent.jsx.map(j => [j.name, j]));
  
  // Tìm JSX thiếu
  muiJSX.forEach((jsx, name) => {
    const mappedName = CONFIG.componentMapping[name] || name;
    
    if (!tailwindJSX.has(mappedName)) {
      result.jsx.missing.push(name);
      result.jsx.match = false;
    } else {
      // So sánh props của JSX
      const muiJSXProps = new Map(jsx.props.map(p => [p.name, p]));
      const tailwindJSXProps = new Map(tailwindJSX.get(mappedName).props.map(p => [p.name, p]));
      
      // Lấy danh sách props cần kiểm tra
      const propsToCheck = CONFIG.propsToCheck[name] || CONFIG.propsToCheck.default;
      
      propsToCheck.forEach(propName => {
        // Kiểm tra xem prop có trong mapping không
        const propMapping = CONFIG.propsMapping[name] && CONFIG.propsMapping[name][propName];
        const mappedPropName = propMapping || propName;
        
        if (muiJSXProps.has(propName) && !tailwindJSXProps.has(mappedPropName)) {
          result.jsx.different.push({
            component: name,
            prop: propName,
            muiValue: muiJSXProps.get(propName).value,
            tailwindValue: null
          });
          result.jsx.match = false;
        }
      });
    }
  });
  
  // Tìm JSX thừa
  tailwindJSX.forEach((jsx, name) => {
    const reverseMappedNames = Object.entries(CONFIG.componentMapping)
      .filter(([_, value]) => value === name)
      .map(([key, _]) => key);
    
    if (reverseMappedNames.length === 0 && !muiJSX.has(name)) {
      result.jsx.extra.push(name);
      result.jsx.match = false;
    }
  });
  
  // So sánh hooks
  const muiHooks = new Map(muiComponent.hooks.map(h => [h.name, h]));
  const tailwindHooks = new Map(tailwindComponent.hooks.map(h => [h.name, h]));
  
  // Tìm hooks thiếu
  muiHooks.forEach((hook, name) => {
    if (!tailwindHooks.has(name)) {
      result.hooks.missing.push(name);
      result.hooks.match = false;
    }
  });
  
  // Tìm hooks thừa
  tailwindHooks.forEach((hook, name) => {
    if (!muiHooks.has(name)) {
      result.hooks.extra.push(name);
      result.hooks.match = false;
    }
  });
  
  // So sánh functions
  const muiFunctions = new Map(muiComponent.functions.map(f => [f.name, f]));
  const tailwindFunctions = new Map(tailwindComponent.functions.map(f => [f.name, f]));
  
  // Tìm functions thiếu
  muiFunctions.forEach((func, name) => {
    if (!tailwindFunctions.has(name)) {
      result.functions.missing.push(name);
      result.functions.match = false;
    }
  });
  
  // Tìm functions thừa
  tailwindFunctions.forEach((func, name) => {
    if (!muiFunctions.has(name)) {
      result.functions.extra.push(name);
      result.functions.match = false;
    }
  });
  
  return result;
}

/**
 * Hiển thị kết quả so sánh
 * @param {Object} result - Kết quả so sánh
 */
function displayResult(result) {
  console.log(chalk.blue('='.repeat(80)));
  console.log(chalk.blue(`So sánh component: ${result.name.mui} (Material UI) vs ${result.name.tailwind} (Tailwind CSS)`));
  console.log(chalk.blue('='.repeat(80)));
  
  // Hiển thị kết quả so sánh tên
  console.log(chalk.bold('Tên component:'));
  if (result.name.match) {
    console.log(chalk.green('✓ Tên component khớp'));
  } else {
    console.log(chalk.yellow(`⚠ Tên component khác nhau: ${result.name.mui} vs ${result.name.tailwind}`));
  }
  
  // Hiển thị kết quả so sánh props
  console.log(chalk.bold('\nProps:'));
  if (result.props.match) {
    console.log(chalk.green('✓ Props khớp'));
  } else {
    if (result.props.missing.length > 0) {
      console.log(chalk.yellow(`⚠ Props thiếu trong Tailwind component: ${result.props.missing.join(', ')}`));
    }
    if (result.props.extra.length > 0) {
      console.log(chalk.yellow(`⚠ Props thừa trong Tailwind component: ${result.props.extra.join(', ')}`));
    }
  }
  
  // Hiển thị kết quả so sánh JSX
  console.log(chalk.bold('\nJSX:'));
  if (result.jsx.match) {
    console.log(chalk.green('✓ JSX khớp'));
  } else {
    if (result.jsx.missing.length > 0) {
      console.log(chalk.yellow(`⚠ JSX thiếu trong Tailwind component: ${result.jsx.missing.join(', ')}`));
    }
    if (result.jsx.different.length > 0) {
      console.log(chalk.yellow('⚠ JSX khác nhau:'));
      result.jsx.different.forEach(diff => {
        console.log(chalk.yellow(`  - Component: ${diff.component}, Prop: ${diff.prop}, MUI: ${diff.muiValue}, Tailwind: ${diff.tailwindValue}`));
      });
    }
    if (result.jsx.extra.length > 0) {
      console.log(chalk.yellow(`⚠ JSX thừa trong Tailwind component: ${result.jsx.extra.join(', ')}`));
    }
  }
  
  // Hiển thị kết quả so sánh hooks
  console.log(chalk.bold('\nHooks:'));
  if (result.hooks.match) {
    console.log(chalk.green('✓ Hooks khớp'));
  } else {
    if (result.hooks.missing.length > 0) {
      console.log(chalk.yellow(`⚠ Hooks thiếu trong Tailwind component: ${result.hooks.missing.join(', ')}`));
    }
    if (result.hooks.extra.length > 0) {
      console.log(chalk.yellow(`⚠ Hooks thừa trong Tailwind component: ${result.hooks.extra.join(', ')}`));
    }
  }
  
  // Hiển thị kết quả so sánh functions
  console.log(chalk.bold('\nFunctions:'));
  if (result.functions.match) {
    console.log(chalk.green('✓ Functions khớp'));
  } else {
    if (result.functions.missing.length > 0) {
      console.log(chalk.yellow(`⚠ Functions thiếu trong Tailwind component: ${result.functions.missing.join(', ')}`));
    }
    if (result.functions.extra.length > 0) {
      console.log(chalk.yellow(`⚠ Functions thừa trong Tailwind component: ${result.functions.extra.join(', ')}`));
    }
  }
  
  // Hiển thị kết luận
  console.log(chalk.blue('\n='.repeat(80)));
  if (result.name.match && result.props.match && result.jsx.match && result.hooks.match && result.functions.match) {
    console.log(chalk.green('✓ Component hoàn toàn tương thích'));
  } else {
    console.log(chalk.yellow('⚠ Component có một số điểm không tương thích'));
  }
  console.log(chalk.blue('='.repeat(80)));
}

/**
 * So sánh nội dung hai file
 * @param {string} muiPath - Đường dẫn file Material UI
 * @param {string} tailwindPath - Đường dẫn file Tailwind CSS
 */
function compareFiles(muiPath, tailwindPath) {
  try {
    const muiContent = fs.readFileSync(muiPath, 'utf8');
    const tailwindContent = fs.readFileSync(tailwindPath, 'utf8');
    
    // Tính toán diff
    const differences = diff.diffLines(muiContent, tailwindContent);
    
    console.log(chalk.blue('='.repeat(80)));
    console.log(chalk.blue(`So sánh nội dung file: ${path.basename(muiPath)} vs ${path.basename(tailwindPath)}`));
    console.log(chalk.blue('='.repeat(80)));
    
    differences.forEach(part => {
      // Hiển thị tối đa 3 dòng cho mỗi phần
      const lines = part.value.split('\n');
      const displayLines = lines.length > 3 ? [...lines.slice(0, 3), `... (${lines.length - 3} dòng khác)`] : lines;
      
      const color = part.added ? chalk.green : part.removed ? chalk.red : chalk.grey;
      const prefix = part.added ? '+' : part.removed ? '-' : ' ';
      
      displayLines.forEach(line => {
        if (line) {
          console.log(color(`${prefix} ${line}`));
        }
      });
    });
    
    // Hiển thị thống kê
    const addedLines = differences.filter(part => part.added).reduce((sum, part) => sum + part.count, 0);
    const removedLines = differences.filter(part => part.removed).reduce((sum, part) => sum + part.count, 0);
    const unchangedLines = differences.filter(part => !part.added && !part.removed).reduce((sum, part) => sum + part.count, 0);
    
    console.log(chalk.blue('\n='.repeat(80)));
    console.log(chalk.green(`+ Dòng thêm vào: ${addedLines}`));
    console.log(chalk.red(`- Dòng bị xóa: ${removedLines}`));
    console.log(chalk.grey(`  Dòng không thay đổi: ${unchangedLines}`));
    console.log(chalk.blue('='.repeat(80)));
  } catch (error) {
    console.error(chalk.red(`Lỗi khi so sánh nội dung file:`), error);
  }
}

/**
 * Hàm main
 */
async function main() {
  try {
    // Hiển thị banner
    console.log(chalk.blue('='.repeat(80)));
    console.log(chalk.blue('Component Consistency Checker'));
    console.log(chalk.blue('Công cụ kiểm tra tính nhất quán giữa các component Material UI và Tailwind CSS'));
    console.log(chalk.blue('='.repeat(80)));
    
    // Lấy đường dẫn từ command line
    const args = process.argv.slice(2);
    let muiPath = '';
    let tailwindPath = '';
    
    if (args.length > 0) {
      muiPath = args[0];
    }
    
    if (args.length > 1) {
      tailwindPath = args[1];
    }
    
    // Nếu không có đường dẫn, hỏi người dùng
    if (!muiPath || !tailwindPath) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'muiPath',
          message: 'Nhập đường dẫn component Material UI:',
          validate: input => !!input || 'Đường dẫn không được để trống',
          default: muiPath
        },
        {
          type: 'input',
          name: 'tailwindPath',
          message: 'Nhập đường dẫn component Tailwind CSS:',
          validate: input => !!input || 'Đường dẫn không được để trống',
          default: tailwindPath
        },
        {
          type: 'list',
          name: 'action',
          message: 'Bạn muốn thực hiện hành động nào?',
          choices: [
            { name: 'Phân tích và so sánh component', value: 'analyze' },
            { name: 'So sánh nội dung file', value: 'compare' },
            { name: 'Cả hai', value: 'both' }
          ],
          default: 'both'
        }
      ]);
      
      muiPath = answers.muiPath;
      tailwindPath = answers.tailwindPath;
      const action = answers.action;
      
      // Kiểm tra file tồn tại
      if (!fs.existsSync(muiPath)) {
        console.error(chalk.red(`Lỗi: File Material UI không tồn tại: ${muiPath}`));
        process.exit(1);
      }
      
      if (!fs.existsSync(tailwindPath)) {
        console.error(chalk.red(`Lỗi: File Tailwind CSS không tồn tại: ${tailwindPath}`));
        process.exit(1);
      }
      
      // Thực hiện hành động
      if (action === 'analyze' || action === 'both') {
        console.log(chalk.blue('\nĐang phân tích component Material UI...'));
        const muiComponent = parseComponent(muiPath);
        
        console.log(chalk.blue('Đang phân tích component Tailwind CSS...'));
        const tailwindComponent = parseComponent(tailwindPath);
        
        if (muiComponent && tailwindComponent) {
          console.log(chalk.blue('Đang so sánh component...'));
          const result = compareComponents(muiComponent, tailwindComponent);
          
          displayResult(result);
          
          // Lưu kết quả vào file
          const outputPath = path.join(process.cwd(), 'component-comparison-result.json');
          fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
          console.log(chalk.blue(`Kết quả so sánh đã được lưu vào: ${outputPath}`));
        }
      }
      
      if (action === 'compare' || action === 'both') {
        compareFiles(muiPath, tailwindPath);
      }
    } else {
      // Kiểm tra file tồn tại
      if (!fs.existsSync(muiPath)) {
        console.error(chalk.red(`Lỗi: File Material UI không tồn tại: ${muiPath}`));
        process.exit(1);
      }
      
      if (!fs.existsSync(tailwindPath)) {
        console.error(chalk.red(`Lỗi: File Tailwind CSS không tồn tại: ${tailwindPath}`));
        process.exit(1);
      }
      
      // Thực hiện phân tích và so sánh
      console.log(chalk.blue('\nĐang phân tích component Material UI...'));
      const muiComponent = parseComponent(muiPath);
      
      console.log(chalk.blue('Đang phân tích component Tailwind CSS...'));
      const tailwindComponent = parseComponent(tailwindPath);
      
      if (muiComponent && tailwindComponent) {
        console.log(chalk.blue('Đang so sánh component...'));
        const result = compareComponents(muiComponent, tailwindComponent);
        
        displayResult(result);
        
        // Lưu kết quả vào file
        const outputPath = path.join(process.cwd(), 'component-comparison-result.json');
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
        console.log(chalk.blue(`Kết quả so sánh đã được lưu vào: ${outputPath}`));
      }
      
      // So sánh nội dung file
      compareFiles(muiPath, tailwindPath);
    }
    
    // Hỏi người dùng có muốn tạo báo cáo chi tiết không
    const { createReport } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'createReport',
        message: 'Bạn có muốn tạo báo cáo chi tiết không?',
        default: true
      }
    ]);
    
    if (createReport) {
      await generateDetailedReport(muiPath, tailwindPath);
    }
    
    console.log(chalk.green('\nHoàn thành kiểm tra tính nhất quán!'));
  } catch (error) {
    console.error(chalk.red('Lỗi:'), error);
    process.exit(1);
  }
}

/**
 * Tạo báo cáo chi tiết
 * @param {string} muiPath - Đường dẫn file Material UI
 * @param {string} tailwindPath - Đường dẫn file Tailwind CSS
 */
async function generateDetailedReport(muiPath, tailwindPath) {
  try {
    console.log(chalk.blue('\nĐang tạo báo cáo chi tiết...'));
    
    // Phân tích component
    const muiComponent = parseComponent(muiPath);
    const tailwindComponent = parseComponent(tailwindPath);
    
    if (!muiComponent || !tailwindComponent) {
      console.error(chalk.red('Không thể tạo báo cáo do lỗi phân tích component'));
      return;
    }
    
    // So sánh component
    const result = compareComponents(muiComponent, tailwindComponent);
    
    // Tạo báo cáo Markdown
    let report = `# Báo cáo kiểm tra tính nhất quán component\n\n`;
    report += `## Thông tin chung\n\n`;
    report += `- **Component Material UI**: ${path.basename(muiPath)}\n`;
    report += `- **Component Tailwind CSS**: ${path.basename(tailwindPath)}\n`;
    report += `- **Ngày kiểm tra**: ${new Date().toLocaleDateString('vi-VN')}\n\n`;
    
    report += `## Kết quả tổng quan\n\n`;
    
    // Tính điểm tương thích
    const nameScore = result.name.match ? 1 : 0;
    const propsScore = result.props.match ? 1 : (1 - result.props.missing.length / (muiComponent.props.length || 1));
    const jsxScore = result.jsx.match ? 1 : (1 - result.jsx.missing.length / (muiComponent.jsx.length || 1));
    const hooksScore = result.hooks.match ? 1 : (1 - result.hooks.missing.length / (muiComponent.hooks.length || 1));
    const functionsScore = result.functions.match ? 1 : (1 - result.functions.missing.length / (muiComponent.functions.length || 1));
    
    const totalScore = ((nameScore + propsScore + jsxScore + hooksScore + functionsScore) / 5) * 100;
    
    report += `- **Điểm tương thích**: ${totalScore.toFixed(2)}%\n`;
    report += `- **Tên component**: ${result.name.match ? '✅ Khớp' : '❌ Không khớp'}\n`;
    report += `- **Props**: ${result.props.match ? '✅ Khớp' : '❌ Không khớp'}\n`;
    report += `- **JSX**: ${result.jsx.match ? '✅ Khớp' : '❌ Không khớp'}\n`;
    report += `- **Hooks**: ${result.hooks.match ? '✅ Khớp' : '❌ Không khớp'}\n`;
    report += `- **Functions**: ${result.functions.match ? '✅ Khớp' : '❌ Không khớp'}\n\n`;
    
    report += `## Chi tiết so sánh\n\n`;
    
    // Chi tiết tên component
    report += `### Tên component\n\n`;
    report += `- Material UI: \`${result.name.mui}\`\n`;
    report += `- Tailwind CSS: \`${result.name.tailwind}\`\n\n`;
    
    // Chi tiết props
    report += `### Props\n\n`;
    if (result.props.match) {
      report += `✅ Tất cả props đều khớp\n\n`;
    } else {
      if (result.props.missing.length > 0) {
        report += `#### Props thiếu trong Tailwind component\n\n`;
        report += `| Prop | Mức độ quan trọng |\n`;
        report += `|------|------------------|\n`;
        
        result.props.missing.forEach(prop => {
          const importance = CONFIG.propsToCheck[muiComponent.name]?.includes(prop) ? 'Cao' : 'Thấp';
          report += `| \`${prop}\` | ${importance} |\n`;
        });
        
        report += `\n`;
      }
      
      if (result.props.extra.length > 0) {
        report += `#### Props thừa trong Tailwind component\n\n`;
        report += `| Prop | Ghi chú |\n`;
        report += `|------|--------|\n`;
        
        result.props.extra.forEach(prop => {
          report += `| \`${prop}\` | Prop này không có trong component Material UI |\n`;
        });
        
        report += `\n`;
      }
    }
    
    // Chi tiết JSX
    report += `### JSX\n\n`;
    if (result.jsx.match) {
      report += `✅ Tất cả JSX đều khớp\n\n`;
    } else {
      if (result.jsx.missing.length > 0) {
        report += `#### JSX thiếu trong Tailwind component\n\n`;
        report += `| Component | Mapping trong Tailwind |\n`;
        report += `|-----------|------------------------|\n`;
        
        result.jsx.missing.forEach(component => {
          const mapping = CONFIG.componentMapping[component] || 'Không có';
          report += `| \`${component}\` | \`${mapping}\` |\n`;
        });
        
        report += `\n`;
      }
      
      if (result.jsx.different.length > 0) {
        report += `#### JSX khác nhau\n\n`;
        report += `| Component | Prop | Giá trị Material UI | Giá trị Tailwind CSS |\n`;
        report += `|-----------|------|---------------------|---------------------|\n`;
        
        result.jsx.different.forEach(diff => {
          report += `| \`${diff.component}\` | \`${diff.prop}\` | \`${diff.muiValue || 'null'}\` | \`${diff.tailwindValue || 'null'}\` |\n`;
        });
        
        report += `\n`;
      }
      
      if (result.jsx.extra.length > 0) {
        report += `#### JSX thừa trong Tailwind component\n\n`;
        report += `| Component | Ghi chú |\n`;
        report += `|-----------|--------|\n`;
        
        result.jsx.extra.forEach(component => {
          report += `| \`${component}\` | Component này không có trong component Material UI |\n`;
        });
        
        report += `\n`;
      }
    }
    
    // Chi tiết hooks
    report += `### Hooks\n\n`;
    if (result.hooks.match) {
      report += `✅ Tất cả hooks đều khớp\n\n`;
    } else {
      if (result.hooks.missing.length > 0) {
        report += `#### Hooks thiếu trong Tailwind component\n\n`;
        report += `| Hook | Ghi chú |\n`;
        report += `|------|--------|\n`;
        
        result.hooks.missing.forEach(hook => {
          report += `| \`${hook}\` | Hook này cần được thêm vào component Tailwind |\n`;
        });
        
        report += `\n`;
      }
      
      if (result.hooks.extra.length > 0) {
        report += `#### Hooks thừa trong Tailwind component\n\n`;
        report += `| Hook | Ghi chú |\n`;
        report += `|------|--------|\n`;
        
        result.hooks.extra.forEach(hook => {
          report += `| \`${hook}\` | Hook này không có trong component Material UI |\n`;
        });
        
        report += `\n`;
      }
    }
    
    // Chi tiết functions
    report += `### Functions\n\n`;
    if (result.functions.match) {
      report += `✅ Tất cả functions đều khớp\n\n`;
    } else {
      if (result.functions.missing.length > 0) {
        report += `#### Functions thiếu trong Tailwind component\n\n`;
        report += `| Function | Ghi chú |\n`;
        report += `|----------|--------|\n`;
        
        result.functions.missing.forEach(func => {
          report += `| \`${func}\` | Function này cần được thêm vào component Tailwind |\n`;
        });
        
        report += `\n`;
      }
      
      if (result.functions.extra.length > 0) {
        report += `#### Functions thừa trong Tailwind component\n\n`;
        report += `| Function | Ghi chú |\n`;
        report += `|----------|--------|\n`;
        
        result.functions.extra.forEach(func => {
          report += `| \`${func}\` | Function này không có trong component Material UI |\n`;
        });
        
        report += `\n`;
      }
    }
    
    // Khuyến nghị
    report += `## Khuyến nghị\n\n`;
    
    if (totalScore >= 90) {
      report += `✅ **Component có tính nhất quán cao (${totalScore.toFixed(2)}%)**\n\n`;
      report += `Component Tailwind CSS đã triển khai hầu hết các tính năng của component Material UI. Chỉ cần một số điều chỉnh nhỏ để đạt được sự nhất quán hoàn toàn.\n\n`;
    } else if (totalScore >= 70) {
      report += `⚠️ **Component có tính nhất quán trung bình (${totalScore.toFixed(2)}%)**\n\n`;
      report += `Component Tailwind CSS đã triển khai một số tính năng quan trọng của component Material UI, nhưng vẫn còn thiếu một số tính năng cần thiết. Cần xem xét các điểm không khớp và cập nhật component.\n\n`;
    } else {
      report += `❌ **Component có tính nhất quán thấp (${totalScore.toFixed(2)}%)**\n\n`;
      report += `Component Tailwind CSS khác biệt đáng kể so với component Material UI. Cần xem xét lại thiết kế và triển khai của component để đảm bảo tính nhất quán.\n\n`;
    }
    
    // Các bước tiếp theo
    report += `### Các bước tiếp theo\n\n`;
    
    if (result.props.missing.length > 0) {
      report += `1. Thêm các props còn thiếu: ${result.props.missing.join(', ')}\n`;
    }
    
    if (result.jsx.missing.length > 0) {
      report += `2. Thêm các component JSX còn thiếu: ${result.jsx.missing.join(', ')}\n`;
    }
    
    if (result.hooks.missing.length > 0) {
      report += `3. Thêm các hooks còn thiếu: ${result.hooks.missing.join(', ')}\n`;
    }
    
    if (result.functions.missing.length > 0) {
      report += `4. Thêm các functions còn thiếu: ${result.functions.missing.join(', ')}\n`;
    }
    
    // Lưu báo cáo
    const reportPath = path.join(process.cwd(), 'component-detailed-report.md');
    fs.writeFileSync(reportPath, report, 'utf8');
    
    console.log(chalk.green(`Báo cáo chi tiết đã được lưu vào: ${reportPath}`));
    
    // Tạo báo cáo HTML
    const htmlReport = await generateHtmlReport(report);
    const htmlReportPath = path.join(process.cwd(), 'component-detailed-report.html');
    fs.writeFileSync(htmlReportPath, htmlReport, 'utf8');
    
    console.log(chalk.green(`Báo cáo HTML đã được lưu vào: ${htmlReportPath}`));
  } catch (error) {
    console.error(chalk.red('Lỗi khi tạo báo cáo chi tiết:'), error);
  }
}

/**
 * Tạo báo cáo HTML từ Markdown
 * @param {string} markdown - Nội dung Markdown
 * @returns {string} - Nội dung HTML
 */
async function generateHtmlReport(markdown) {
  try {
    // Sử dụng thư viện marked để chuyển đổi Markdown sang HTML
    const marked = require('marked');
    
    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Báo cáo kiểm tra tính nhất quán component</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1, h2, h3, h4 {
      color: #2c3e50;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    code {
      background-color: #f5f5f5;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: monospace;
    }
    .success {
      color: green;
    }
    .warning {
      color: orange;
    }
    .danger {
      color: red;
    }
    .summary {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 20px;
    }
    .summary-item {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      flex: 1;
      min-width: 200px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .summary-value {
      font-size: 24px;
      font-weight: bold;
      margin-top: 10px;
    }
    .progress-bar {
      height: 10px;
      background-color: #e9ecef;
      border-radius: 5px;
      margin-top: 10px;
    }
    .progress-value {
      height: 100%;
      background-color: #4caf50;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  ${marked(markdown)}
  
  <script>
    // Thêm các tính năng tương tác nếu cần
    document.addEventListener('DOMContentLoaded', function() {
      // Thêm chức năng sắp xếp bảng
      const tables = document.querySelectorAll('table');
      tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
          header.addEventListener('click', () => {
            sortTable(table, index);
          });
          header.style.cursor = 'pointer';
          header.title = 'Click để sắp xếp';
        });
      });
    });
    
    function sortTable(table, column) {
      const tbody = table.querySelector('tbody');
      if (!tbody) return;
      
      const rows = Array.from(tbody.querySelectorAll('tr'));
      
      const sortedRows = rows.sort((a, b) => {
        const aValue = a.cells[column].textContent;
        const bValue = b.cells[column].textContent;
        return aValue.localeCompare(bValue);
      });
      
      // Xóa các hàng hiện tại
      rows.forEach(row => tbody.removeChild(row));
      
      // Thêm các hàng đã sắp xếp
      sortedRows.forEach(row => tbody.appendChild(row));
    }
  </script>
</body>
</html>`;
    
    return html;
  } catch (error) {
    console.error(chalk.red('Lỗi khi tạo báo cáo HTML:'), error);
    return '';
  }
}

// Chạy hàm main khi script được thực thi trực tiếp
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Lỗi không xử lý được:'), error);
    process.exit(1);
  });
}

// Export các hàm để có thể sử dụng như một module
module.exports = {
  parseComponent,
  compareComponents,
  displayResult,
  compareFiles,
  generateDetailedReport,
  main
};
#!/usr/bin/env node

/**
 * Component Conversion CLI Tool
 * 
 * Công cụ dòng lệnh để tự động chuyển đổi component từ Material UI sang Tailwind CSS
 * Sử dụng: node component-conversion-cli.js <đường_dẫn_file_hoặc_thư_mục>
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const muiToTailwind = require('./mui-to-tailwind');
const chalk = require('chalk');
const glob = require('glob');
const inquirer = require('inquirer');

// Cấu hình
const CONFIG = {
  // Các file cần bỏ qua
  ignoreFiles: ['node_modules', 'dist', 'build', '.git'],
  // Các extension cần xử lý
  extensions: ['.js', '.jsx', '.tsx'],
  // Thư mục output mặc định
  defaultOutputDir: './converted',
  // Các component Material UI cần chuyển đổi
  materialUIComponents: [
    'Button', 'TextField', 'Checkbox', 'Radio', 'Select', 'Switch',
    'Slider', 'Card', 'CardContent', 'CardHeader', 'CardActions',
    'Typography', 'Container', 'Grid', 'Box', 'Paper', 'Divider',
    'List', 'ListItem', 'ListItemText', 'ListItemIcon', 'Avatar',
    'AppBar', 'Toolbar', 'IconButton', 'Menu', 'MenuItem', 'Dialog',
    'DialogTitle', 'DialogContent', 'DialogActions', 'Tabs', 'Tab',
    'Snackbar', 'Alert', 'CircularProgress', 'LinearProgress', 'Badge',
    'Breadcrumbs', 'Chip', 'Tooltip', 'Table', 'TableBody', 'TableCell',
    'TableContainer', 'TableHead', 'TableRow', 'Accordion', 'AccordionSummary',
    'AccordionDetails', 'Drawer', 'Fab', 'FormControl', 'FormGroup',
    'FormControlLabel', 'FormHelperText', 'InputLabel', 'Pagination',
    'Stepper', 'Step', 'StepLabel', 'MobileStepper'
  ]
};

/**
 * Kiểm tra xem file có cần xử lý không
 * @param {string} filePath - Đường dẫn file
 * @returns {boolean} - true nếu cần xử lý, false nếu không
 */
function shouldProcessFile(filePath) {
  // Kiểm tra extension
  const ext = path.extname(filePath);
  if (!CONFIG.extensions.includes(ext)) {
    return false;
  }
  
  // Kiểm tra các thư mục cần bỏ qua
  for (const ignore of CONFIG.ignoreFiles) {
    if (filePath.includes(ignore)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Kiểm tra xem file có sử dụng Material UI không
 * @param {string} content - Nội dung file
 * @returns {boolean} - true nếu sử dụng Material UI, false nếu không
 */
function usesMaterialUI(content) {
  // Kiểm tra import từ @material-ui hoặc @mui
  if (content.includes('@material-ui') || content.includes('@mui')) {
    return true;
  }
  
  // Kiểm tra các component Material UI
  for (const component of CONFIG.materialUIComponents) {
    const regex = new RegExp(`<${component}[\\s>]`, 'g');
    if (regex.test(content)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Chuyển đổi file từ Material UI sang Tailwind CSS
 * @param {string} filePath - Đường dẫn file cần chuyển đổi
 * @param {string} outputPath - Đường dẫn file output
 * @returns {Object} - Kết quả chuyển đổi
 */
function convertFile(filePath, outputPath) {
  try {
    // Đọc nội dung file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Kiểm tra xem file có sử dụng Material UI không
    if (!usesMaterialUI(content)) {
      return {
        success: true,
        skipped: true,
        message: 'File không sử dụng Material UI'
      };
    }
    
    // Parse code thành AST
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'classProperties', 'decorators-legacy']
    });
    
    // Biến để theo dõi các import cần thêm
    const importsToAdd = new Set();
    
    // Biến để theo dõi các import cần xóa
    const importsToRemove = new Set();
    
    // Traverse AST để tìm và chuyển đổi các component Material UI
    traverse(ast, {
      // Xử lý import
      ImportDeclaration(path) {
        const source = path.node.source.value;
        
        // Nếu là import từ Material UI
        if (source.includes('@material-ui') || source.includes('@mui')) {
          // Thêm vào danh sách import cần xóa
          importsToRemove.add(source);
          
          // Xử lý từng specifier
          path.node.specifiers.forEach(specifier => {
            if (t.isImportSpecifier(specifier)) {
              const importedName = specifier.imported.name;
              const localName = specifier.local.name;
              
              // Kiểm tra xem component có trong danh sách cần chuyển đổi không
              if (CONFIG.materialUIComponents.includes(importedName)) {
                // Thêm import cho component Tailwind tương ứng nếu cần
                if (muiToTailwind.needsImport(importedName)) {
                  const tailwindImport = muiToTailwind.getTailwindImport(importedName);
                  if (tailwindImport) {
                    importsToAdd.add(tailwindImport);
                  }
                }
              }
            }
          });
          
          // Xóa import Material UI
          path.remove();
        }
      },
      
      // Xử lý JSX Element
      JSXElement(path) {
        const openingElement = path.node.openingElement;
        const closingElement = path.node.closingElement;
        
        // Lấy tên component
        let componentName = '';
        if (t.isJSXIdentifier(openingElement.name)) {
          componentName = openingElement.name.name;
        } else if (t.isJSXMemberExpression(openingElement.name)) {
          componentName = openingElement.name.property.name;
        }
        
        // Kiểm tra xem component có trong danh sách cần chuyển đổi không
        if (CONFIG.materialUIComponents.includes(componentName)) {
          // Chuyển đổi component
          const result = muiToTailwind.convertComponent(
            componentName,
            openingElement.attributes,
            path.node.children
          );
          
          if (result) {
            // Cập nhật component name
            if (t.isJSXIdentifier(openingElement.name)) {
              openingElement.name.name = result.componentName;
            } else if (t.isJSXMemberExpression(openingElement.name)) {
              openingElement.name.property.name = result.componentName;
            }
            
            // Cập nhật attributes
            openingElement.attributes = result.attributes;
            
            // Cập nhật closing element nếu có
            if (closingElement) {
              if (t.isJSXIdentifier(closingElement.name)) {
                closingElement.name.name = result.componentName;
              } else if (t.isJSXMemberExpression(closingElement.name)) {
                closingElement.name.property.name = result.componentName;
              }
            }
            
            // Cập nhật children nếu cần
            if (result.children) {
              path.node.children = result.children;
            }
          }
        }
      },
      
      // Xử lý makeStyles và withStyles
      CallExpression(path) {
        const callee = path.node.callee;
        
        // Kiểm tra xem có phải l�� makeStyles hoặc withStyles không
        if (
          (t.isIdentifier(callee) && (callee.name === 'makeStyles' || callee.name === 'withStyles')) ||
          (t.isMemberExpression(callee) && t.isIdentifier(callee.property) && 
           (callee.property.name === 'makeStyles' || callee.property.name === 'withStyles'))
        ) {
          // Chuyển đổi styles
          const styles = path.node.arguments[0];
          
          if (t.isArrowFunctionExpression(styles) || t.isFunctionExpression(styles)) {
            // Chuyển đổi styles function
            const result = muiToTailwind.convertStyles(styles);
            if (result) {
              path.replaceWith(result);
            }
          } else if (t.isObjectExpression(styles)) {
            // Chuyển đổi styles object
            const result = muiToTailwind.convertStylesObject(styles);
            if (result) {
              path.replaceWith(result);
            }
          }
        }
      }
    });
    
    // Thêm các import mới
    importsToAdd.forEach(importStatement => {
      const importAst = parse(importStatement, { sourceType: 'module' }).program.body[0];
      ast.program.body.unshift(importAst);
    });
    
    // Generate code từ AST
    const output = generate(ast, {
      retainLines: true,
      comments: true
    });
    
    // Tạo thư mục output nếu chưa tồn tại
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Ghi file output
    fs.writeFileSync(outputPath, output.code);
    
    return {
      success: true,
      skipped: false,
      message: 'Chuyển đổi thành công',
      importsRemoved: Array.from(importsToRemove),
      importsAdded: Array.from(importsToAdd)
    };
  } catch (error) {
    return {
      success: false,
      skipped: false,
      message: `Lỗi: ${error.message}`,
      error
    };
  }
}

/**
 * Chuyển đổi thư mục từ Material UI sang Tailwind CSS
 * @param {string} dirPath - Đường dẫn thư mục cần chuyển đổi
 * @param {string} outputDir - Đường dẫn thư mục output
 * @returns {Array} - Kết quả chuyển đổi
 */
function convertDirectory(dirPath, outputDir) {
  // Tìm tất cả các file cần xử lý
  const files = glob.sync(`${dirPath}/**/*.*`, { nodir: true })
    .filter(file => shouldProcessFile(file));
  
  const results = [];
  
  // Chuyển đổi từng file
  for (const file of files) {
    // Tính đường dẫn output
    const relativePath = path.relative(dirPath, file);
    const outputPath = path.join(outputDir, relativePath);
    
    // Chuyển đổi file
    const result = convertFile(file, outputPath);
    
    results.push({
      file,
      outputPath,
      ...result
    });
    
    // Log kết quả
    if (result.success) {
      if (result.skipped) {
        console.log(chalk.yellow(`Bỏ qua: ${file} (${result.message})`));
      } else {
        console.log(chalk.green(`Thành công: ${file} -> ${outputPath}`));
      }
    } else {
      console.log(chalk.red(`Lỗi: ${file} (${result.message})`));
    }
  }
  
  return results;
}

/**
 * Hàm main
 */
async function main() {
  try {
    // Hiển thị banner
    console.log(chalk.blue('='.repeat(80)));
    console.log(chalk.blue('Component Conversion CLI Tool'));
    console.log(chalk.blue('Công cụ chuyển đổi component từ Material UI sang Tailwind CSS'));
    console.log(chalk.blue('='.repeat(80)));
    
    // Lấy đường dẫn từ command line
    const args = process.argv.slice(2);
    let inputPath = '';
    let outputDir = CONFIG.defaultOutputDir;
    
    if (args.length > 0) {
      inputPath = args[0];
    }
    
    if (args.length > 1) {
      outputDir = args[1];
    }
    
    // Nếu không có đường dẫn, hỏi người dùng
    if (!inputPath) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'inputPath',
          message: 'Nhập đường dẫn file hoặc thư mục cần chuyển đổi:',
          validate: input => !!input || 'Đường dẫn không được để trống'
        },
        {
          type: 'input',
          name: 'outputDir',
          message: 'Nhập đường dẫn thư mục output:',
          default: CONFIG.defaultOutputDir
        }
      ]);
      
      inputPath = answers.inputPath;
      outputDir = answers.outputDir;
    }
    
    // Kiểm tra đường dẫn
    if (!fs.existsSync(inputPath)) {
      console.log(chalk.red(`Đường dẫn không tồn tại: ${inputPath}`));
      process.exit(1);
    }
    
    // Kiểm tra xem là file hay thư mục
    const stats = fs.statSync(inputPath);
    
    if (stats.isFile()) {
      // Nếu là file
      if (!shouldProcessFile(inputPath)) {
        console.log(chalk.yellow(`Bỏ qua file: ${inputPath} (Không phải file cần xử lý)`));
        process.exit(0);
      }
      
      // Tính đường dẫn output
      const fileName = path.basename(inputPath);
      const outputPath = path.join(outputDir, fileName);
      
      // Chuyển đổi file
      const result = convertFile(inputPath, outputPath);
      
      if (result.success) {
        if (result.skipped) {
          console.log(chalk.yellow(`Bỏ qua: ${inputPath} (${result.message})`));
        } else {
          console.log(chalk.green(`Thành công: ${inputPath} -> ${outputPath}`));
          console.log(chalk.gray('Imports đã xóa:'));
          result.importsRemoved.forEach(imp => console.log(chalk.gray(`  - ${imp}`)));
          console.log(chalk.gray('Imports đã thêm:'));
          result.importsAdded.forEach(imp => console.log(chalk.gray(`  - ${imp}`)));
        }
      } else {
        console.log(chalk.red(`Lỗi: ${inputPath} (${result.message})`));
        console.error(result.error);
      }
    } else if (stats.isDirectory()) {
      // Nếu là thư mục
      console.log(chalk.blue(`Đang chuyển đổi thư mục: ${inputPath} -> ${outputDir}`));
      
      // Chuyển đổi thư mục
      const results = convertDirectory(inputPath, outputDir);
      
      // Tổng kết
      const total = results.length;
      const success = results.filter(r => r.success && !r.skipped).length;
      const skipped = results.filter(r => r.success && r.skipped).length;
      const failed = results.filter(r => !r.success).length;
      
      console.log(chalk.blue('='.repeat(80)));
      console.log(chalk.blue(`Tổng kết:`));
      console.log(chalk.blue(`- Tổng số file: ${total}`));
      console.log(chalk.green(`- Thành công: ${success}`));
      console.log(chalk.yellow(`- Bỏ qua: ${skipped}`));
      console.log(chalk.red(`- Lỗi: ${failed}`));
      console.log(chalk.blue('='.repeat(80)));
    }
  } catch (error) {
    console.error(chalk.red('Lỗi không mong muốn:'));
    console.error(error);
    process.exit(1);
  }
}

// Chạy hàm main
main();
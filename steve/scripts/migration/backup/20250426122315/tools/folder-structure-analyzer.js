/**
 * Công cụ phân tích cấu trúc thư mục
 * 
 * Công cụ này giúp phân tích và so sánh cấu trúc thư mục giữa hai giao diện User và Client
 * Sử dụng: node folder-structure-analyzer.js <đường_dẫn_user> <đường_dẫn_client>
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

// Chuyển đổi các hàm callback thành Promise
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);

// Cấu hình
const CONFIG = {
  // Các thư mục cần bỏ qua khi phân tích
  ignoreFolders: ['node_modules', '.git', 'build', 'dist', '.next', 'coverage'],
  // Các file cần bỏ qua khi phân tích
  ignoreFiles: ['.DS_Store', 'Thumbs.db', '.env'],
  // Các extension cần phân tích
  analyzeExtensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.less', '.json'],
  // Các extension cần phân tích sâu (đọc nội dung)
  deepAnalyzeExtensions: ['.js', '.jsx', '.ts', '.tsx'],
  // Các từ khóa cần tìm kiếm trong file
  keywords: {
    components: ['React.Component', 'extends Component', 'function', '=>', 'export default'],
    redux: ['createStore', 'useSelector', 'useDispatch', 'connect', 'mapStateToProps', 'mapDispatchToProps', 'combineReducers'],
    context: ['createContext', 'useContext', 'Provider', 'Consumer'],
    routing: ['Route', 'Router', 'Switch', 'useHistory', 'useLocation', 'useParams', 'useRouteMatch'],
    api: ['fetch', 'axios', 'http', '.get(', '.post(', '.put(', '.delete(', '.patch('],
    materialUI: ['makeStyles', 'withStyles', '@material-ui', 'createTheme'],
    tailwind: ['className=', 'tw-', 'tailwind']
  }
};

/**
 * Phân tích cấu trúc thư mục
 * @param {string} dir - Đường dẫn thư mục cần phân tích
 * @param {string} basePath - Đường dẫn gốc để tính đường dẫn tương đối
 * @param {number} depth - Độ sâu hiện tại (để giới hạn độ sâu phân tích)
 * @returns {Object} - Kết quả phân tích
 */
async function analyzeDirectory(dir, basePath = dir, depth = 0, maxDepth = 10) {
  if (depth > maxDepth) return { type: 'max-depth-reached' };
  
  try {
    const relativePath = path.relative(basePath, dir);
    const dirName = path.basename(dir);
    
    // Bỏ qua các thư mục trong danh sách ignore
    if (CONFIG.ignoreFolders.includes(dirName)) {
      return { type: 'ignored' };
    }
    
    const entries = await readdir(dir, { withFileTypes: true });
    const result = {
      path: relativePath || '.',
      name: dirName,
      type: 'directory',
      children: [],
      stats: {
        totalFiles: 0,
        fileTypes: {},
        componentCount: 0,
        apiCallCount: 0,
        reduxUsage: 0,
        contextUsage: 0,
        materialUIUsage: 0,
        tailwindUsage: 0
      }
    };
    
    // Phân tích từng entry trong thư mục
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subDir = await analyzeDirectory(entryPath, basePath, depth + 1, maxDepth);
        if (subDir.type !== 'ignored' && subDir.type !== 'max-depth-reached') {
          result.children.push(subDir);
          
          // Cập nhật thống kê
          result.stats.totalFiles += subDir.stats.totalFiles;
          
          // Cập nhật thống kê fileTypes
          for (const [ext, count] of Object.entries(subDir.stats.fileTypes)) {
            result.stats.fileTypes[ext] = (result.stats.fileTypes[ext] || 0) + count;
          }
          
          // Cập nhật các thống kê khác
          result.stats.componentCount += subDir.stats.componentCount;
          result.stats.apiCallCount += subDir.stats.apiCallCount;
          result.stats.reduxUsage += subDir.stats.reduxUsage;
          result.stats.contextUsage += subDir.stats.contextUsage;
          result.stats.materialUIUsage += subDir.stats.materialUIUsage;
          result.stats.tailwindUsage += subDir.stats.tailwindUsage;
        }
      } else if (entry.isFile()) {
        // Bỏ qua các file trong danh sách ignore
        if (CONFIG.ignoreFiles.includes(entry.name)) continue;
        
        const ext = path.extname(entry.name).toLowerCase();
        
        // Chỉ phân tích các file có extension trong danh sách
        if (CONFIG.analyzeExtensions.includes(ext)) {
          const fileAnalysis = await analyzeFile(entryPath, ext);
          result.children.push({
            path: path.relative(basePath, entryPath),
            name: entry.name,
            type: 'file',
            extension: ext,
            ...fileAnalysis
          });
          
          // Cập nhật thống kê
          result.stats.totalFiles++;
          result.stats.fileTypes[ext] = (result.stats.fileTypes[ext] || 0) + 1;
          
          if (fileAnalysis.isComponent) {
            result.stats.componentCount++;
          }
          
          result.stats.apiCallCount += fileAnalysis.apiCallCount || 0;
          result.stats.reduxUsage += fileAnalysis.reduxUsage ? 1 : 0;
          result.stats.contextUsage += fileAnalysis.contextUsage ? 1 : 0;
          result.stats.materialUIUsage += fileAnalysis.materialUIUsage ? 1 : 0;
          result.stats.tailwindUsage += fileAnalysis.tailwindUsage ? 1 : 0;
        }
      }
    }
    
    return result;
  } catch (error) {
    return {
      path: path.relative(basePath, dir),
      name: path.basename(dir),
      type: 'error',
      error: error.message
    };
  }
}

/**
 * Phân tích nội dung file
 * @param {string} filePath - Đường dẫn file cần phân tích
 * @param {string} extension - Phần mở rộng của file
 * @returns {Object} - Kết quả phân tích
 */
async function analyzeFile(filePath, extension) {
  const result = {
    size: 0,
    isComponent: false,
    apiCallCount: 0,
    reduxUsage: false,
    contextUsage: false,
    materialUIUsage: false,
    tailwindUsage: false
  };
  
  try {
    const stats = await stat(filePath);
    result.size = stats.size;
    
    // Chỉ phân tích sâu các file có extension trong danh sách
    if (CONFIG.deepAnalyzeExtensions.includes(extension)) {
      const content = await readFile(filePath, 'utf8');
      
      // Kiểm tra xem file có phải là component không
      for (const keyword of CONFIG.keywords.components) {
        if (content.includes(keyword)) {
          result.isComponent = true;
          break;
        }
      }
      
      // Đếm số lượng API call
      for (const keyword of CONFIG.keywords.api) {
        const matches = content.match(new RegExp(keyword, 'g'));
        if (matches) {
          result.apiCallCount += matches.length;
        }
      }
      
      // Kiểm tra sử dụng Redux
      for (const keyword of CONFIG.keywords.redux) {
        if (content.includes(keyword)) {
          result.reduxUsage = true;
          break;
        }
      }
      
      // Kiểm tra sử dụng Context API
      for (const keyword of CONFIG.keywords.context) {
        if (content.includes(keyword)) {
          result.contextUsage = true;
          break;
        }
      }
      
      // Kiểm tra sử dụng Material UI
      for (const keyword of CONFIG.keywords.materialUI) {
        if (content.includes(keyword)) {
          result.materialUIUsage = true;
          break;
        }
      }
      
      // Kiểm tra sử dụng Tailwind CSS
      for (const keyword of CONFIG.keywords.tailwind) {
        if (content.includes(keyword)) {
          result.tailwindUsage = true;
          break;
        }
      }
    }
    
    return result;
  } catch (error) {
    return {
      error: error.message
    };
  }
}

/**
 * So sánh hai cấu trúc thư m���c
 * @param {Object} userStructure - Cấu trúc thư mục User
 * @param {Object} clientStructure - Cấu trúc thư mục Client
 * @returns {Object} - Kết quả so sánh
 */
function compareStructures(userStructure, clientStructure) {
  return {
    summary: {
      user: {
        totalFiles: userStructure.stats.totalFiles,
        componentCount: userStructure.stats.componentCount,
        apiCallCount: userStructure.stats.apiCallCount,
        reduxUsage: userStructure.stats.reduxUsage,
        contextUsage: userStructure.stats.contextUsage,
        materialUIUsage: userStructure.stats.materialUIUsage,
        tailwindUsage: userStructure.stats.tailwindUsage
      },
      client: {
        totalFiles: clientStructure.stats.totalFiles,
        componentCount: clientStructure.stats.componentCount,
        apiCallCount: clientStructure.stats.apiCallCount,
        reduxUsage: clientStructure.stats.reduxUsage,
        contextUsage: clientStructure.stats.contextUsage,
        materialUIUsage: clientStructure.stats.materialUIUsage,
        tailwindUsage: clientStructure.stats.tailwindUsage
      }
    },
    fileTypes: {
      user: userStructure.stats.fileTypes,
      client: clientStructure.stats.fileTypes
    },
    // Phân tích sâu hơn có thể được thêm vào đây
  };
}

/**
 * Hàm chính đ�� chạy phân tích
 */
async function main() {
  try {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.error('Sử dụng: node folder-structure-analyzer.js <đường_dẫn_user> <đường_dẫn_client>');
      process.exit(1);
    }
    
    const userPath = args[0];
    const clientPath = args[1];
    const outputPath = args[2] || './analysis-result.json';
    
    console.log(`Đang phân tích thư mục User: ${userPath}`);
    const userStructure = await analyzeDirectory(userPath);
    
    console.log(`Đang phân tích thư mục Client: ${clientPath}`);
    const clientStructure = await analyzeDirectory(clientPath);
    
    console.log('Đang so sánh hai cấu trúc...');
    const comparison = compareStructures(userStructure, clientStructure);
    
    // Kết quả phân tích
    const result = {
      timestamp: new Date().toISOString(),
      user: userStructure,
      client: clientStructure,
      comparison
    };
    
    // Ghi kết quả ra file
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`Kết quả phân tích đã được lưu vào: ${outputPath}`);
    
    // In tóm tắt
    console.log('\n===== TÓM TẮT PHÂN TÍCH =====');
    console.log('User:');
    console.log(`- Tổng số file: ${result.comparison.summary.user.totalFiles}`);
    console.log(`- Số lượng component: ${result.comparison.summary.user.componentCount}`);
    console.log(`- Số lượng API call: ${result.comparison.summary.user.apiCallCount}`);
    console.log(`- Sử dụng Redux: ${result.comparison.summary.user.reduxUsage}`);
    console.log(`- Sử dụng Context API: ${result.comparison.summary.user.contextUsage}`);
    console.log(`- Sử dụng Material UI: ${result.comparison.summary.user.materialUIUsage}`);
    console.log(`- Sử dụng Tailwind CSS: ${result.comparison.summary.user.tailwindUsage}`);
    
    console.log('\nClient:');
    console.log(`- Tổng số file: ${result.comparison.summary.client.totalFiles}`);
    console.log(`- Số lượng component: ${result.comparison.summary.client.componentCount}`);
    console.log(`- Số lượng API call: ${result.comparison.summary.client.apiCallCount}`);
    console.log(`- Sử dụng Redux: ${result.comparison.summary.client.reduxUsage}`);
    console.log(`- Sử dụng Context API: ${result.comparison.summary.client.contextUsage}`);
    console.log(`- Sử dụng Material UI: ${result.comparison.summary.client.materialUIUsage}`);
    console.log(`- Sử dụng Tailwind CSS: ${result.comparison.summary.client.tailwindUsage}`);
    
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
}

// Chạy hàm main
main();
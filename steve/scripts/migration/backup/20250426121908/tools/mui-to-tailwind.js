/**
 * Component Conversion Tool
 * 
 * Công cụ này giúp chuyển đổi component từ Material UI sang Tailwind CSS
 * Sử dụng: node component-conversion-tool.js <đường_dẫn_component>
 */

const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

// Cấu hình
const CONFIG = {
  // Ánh xạ component từ Material UI sang Tailwind CSS
  componentMapping: {
    // Basic components
    Button: {
      import: null, // Không cần import trong Tailwind
      className: 'px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2',
      variantMapping: {
        contained: 'bg-blue-500 text-white hover:bg-blue-600',
        outlined: 'border border-blue-500 text-blue-500 hover:bg-blue-50',
        text: 'text-blue-500 hover:bg-blue-50'
      },
      colorMapping: {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-pink-500 text-white hover:bg-pink-600',
        error: 'bg-red-500 text-white hover:bg-red-600',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
        info: 'bg-blue-400 text-white hover:bg-blue-500',
        success: 'bg-green-500 text-white hover:bg-green-600'
      },
      sizeMapping: {
        small: 'px-2 py-1 text-sm',
        medium: 'px-4 py-2',
        large: 'px-6 py-3 text-lg'
      },
      propMapping: {
        disabled: 'opacity-50 cursor-not-allowed',
        fullWidth: 'w-full'
      }
    },
    TextField: {
      import: null,
      component: 'input',
      className: 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
      variantMapping: {
        outlined: 'border border-gray-300 rounded-md',
        filled: 'bg-gray-100 border-b-2 border-gray-300',
        standard: 'border-b border-gray-300'
      },
      propMapping: {
        error: 'border-red-500 focus:ring-red-500 focus:border-red-500',
        disabled: 'bg-gray-100 opacity-50 cursor-not-allowed',
        fullWidth: 'w-full',
        multiline: { component: 'textarea', className: 'resize-none' }
      }
    },
    Typography: {
      import: null,
      component: 'p',
      className: '',
      variantMapping: {
        h1: { component: 'h1', className: 'text-4xl font-bold' },
        h2: { component: 'h2', className: 'text-3xl font-bold' },
        h3: { component: 'h3', className: 'text-2xl font-bold' },
        h4: { component: 'h4', className: 'text-xl font-bold' },
        h5: { component: 'h5', className: 'text-lg font-bold' },
        h6: { component: 'h6', className: 'text-base font-bold' },
        subtitle1: { component: 'h6', className: 'text-base font-medium' },
        subtitle2: { component: 'h6', className: 'text-sm font-medium' },
        body1: { component: 'p', className: 'text-base' },
        body2: { component: 'p', className: 'text-sm' },
        caption: { component: 'span', className: 'text-xs' },
        overline: { component: 'span', className: 'text-xs uppercase tracking-wider' },
        button: { component: 'span', className: 'text-sm font-medium' }
      },
      colorMapping: {
        primary: 'text-gray-900',
        secondary: 'text-gray-600',
        error: 'text-red-500',
        warning: 'text-yellow-500',
        info: 'text-blue-500',
        success: 'text-green-500'
      },
      propMapping: {
        noWrap: 'whitespace-nowrap overflow-hidden text-ellipsis',
        paragraph: 'mb-4',
        gutterBottom: 'mb-2'
      }
    },
    Container: {
      import: null,
      className: 'container mx-auto px-4',
      propMapping: {
        maxWidth: {
          xs: 'max-w-screen-sm',
          sm: 'max-w-screen-sm',
          md: 'max-w-screen-md',
          lg: 'max-w-screen-lg',
          xl: 'max-w-screen-xl'
        },
        disableGutters: 'px-0'
      }
    },
    Grid: {
      import: null,
      className: '',
      propMapping: {
        container: 'flex flex-wrap',
        item: '',
        spacing: {
          0: 'gap-0',
          1: 'gap-1',
          2: 'gap-2',
          3: 'gap-3',
          4: 'gap-4',
          5: 'gap-5',
          6: 'gap-6',
          8: 'gap-8',
          10: 'gap-10'
        },
        direction: {
          row: 'flex-row',
          column: 'flex-col',
          'row-reverse': 'flex-row-reverse',
          'column-reverse': 'flex-col-reverse'
        },
        justifyContent: {
          'flex-start': 'justify-start',
          'flex-end': 'justify-end',
          center: 'justify-center',
          'space-between': 'justify-between',
          'space-around': 'justify-around',
          'space-evenly': 'justify-evenly'
        },
        alignItems: {
          'flex-start': 'items-start',
          'flex-end': 'items-end',
          center: 'items-center',
          baseline: 'items-baseline',
          stretch: 'items-stretch'
        },
        xs: {
          1: 'w-1/12',
          2: 'w-2/12',
          3: 'w-3/12',
          4: 'w-4/12',
          5: 'w-5/12',
          6: 'w-6/12',
          7: 'w-7/12',
          8: 'w-8/12',
          9: 'w-9/12',
          10: 'w-10/12',
          11: 'w-11/12',
          12: 'w-full',
          auto: 'w-auto',
          true: 'flex-grow'
        },
        sm: {
          1: 'sm:w-1/12',
          2: 'sm:w-2/12',
          3: 'sm:w-3/12',
          4: 'sm:w-4/12',
          5: 'sm:w-5/12',
          6: 'sm:w-6/12',
          7: 'sm:w-7/12',
          8: 'sm:w-8/12',
          9: 'sm:w-9/12',
          10: 'sm:w-10/12',
          11: 'sm:w-11/12',
          12: 'sm:w-full',
          auto: 'sm:w-auto',
          true: 'sm:flex-grow'
        },
        md: {
          1: 'md:w-1/12',
          2: 'md:w-2/12',
          3: 'md:w-3/12',
          4: 'md:w-4/12',
          5: 'md:w-5/12',
          6: 'md:w-6/12',
          7: 'md:w-7/12',
          8: 'md:w-8/12',
          9: 'md:w-9/12',
          10: 'md:w-10/12',
          11: 'md:w-11/12',
          12: 'md:w-full',
          auto: 'md:w-auto',
          true: 'md:flex-grow'
        },
        lg: {
          1: 'lg:w-1/12',
          2: 'lg:w-2/12',
          3: 'lg:w-3/12',
          4: 'lg:w-4/12',
          5: 'lg:w-5/12',
          6: 'lg:w-6/12',
          7: 'lg:w-7/12',
          8: 'lg:w-8/12',
          9: 'lg:w-9/12',
          10: 'lg:w-10/12',
          11: 'lg:w-11/12',
          12: 'lg:w-full',
          auto: 'lg:w-auto',
          true: 'lg:flex-grow'
        },
        xl: {
          1: 'xl:w-1/12',
          2: 'xl:w-2/12',
          3: 'xl:w-3/12',
          4: 'xl:w-4/12',
          5: 'xl:w-5/12',
          6: 'xl:w-6/12',
          7: 'xl:w-7/12',
          8: 'xl:w-8/12',
          9: 'xl:w-9/12',
          10: 'xl:w-10/12',
          11: 'xl:w-11/12',
          12: 'xl:w-full',
          auto: 'xl:w-auto',
          true: 'xl:flex-grow'
        }
      }
    },
    Paper: {
      import: null,
      className: 'bg-white rounded shadow',
      propMapping: {
        elevation: {
          0: 'shadow-none',
          1: 'shadow-sm',
          2: 'shadow',
          3: 'shadow-md',
          4: 'shadow-lg',
          5: 'shadow-xl',
          6: 'shadow-xl',
          7: 'shadow-xl',
          8: 'shadow-2xl',
          9: 'shadow-2xl',
          10: 'shadow-2xl',
          11: 'shadow-2xl',
          12: 'shadow-2xl',
          13: 'shadow-2xl',
          14: 'shadow-2xl',
          15: 'shadow-2xl',
          16: 'shadow-2xl',
          17: 'shadow-2xl',
          18: 'shadow-2xl',
          19: 'shadow-2xl',
          20: 'shadow-2xl',
          21: 'shadow-2xl',
          22: 'shadow-2xl',
          23: 'shadow-2xl',
          24: 'shadow-2xl'
        },
        square: 'rounded-none',
        variant: {
          outlined: 'border border-gray-300 shadow-none',
          elevation: ''
        }
      }
    },
    Card: {
      import: null,
      className: 'bg-white rounded shadow overflow-hidden',
      propMapping: {
        elevation: {
          0: 'shadow-none',
          1: 'shadow-sm',
          2: 'shadow',
          3: 'shadow-md',
          4: 'shadow-lg',
          5: 'shadow-xl'
        },
        raised: 'shadow-lg',
        variant: {
          outlined: 'border border-gray-300 shadow-none',
          elevation: ''
        }
      }
    },
    CardContent: {
      import: null,
      className: 'p-4'
    },
    CardActions: {
      import: null,
      className: 'px-4 py-2 flex items-center',
      propMapping: {
        disableSpacing: 'space-x-0',
        default: 'space-x-2'
      }
    },
    CardHeader: {
      import: null,
      className: 'px-4 py-3 border-b border-gray-200',
      component: 'div',
      implementation: `
        <div className={className}>
          {avatar && <div className="mr-3">{avatar}</div>}
          <div className="flex-1">
            {title && <div className="text-lg font-medium">{title}</div>}
            {subheader && <div className="text-sm text-gray-500">{subheader}</div>}
          </div>
          {action && <div>{action}</div>}
        </div>
      `
    },
    CardMedia: {
      import: null,
      className: 'bg-cover bg-center',
      propMapping: {
        component: {
          img: 'img',
          video: 'video',
          audio: 'audio',
          iframe: 'iframe',
          default: 'div'
        }
      },
      implementation: `
        const Component = component || 'div';
        return (
          <Component 
            className={className} 
            style={{ 
              height: height, 
              backgroundImage: image ? \`url(\${image})\` : undefined 
            }}
            src={image && Component === 'img' ? image : undefined}
            {...other}
          />
        );
      `
    },
    Divider: {
      import: null,
      className: 'border-t border-gray-200 my-2',
      propMapping: {
        orientation: {
          horizontal: '',
          vertical: 'border-t-0 border-l h-full mx-2'
        },
        variant: {
          fullWidth: 'w-full',
          inset: 'ml-16',
          middle: 'mx-4'
        },
        light: 'border-gray-100'
      }
    },
    List: {
      import: null,
      className: 'divide-y divide-gray-200',
      propMapping: {
        dense: 'space-y-1',
        disablePadding: 'p-0',
        default: 'py-2'
      }
    },
    ListItem: {
      import: null,
      className: 'flex items-center py-2 px-4',
      propMapping: {
        dense: 'py-1',
        disableGutters: 'px-0',
        divider: 'border-b border-gray-200',
        button: 'hover:bg-gray-100 cursor-pointer focus:outline-none focus:bg-gray-100',
        selected: 'bg-blue-50 text-blue-600',
        alignItems: {
          'flex-start': 'items-start',
          center: 'items-center'
        }
      }
    },
    ListItemText: {
      import: null,
      className: 'flex-1 min-w-0',
      implementation: `
        <div className={className}>
          {primary && <div className="text-sm font-medium text-gray-900 truncate">{primary}</div>}
          {secondary && <div className="text-xs text-gray-500 truncate">{secondary}</div>}
        </div>
      `
    },
    ListItemIcon: {
      import: null,
      className: 'flex-shrink-0 mr-3 text-gray-400'
    },
    ListItemSecondaryAction: {
      import: null,
      className: 'flex-shrink-0 ml-auto'
    },
    CircularProgress: {
      import: null,
      className: 'animate-spin',
      implementation: `
        const sizeClass = {
          small: 'w-4 h-4',
          medium: 'w-6 h-6',
          large: 'w-8 h-8'
        }[size || 'medium'];
        
        const colorClass = {
          primary: 'text-blue-500',
          secondary: 'text-pink-500',
          inherit: ''
        }[color || 'primary'];
        
        return (
          <svg className={\`\${className} \${sizeClass} \${colorClass}\`} viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
      `
    },
    LinearProgress: {
      import: null,
      className: 'overflow-hidden bg-blue-100 rounded-full',
      implementation: `
        const colorClass = {
          primary: 'bg-blue-500',
          secondary: 'bg-pink-500'
        }[color || 'primary'];
        
        return (
          <div className={\`\${className} h-1\`}>
            {variant === 'determinate' ? (
              <div 
                className={\`h-full \${colorClass}\`} 
                style={{ width: \`\${value}%\` }}
              />
            ) : (
              <div className={\`h-full \${colorClass} animate-pulse\`} />
            )}
          </div>
        );
      `
    },
    // Các component khác có thể được thêm vào đây
  },
  
  // Ánh xạ style từ Material UI makeStyles sang Tailwind CSS
  styleMapping: {
    // Colors
    'primary.main': 'text-blue-500',
    'primary.light': 'text-blue-400',
    'primary.dark': 'text-blue-600',
    'secondary.main': 'text-pink-500',
    'secondary.light': 'text-pink-400',
    'secondary.dark': 'text-pink-600',
    'error.main': 'text-red-500',
    'error.light': 'text-red-400',
    'error.dark': 'text-red-600',
    'warning.main': 'text-yellow-500',
    'warning.light': 'text-yellow-400',
    'warning.dark': 'text-yellow-600',
    'info.main': 'text-blue-500',
    'info.light': 'text-blue-400',
    'info.dark': 'text-blue-600',
    'success.main': 'text-green-500',
    'success.light': 'text-green-400',
    'success.dark': 'text-green-600',
    'text.primary': 'text-gray-900',
    'text.secondary': 'text-gray-600',
    'text.disabled': 'text-gray-400',
    'background.paper': 'bg-white',
    'background.default': 'bg-gray-100',
    
    // Spacing
    'theme.spacing(1)': 'p-1',
    'theme.spacing(2)': 'p-2',
    'theme.spacing(3)': 'p-3',
    'theme.spacing(4)': 'p-4',
    'theme.spacing(5)': 'p-5',
    'theme.spacing(6)': 'p-6',
    'theme.spacing(8)': 'p-8',
    'theme.spacing(10)': 'p-10',
    'theme.spacing(12)': 'p-12',
    
    // Typography
    'theme.typography.h1': 'text-4xl font-bold',
    'theme.typography.h2': 'text-3xl font-bold',
    'theme.typography.h3': 'text-2xl font-bold',
    'theme.typography.h4': 'text-xl font-bold',
    'theme.typography.h5': 'text-lg font-bold',
    'theme.typography.h6': 'text-base font-bold',
    'theme.typography.subtitle1': 'text-base font-medium',
    'theme.typography.subtitle2': 'text-sm font-medium',
    'theme.typography.body1': 'text-base',
    'theme.typography.body2': 'text-sm',
    'theme.typography.caption': 'text-xs',
    'theme.typography.overline': 'text-xs uppercase tracking-wider',
    'theme.typography.button': 'text-sm font-medium',
    
    // Breakpoints
    'theme.breakpoints.up("xs")': 'sm:',
    'theme.breakpoints.up("sm")': 'sm:',
    'theme.breakpoints.up("md")': 'md:',
    'theme.breakpoints.up("lg")': 'lg:',
    'theme.breakpoints.up("xl")': 'xl:',
    
    // Common CSS properties
    display: {
      flex: 'flex',
      block: 'block',
      'inline-block': 'inline-block',
      inline: 'inline',
      grid: 'grid',
      none: 'hidden'
    },
    flexDirection: {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse'
    },
    justifyContent: {
      'flex-start': 'justify-start',
      'flex-end': 'justify-end',
      center: 'justify-center',
      'space-between': 'justify-between',
      'space-around': 'justify-around',
      'space-evenly': 'justify-evenly'
    },
    alignItems: {
      'flex-start': 'items-start',
      'flex-end': 'items-end',
      center: 'items-center',
      baseline: 'items-baseline',
      stretch: 'items-stretch'
    },
    flexWrap: {
      wrap: 'flex-wrap',
      nowrap: 'flex-nowrap',
      'wrap-reverse': 'flex-wrap-reverse'
    },
    fontWeight: {
      300: 'font-light',
      400: 'font-normal',
      500: 'font-medium',
      600: 'font-semibold',
      700: 'font-bold'
    },
    textAlign: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify'
    },
    position: {
      relative: 'relative',
      absolute: 'absolute',
      fixed: 'fixed',
      sticky: 'sticky',
      static: 'static'
    },
    overflow: {
      auto: 'overflow-auto',
      hidden: 'overflow-hidden',
      visible: 'overflow-visible',
      scroll: 'overflow-scroll'
    },
    width: {
      '100%': 'w-full',
      auto: 'w-auto'
    },
    height: {
      '100%': 'h-full',
      auto: 'h-auto'
    }
  }
};

/**
 * Chuyển đổi component từ Material UI sang Tailwind CSS
 * @param {string} filePath - Đường dẫn đến file component
 * @returns {string} - Code đã được chuyển đổi
 */
function convertComponent(filePath) {
  try {
    // Đọc file
    const code = fs.readFileSync(filePath, 'utf8');
    
    // Parse code thành AST
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });
    
    // Các import cần thêm
    const importsToAdd = new Set();
    
    // Các import cần xóa
    const importsToRemove = new Set();
    
    // Kiểm tra xem có sử dụng makeStyles không
    let hasMakeStyles = false;
    let makeStylesIdentifier = null;
    let useStylesIdentifier = null;
    let stylesObject = null;
    
    // Tìm các import từ Material UI
    traverse(ast, {
      ImportDeclaration(path) {
        const source = path.node.source.value;
        
        // Kiểm tra import từ Material UI
        if (source.startsWith('@material-ui/')) {
          const specifiers = path.node.specifiers;
          
          specifiers.forEach(specifier => {
            if (t.isImportSpecifier(specifier)) {
              const importedName = specifier.imported.name;
              const localName = specifier.local.name;
              
              // Kiểm tra makeStyles
              if (importedName === 'makeStyles') {
                hasMakeStyles = true;
                makeStylesIdentifier = localName;
                importsToRemove.add(path);
              }
              
              // Kiểm tra các component Material UI
              if (CONFIG.componentMapping[importedName]) {
                importsToRemove.add(path);
              }
            }
          });
        }
      }
    });
    
    // Nếu có sử dụng makeStyles, tìm và chuyển đổi styles
    if (hasMakeStyles) {
      traverse(ast, {
        VariableDeclarator(path) {
          // Tìm khai báo useStyles = makeStyles(...)
          if (
            path.node.init &&
            t.isCallExpression(path.node.init) &&
            path.node.init.callee.name === makeStylesIdentifier
          ) {
            useStylesIdentifier = path.node.id.name;
            
            // Lấy styles object
            if (path.node.init.arguments.length > 0) {
              stylesObject = path.node.init.arguments[0];
            }
            
            // Xóa khai báo useStyles
            path.parentPath.remove();
          }
        }
      });
    }
    
    // Chuyển đổi các component Material UI sang Tailwind CSS
    traverse(ast, {
      JSXElement(path) {
        const openingElement = path.node.openingElement;
        const elementName = openingElement.name.name;
        
        // Kiểm tra xem có phải component Material UI không
        if (CONFIG.componentMapping[elementName]) {
          const mapping = CONFIG.componentMapping[elementName];
          
          // Lấy các props
          const props = {};
          openingElement.attributes.forEach(attr => {
            if (t.isJSXAttribute(attr) && attr.name.name !== 'className') {
              if (attr.value) {
                if (t.isStringLiteral(attr.value)) {
                  props[attr.name.name] = attr.value.value;
                } else if (t.isJSXExpressionContainer(attr.value)) {
                  props[attr.name.name] = attr.value.expression;
                }
              } else {
                props[attr.name.name] = true;
              }
            }
          });
          
          // Tìm className hiện tại
          let existingClassName = '';
          openingElement.attributes.forEach(attr => {
            if (t.isJSXAttribute(attr) && attr.name.name === 'className') {
              if (t.isStringLiteral(attr.value)) {
                existingClassName = attr.value.value;
              } else if (t.isJSXExpressionContainer(attr.value) && t.isStringLiteral(attr.value.expression)) {
                existingClassName = attr.value.expression.value;
              }
            }
          });
          
          // Tạo className mới
          let newClassName = mapping.className;
          
          // Thêm className dựa trên props
          Object.entries(props).forEach(([propName, propValue]) => {
            if (mapping.propMapping && mapping.propMapping[propName]) {
              const propMapping = mapping.propMapping[propName];
              
              if (typeof propMapping === 'string') {
                newClassName += ` ${propMapping}`;
              } else if (typeof propMapping === 'object') {
                if (propValue === true) {
                  newClassName += ` ${propMapping.default || ''}`;
                } else if (propMapping[propValue]) {
                  newClassName += ` ${propMapping[propValue]}`;
                }
              }
            }
          });
          
          // Thêm variant
          if (props.variant && mapping.variantMapping && mapping.variantMapping[props.variant]) {
            newClassName += ` ${mapping.variantMapping[props.variant]}`;
          }
          
          // Thêm color
          if (props.color && mapping.colorMapping && mapping.colorMapping[props.color]) {
            newClassName += ` ${mapping.colorMapping[props.color]}`;
          }
          
          // Thêm size
          if (props.size && mapping.sizeMapping && mapping.sizeMapping[props.size]) {
            newClassName += ` ${mapping.sizeMapping[props.size]}`;
          }
          
          // Kết hợp với className hiện tại
          if (existingClassName) {
            newClassName = `${existingClassName} ${newClassName}`;
          }
          
          // Xác định component mới
          let newElementName = mapping.component || 'div';
          
          // Nếu có component mapping dựa trên prop
          if (props.component && mapping.propMapping && mapping.propMapping.component) {
            newElementName = mapping.propMapping.component[props.component] || mapping.propMapping.component.default || props.component;
          }
          
                    // Cập nhật element name
                    openingElement.name.name = newElementName;
          
                    // Cập nhật closing element nếu có
                    if (path.node.closingElement) {
                      path.node.closingElement.name.name = newElementName;
                    }
                    
                    // Xóa tất cả các props hiện tại
                    openingElement.attributes = [];
                    
                    // Thêm className mới
                    openingElement.attributes.push(
                      t.jsxAttribute(
                        t.jsxIdentifier('className'),
                        t.stringLiteral(newClassName.trim())
                      )
                    );
                    
                    // Thêm lại các props khác (trừ những props đặc biệt của Material UI)
                    Object.entries(props).forEach(([propName, propValue]) => {
                      // Bỏ qua các props đặc biệt của Material UI
                      if (['variant', 'color', 'size', 'component'].includes(propName)) {
                        return;
                      }
                      
                      // Thêm lại prop
                      if (propValue === true) {
                        openingElement.attributes.push(
                          t.jsxAttribute(
                            t.jsxIdentifier(propName)
                          )
                        );
                      } else if (typeof propValue === 'string') {
                        openingElement.attributes.push(
                          t.jsxAttribute(
                            t.jsxIdentifier(propName),
                            t.stringLiteral(propValue)
                          )
                        );
                      } else {
                        openingElement.attributes.push(
                          t.jsxAttribute(
                            t.jsxIdentifier(propName),
                            t.jsxExpressionContainer(propValue)
                          )
                        );
                      }
                    });
                    
                    // Nếu component có implementation tùy chỉnh, thay thế bằng implementation đó
                    if (mapping.implementation) {
                      // TODO: Implement custom component implementation
                      console.log(`Component ${elementName} có implementation tùy chỉnh, cần xử lý thủ công.`);
                    }
                  }
                }
              });
              
              // Chuyển đổi các class styles từ makeStyles sang Tailwind CSS
              if (hasMakeStyles && stylesObject && useStylesIdentifier) {
                traverse(ast, {
                  MemberExpression(path) {
                    // Tìm các biểu thức dạng classes.root, classes.button, ...
                    if (
                      path.node.object.name === 'classes' &&
                      t.isIdentifier(path.node.property)
                    ) {
                      const className = path.node.property.name;
                      
                      // Tìm định nghĩa của class này trong stylesObject
                      if (t.isObjectExpression(stylesObject)) {
                        const classProperty = stylesObject.properties.find(
                          prop => t.isObjectProperty(prop) && prop.key.name === className
                        );
                        
                        if (classProperty) {
                          // TODO: Chuyển đổi style object sang Tailwind classes
                          console.log(`Cần chuyển đổi style cho class ${className}`);
                        }
                      }
                    }
                  },
                  
                  VariableDeclarator(path) {
                    // Tìm khai báo const classes = useStyles()
                    if (
                      path.node.init &&
                      t.isCallExpression(path.node.init) &&
                      path.node.init.callee.name === useStylesIdentifier
                    ) {
                      // Xóa khai báo classes
                      path.parentPath.remove();
                    }
                  }
                });
              }
              
              // Xóa các import từ Material UI
              importsToRemove.forEach(path => {
                path.remove();
              });
              
              // Thêm các import mới nếu cần
              if (importsToAdd.size > 0) {
                const program = ast.program;
                const body = program.body;
                
                // Thêm vào đầu file
                importsToAdd.forEach(importStatement => {
                  body.unshift(importStatement);
                });
              }
              
              // Generate code từ AST
              const output = generate(ast, {
                retainLines: true,
                compact: false
              });
              
              return output.code;
            } catch (error) {
              console.error(`Lỗi khi chuyển đổi component ${filePath}:`, error);
              return null;
            }
          }
          
          /**
           * Chuyển đổi style object từ Material UI sang Tailwind CSS
           * @param {Object} styleObj - Style object từ Material UI
           * @returns {string} - Tailwind CSS classes
           */
          function convertStyleToTailwind(styleObj) {
            let tailwindClasses = [];
            
            // Duyệt qua các thuộc tính của style object
            Object.entries(styleObj).forEach(([property, value]) => {
              // Kiểm tra xem có mapping cho thuộc tính này không
              if (CONFIG.styleMapping[property]) {
                const mapping = CONFIG.styleMapping[property];
                
                if (typeof mapping === 'string') {
                  tailwindClasses.push(mapping);
                } else if (typeof mapping === 'object' && mapping[value]) {
                  tailwindClasses.push(mapping[value]);
                }
              } else if (property.startsWith('&:')) {
                // Xử lý pseudo-classes
                const pseudoClass = property.substring(2);
                
                // TODO: Xử lý các pseudo-classes
                console.log(`Cần xử lý pseudo-class ${pseudoClass}`);
              } else if (property.startsWith('@media')) {
                // Xử lý media queries
                // TODO: Xử lý media queries
                console.log(`Cần xử lý media query ${property}`);
              } else {
                // Xử lý các thuộc tính CSS thông thường
                // TODO: Ánh xạ các thuộc tính CSS thông thường sang Tailwind
                console.log(`Cần ánh xạ thuộc tính CSS ${property}: ${value}`);
              }
            });
            
            return tailwindClasses.join(' ');
          }
          
          /**
           * Tìm tất cả các file component trong thư mục
           * @param {string} directory - Thư mục cần tìm
           * @param {Array} extensions - Các phần mở rộng cần tìm
           * @returns {Array} - Danh sách đường dẫn file
           */
          function findComponentFiles(directory, extensions = ['.js', '.jsx', '.tsx']) {
            const files = [];
            
            function traverseDirectory(dir) {
              const entries = fs.readdirSync(dir, { withFileTypes: true });
              
              for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory()) {
                  traverseDirectory(fullPath);
                } else if (entry.isFile()) {
                  const ext = path.extname(entry.name);
                  
                  if (extensions.includes(ext)) {
                    files.push(fullPath);
                  }
                }
              }
            }
            
            traverseDirectory(directory);
            
            return files;
          }
          
          /**
           * Tạo báo cáo chuyển đổi
           * @param {Array} results - Kết quả chuyển đổi
           * @returns {string} - Báo cáo dạng Markdown
           */
          function generateReport(results) {
            let report = '# Báo cáo chuyển đổi component từ Material UI sang Tailwind CSS\n\n';
            
            report += '## Tổng quan\n\n';
            report += `- Tổng số file: ${results.length}\n`;
            report += `- Số file chuyển đổi thành công: ${results.filter(r => r.success).length}\n`;
            report += `- Số file chuyển đổi thất bại: ${results.filter(r => !r.success).length}\n\n`;
            
            report += '## Chi tiết\n\n';
            report += '| File | Trạng thái | Ghi chú |\n';
            report += '|------|------------|--------|\n';
            
            results.forEach(result => {
              const status = result.success ? '✅ Thành công' : '❌ Thất bại';
              const notes = result.notes || '';
              
              report += `| ${result.file} | ${status} | ${notes} |\n`;
            });
            
            return report;
          }
          
          /**
           * Hàm chính
           */
          async function main() {
            try {
              const args = process.argv.slice(2);
              
              if (args.length === 0) {
                console.error('Sử dụng: node component-conversion-tool.js <đường_dẫn_component>');
                process.exit(1);
              }
              
              const inputPath = args[0];
              const stats = fs.statSync(inputPath);
              
              let files = [];
              
              if (stats.isDirectory()) {
                console.log(`Đang tìm các file component trong thư mục ${inputPath}...`);
                files = findComponentFiles(inputPath);
                console.log(`Tìm thấy ${files.length} file component.`);
              } else {
                files = [inputPath];
              }
              
              const results = [];
              
              for (const file of files) {
                console.log(`Đang chuyển đổi file ${file}...`);
                
                try {
                  const convertedCode = convertComponent(file);
                  
                  if (convertedCode) {
                    // Tạo tên file output
                    const dir = path.dirname(file);
                    const ext = path.extname(file);
                    const basename = path.basename(file, ext);
                    const outputFile = path.join(dir, `${basename}.tailwind${ext}`);
                    
                    // Ghi file output
                    fs.writeFileSync(outputFile, convertedCode, 'utf8');
                    
                    console.log(`Đã chuyển đổi thành công và lưu vào ${outputFile}`);
                    
                    results.push({
                      file,
                      success: true,
                      outputFile
                    });
                  } else {
                    console.error(`Không thể chuyển đổi file ${file}`);
                    
                    results.push({
                      file,
                      success: false,
                      notes: 'Lỗi khi chuyển đổi'
                    });
                  }
                } catch (error) {
                  console.error(`Lỗi khi xử lý file ${file}:`, error);
                  
                  results.push({
                    file,
                    success: false,
                    notes: error.message
                  });
                }
              }
              
              // Tạo báo cáo
              const report = generateReport(results);
              const reportFile = path.join(process.cwd(), 'conversion-report.md');
              
              fs.writeFileSync(reportFile, report, 'utf8');
              
              console.log(`Đã tạo báo cáo chuyển đổi: ${reportFile}`);
              
              // Tóm tắt
              console.log('\n===== TÓM TẮT =====');
              console.log(`Tổng số file: ${results.length}`);
              console.log(`Số file chuyển đổi thành công: ${results.filter(r => r.success).length}`);
              console.log(`Số file chuyển đổi thất bại: ${results.filter(r => !r.success).length}`);
            } catch (error) {
              console.error('Lỗi:', error);
              process.exit(1);
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
            convertComponent,
            convertStyleToTailwind,
            findComponentFiles,
            generateReport
          };
# Hướng dẫn Migration từ Material UI sang Tailwind CSS

Tài liệu này cung cấp hướng dẫn chi tiết để chuyển đổi ứng dụng React từ Material UI sang Tailwind CSS trong dự án RunOut. Hướng dẫn này là một phần của quá trình đồng bộ hóa giữa giao diện User (cũ) và Client (mới).

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Chuẩn bị](#2-chuẩn-bị)
3. [Chiến lược chuyển đổi](#3-chiến-lược-chuyển-đổi)
4. [Chuyển đổi component](#4-chuyển-đổi-component)
5. [Chuyển đổi styling](#5-chuyển-đổi-styling)
6. [Chuyển đổi layout](#6-chuyển-đổi-layout)
7. [Chuyển đổi theme](#7-chuyển-đổi-theme)
8. [Chuyển đổi responsive design](#8-chuyển-đổi-responsive-design)
9. [Chuyển đổi animation](#9-chuyển-đổi-animation)
10. [Kiểm thử và debugging](#10-kiểm-thử-và-debugging)
11. [Tối ưu hóa](#11-tối-ưu-hóa)
12. [Các vấn đề thường gặp](#12-các-vấn-đề-thường-gặp)
13. [Tài liệu tham khảo](#13-tài-liệu-tham-khảo)

## 1. Giới thiệu

### 1.1 Mục đích

Tài liệu này nhằm hướng dẫn việc chuyển đổi từ Material UI sang Tailwind CSS trong dự án RunOut. Quá trình chuyển đổi này là một phần của chiến lược đồng bộ hóa giữa giao diện User (sử dụng Material UI) và Client (sử dụng Tailwind CSS).

### 1.2 Lợi ích của việc chuyển đổi

- **Tính nhất quán**: Đảm bảo trải nghiệm người dùng nhất quán giữa các giao diện
- **Hiệu suất**: Tailwind CSS có kích thước nhỏ hơn và hiệu suất tốt hơn Material UI
- **Tùy biến**: Dễ dàng tùy chỉnh design system theo yêu cầu cụ thể của dự án
- **Bảo trì**: Giảm thiểu code trùng lặp và dễ dàng bảo trì

### 1.3 Thách thức

- **Khác biệt về API**: Material UI và Tailwind CSS có API và cách tiếp cận khác nhau
- **Học tập**: Cần thời gian để làm quen với Tailwind CSS nếu đã quen với Material UI
- **Refactoring**: Cần refactor nhiều component và code

## 2. Chuẩn bị

### 2.1 Cài đặt Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2.2 Cấu hình Tailwind CSS

Tạo file `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4dabf5',
          main: '#2196f3',
          dark: '#1769aa',
          contrastText: '#ffffff'
        },
        secondary: {
          light: '#f73378',
          main: '#f50057',
          dark: '#ab003c',
          contrastText: '#ffffff'
        },
        // Thêm các màu khác từ theme Material UI
      },
      // Mở rộng các cấu hình khác
    },
  },
  plugins: [],
}
```

### 2.3 Cài đặt công cụ chuyển đổi

```bash
npm install -D mui-to-tailwind
```

### 2.4 Cài đặt các adapter

```bash
npm install --save @runout/adapters
```

## 3. Chiến lược chuyển đổi

### 3.1 Tiếp cận từng bước

1. **Phân tích**: Phân tích component và xác định độ phức tạp
2. **Ưu tiên**: Ưu tiên các component đơn giản và được sử dụng nhiều
3. **Chuyển đổi**: Chuyển đổi từng component một
4. **Kiểm thử**: Kiểm thử kỹ lưỡng sau mỗi lần chuyển đổi
5. **Tích hợp**: Tích hợp component đã chuyển đổi vào ứng dụng

### 3.2 Sử dụng các adapter

Sử dụng các adapter đã được tạo để đảm bảo tính nhất quán:

- **Theme Adapter**: Đồng bộ hóa theme giữa Material UI và Tailwind CSS
- **Form Adapter**: Đồng bộ hóa xử lý form
- **Component Adapter**: Đồng bộ hóa các component phổ biến

### 3.3 Sử dụng công cụ chuyển đổi tự động

Sử dụng công cụ `component-conversion-cli.js` để tự động chuyển đổi component:

```bash
node tools/component-conversion-cli.js src/components/Button.jsx
```

## 4. Chuyển đổi component

### 4.1 Button

#### Material UI

```jsx
import Button from '@material-ui/core/Button';

function MyButton() {
  return (
    <Button 
      variant="contained" 
      color="primary" 
      size="large" 
      startIcon={<SaveIcon />}
    >
      Save
    </Button>
  );
}
```

#### Tailwind CSS

```jsx
import { Button } from '@/components/ui';

function MyButton() {
  return (
    <Button 
      variant="primary" 
      size="lg" 
      icon={<SaveIcon />}
    >
      Save
    </Button>
  );
}
```

### 4.2 TextField

#### Material UI

```jsx
import TextField from '@material-ui/core/TextField';

function MyTextField() {
  return (
    <TextField
      label="Email"
      variant="outlined"
      fullWidth
      error={!!error}
      helperText={error ? error.message : ''}
    />
  );
}
```

#### Tailwind CSS

```jsx
import { TextField } from '@/components/ui';

function MyTextField() {
  return (
    <TextField
      label="Email"
      variant="outlined"
      fullWidth
      error={!!error}
      helperText={error ? error.message : ''}
    />
  );
}
```

### 4.3 Card

#### Material UI

```jsx
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';

function MyCard() {
  return (
    <Card>
      <CardHeader title="Card Title" subheader="Card Subtitle" />
      <CardContent>
        <Typography>Card content goes here</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Action 1</Button>
        <Button size="small">Action 2</Button>
      </CardActions>
    </Card>
  );
}
```

#### Tailwind CSS

```jsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui';

function MyCard() {
  return (
    <Card>
      <CardHeader title="Card Title" subtitle="Card Subtitle" />
      <CardContent>
        <p className="text-gray-700">Card content goes here</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Action 1</Button>
        <Button size="sm">Action 2</Button>
      </CardFooter>
    </Card>
  );
}
```

## 5. Chuyển đổi styling

### 5.1 makeStyles

#### Material UI

```jsx
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
}));

function MyComponent() {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <h1 className={classes.title}>Title</h1>
    </div>
  );
}
```

#### Tailwind CSS

```jsx
import { makeStyles } from '@/services/themeAdapter';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
}));

function MyComponent() {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <h1 className={classes.title}>Title</h1>
    </div>
  );
}
```

Hoặc sử dụng Tailwind CSS trực tiếp:

```jsx
function MyComponent() {
  return (
    <div className="flex p-4 bg-white">
      <h1 className="text-blue-500 mb-4">Title</h1>
    </div>
  );
}
```

### 5.2 withStyles

#### Material UI

```jsx
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    display: 'flex',
    padding: theme.spacing(2),
  },
  title: {
    color: theme.palette.primary.main,
  },
});

class MyComponent extends React.Component {
  render() {
    const { classes } = this.props;
    
    return (
      <div className={classes.root}>
        <h1 className={classes.title}>Title</h1>
      </div>
    );
  }
}

export default withStyles(styles)(MyComponent);
```

#### Tailwind CSS

```jsx
function MyComponent() {
  return (
    <div className="flex p-4">
      <h1 className="text-blue-500">Title</h1>
    </div>
  );
}

export default MyComponent;
```

### 5.3 Inline styles

#### Material UI

```jsx
function MyComponent() {
  return (
    <div style={{ display: 'flex', padding: '16px' }}>
      <h1 style={{ color: '#2196f3' }}>Title</h1>
    </div>
  );
}
```

#### Tailwind CSS

```jsx
function MyComponent() {
  return (
    <div className="flex p-4">
      <h1 className="text-blue-500">Title</h1>
    </div>
  );
}
```

## 6. Chuyển đổi layout

### 6.1 Grid

#### Material UI

```jsx
import Grid from '@material-ui/core/Grid';

function MyLayout() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <div>Column 1</div>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <div>Column 2</div>
      </Grid>
      <Grid item xs={12} sm={12} md={4}>
        <div>Column 3</div>
      </Grid>
    </Grid>
  );
}
```

#### Tailwind CSS

```jsx
function MyLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div>Column 1</div>
      <div>Column 2</div>
      <div className="sm:col-span-2 md:col-span-1">Column 3</div>
    </div>
  );
}
```

### 6.2 Container

#### Material UI

```jsx
import Container from '@material-ui/core/Container';

function MyContainer() {
  return (
    <Container maxWidth="md">
      <div>Content</div>
    </Container>
  );
}
```

#### Tailwind CSS

```jsx
function MyContainer() {
  return (
    <div className="container mx-auto max-w-3xl px-4">
      <div>Content</div>
    </div>
  );
}
```

### 6.3 Box

#### Material UI

```jsx
import Box from '@material-ui/core/Box';

function MyBox() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      p={2}
      m={1}
      bgcolor="background.paper"
    >
      <div>Item 1</div>
      <div>Item 2</div>
    </Box>
  );
}
```

#### Tailwind CSS

```jsx
function MyBox() {
  return (
    <div className="flex flex-col p-4 m-2 bg-white">
      <div>Item 1</div>
      <div>Item 2</div>
    </div>
  );
}
```

## 7. Chuyển đổi theme

### 7.1 Theme Provider

#### Material UI

```jsx
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MyComponent />
    </ThemeProvider>
  );
}
```

#### Tailwind CSS

```jsx
import { ThemeProvider } from '@/services/themeAdapter';

function App() {
  return (
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
}
```

### 7.2 Sử dụng theme

#### Material UI

```jsx
import { useTheme } from '@material-ui/core/styles';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <div style={{ color: theme.palette.primary.main }}>
      Themed text
    </div>
  );
}
```

#### Tailwind CSS

```jsx
import { useTheme } from '@/services/themeAdapter';

function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <div className="text-blue-500">
      Themed text
    </div>
  );
}
```

## 8. Chuyển đổi responsive design

### 8.1 Hidden component

#### Material UI

```jsx
import Hidden from '@material-ui/core/Hidden';

function MyResponsiveComponent() {
  return (
    <div>
      <Hidden xsDown>
        <div>Visible on sm and up</div>
      </Hidden>
      <Hidden smUp>
        <div>Visible on xs only</div>
      </Hidden>
    </div>
  );
}
```

#### Tailwind CSS

```jsx
function MyResponsiveComponent() {
  return (
    <div>
      <div className="hidden sm:block">
        Visible on sm and up
      </div>
      <div className="sm:hidden">
        Visible on xs only
      </div>
    </div>
  );
}
```

### 8.2 Responsive props

#### Material UI

```jsx
import Typography from '@material-ui/core/Typography';

function MyResponsiveText() {
  return (
    <Typography
      variant="h4"
      component="h1"
    >
      Responsive Text
    </Typography>
  );
}
```

#### Tailwind CSS

```jsx
function MyResponsiveText() {
  return (
    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
      Responsive Text
    </h1>
  );
}
```

## 9. Chuyển đổi animation

### 9.1 Transitions

#### Material UI

```jsx
import { Fade, Grow, Slide, Zoom } from '@material-ui/core';

function MyTransition() {
  return (
    <Fade in={open} timeout={500}>
      <div>Fade transition</div>
    </Fade>
  );
}
```

#### Tailwind CSS

```jsx
import { Transition } from '@headlessui/react';

function MyTransition() {
  return (
    <Transition
      show={open}
      enter="transition-opacity duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-500"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div>Fade transition</div>
    </Transition>
  );
}
```

### 9.2 Collapse

#### Material UI

```jsx
import Collapse from '@material-ui/core/Collapse';

function MyCollapse() {
  return (
    <Collapse in={open} timeout={500}>
      <div>Collapsible content</div>
    </Collapse>
  );
}
```

#### Tailwind CSS

```jsx
import { Transition } from '@headlessui/react';

function MyCollapse() {
  return (
    <Transition
      show={open}
      enter="transition-all duration-500"
      enterFrom="max-h-0 overflow-hidden"
      enterTo="max-h-96 overflow-hidden"
      leave="transition-all duration-500"
      leaveFrom="max-h-96 overflow-hidden"
      leaveTo="max-h-0 overflow-hidden"
    >
      <div>Collapsible content</div>
    </Transition>
  );
}
```

## 10. Kiểm thử và debugging

### 10.1 Kiểm thử visual

- Sử dụng Storybook để kiểm thử visual của component
- So sánh component Material UI và Tailwind CSS để đảm bảo tính nhất quán
- Kiểm tra trên các kích thước màn hình khác nhau

### 10.2 Kiểm thử functional

- Viết unit tests cho component đã chuyển đổi
- Đảm bảo behavior của component không thay đổi
- Kiểm tra các edge cases

### 10.3 Debugging

- Sử dụng React DevTools để debug component
- Kiểm tra các class Tailwind CSS được áp dụng
- Sử dụng browser inspector ��ể debug styling

## 11. Tối ưu hóa

### 11.1 Purge CSS

Cấu hình PurgeCSS trong `tailwind.config.js` để loại bỏ các class không sử dụng:

```javascript
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  // ...
}
```

### 11.2 Sử dụng @apply

Sử dụng directive `@apply` để tái sử dụng các class Tailwind CSS:

```css
/* styles.css */
.btn-primary {
  @apply bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600;
}
```

### 11.3 Tạo component tái sử dụng

Tạo các component tái sử dụng để đảm bảo tính nhất quán:

```jsx
function Button({ variant = 'primary', size = 'md', children, ...props }) {
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  
  const sizes = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  return (
    <button
      className={`rounded focus:outline-none focus:ring-2 ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

## 12. Các vấn đề thường gặp

### 12.1 Spacing

Material UI sử dụng hệ thống spacing dựa trên theme, trong khi Tailwind CSS sử dụng các class như `p-4`, `m-2`. Sử dụng Theme Adapter để chuyển đổi:

```jsx
// Material UI
<Box p={2} m={1}>Content</Box>

// Tailwind CSS
<div className="p-4 m-2">Content</div>
```

### 12.2 Colors

Material UI sử dụng hệ thống màu dựa trên theme, trong khi Tailwind CSS sử dụng các class như `text-blue-500`, `bg-red-600`. Sử dụng Theme Adapter để chuyển đổi:

```jsx
// Material UI
<Typography color="primary">Text</Typography>

// Tailwind CSS
<p className="text-blue-500">Text</p>
```

### 12.3 Typography

Material UI sử dụng component Typography với các variant, trong khi Tailwind CSS sử dụng các class như `text-xl`, `font-bold`. Sử dụng Theme Adapter để chuyển đổi:

```jsx
// Material UI
<Typography variant="h4" gutterBottom>Heading</Typography>

// Tailwind CSS
<h2 className="text-2xl font-bold mb-4">Heading</h2>
```

## 13. Tài liệu tham khảo

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Material UI Documentation](https://material-ui.com/getting-started/installation/)
- [Headless UI](https://headlessui.dev/)
- [Tailwind UI](https://tailwindui.com/)
- [Tailwind CSS Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Material UI to Tailwind CSS Converter](https://mui-to-tailwind.vercel.app/)
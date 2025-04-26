import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import InputBase from '@material-ui/core/InputBase';

// Icons
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FavoriteIcon from '@material-ui/icons/Favorite';
import HomeIcon from '@material-ui/icons/Home';
import CategoryIcon from '@material-ui/icons/Category';
import InfoIcon from '@material-ui/icons/Info';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

// Hooks
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 2),
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
  },
  logo: {
    marginRight: theme.spacing(1),
    height: 40,
  },
  title: {
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.2rem',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[100],
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  navLinks: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  navLink: {
    margin: theme.spacing(0, 1),
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
  },
  iconButton: {
    margin: theme.spacing(0, 0.5),
  },
  drawer: {
    width: 250,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  drawerLogo: {
    height: 40,
    marginRight: theme.spacing(1),
  },
  userInfo: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[100],
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  userName: {
    fontWeight: 600,
  },
  userEmail: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
}));

const Header = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };
  
  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };
  
  const menuId = 'primary-account-menu';
  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuItem onClick={() => { navigate('/account/profile'); handleProfileMenuClose(); }}>
        Tài khoản của tôi
      </MenuItem>
      <MenuItem onClick={() => { navigate('/account/orders'); handleProfileMenuClose(); }}>
        Đơn hàng của tôi
      </MenuItem>
      <MenuItem onClick={() => { navigate('/account/wishlist'); handleProfileMenuClose(); }}>
        Danh sách yêu thích
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        Đăng xuất
      </MenuItem>
    </Menu>
  );
  
  const navigationLinks = [
    { text: 'Trang chủ', path: '/', icon: <HomeIcon /> },
    { text: 'Sản phẩm', path: '/products', icon: <CategoryIcon /> },
    { text: 'Giới thiệu', path: '/about', icon: <InfoIcon /> },
    { text: 'Liên hệ', path: '/contact', icon: <ContactMailIcon /> },
  ];
  
  const drawer = (
    <div className={classes.drawer}>
      <div className={classes.drawerHeader}>
        <img src="/logo.png" alt="Logo" className={classes.drawerLogo} />
        <Typography variant="h6">RunOut</Typography>
      </div>
      
      {isAuthenticated && user && (
        <div className={classes.userInfo}>
          <AccountCircleIcon className={classes.avatar} />
          <div>
            <Typography className={classes.userName}>{user.name}</Typography>
            <Typography className={classes.userEmail}>{user.email}</Typography>
          </div>
        </div>
      )}
      
      <List>
        {navigationLinks.map((link) => (
          <ListItem
            button
            key={link.text}
            component={Link}
            to={link.path}
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>{link.icon}</ListItemIcon>
            <ListItemText primary={link.text} />
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List>
        {isAuthenticated ? (
          <>
            <ListItem
              button
              component={Link}
              to="/account/profile"
              onClick={handleDrawerToggle}
            >
              <ListItemIcon><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Tài khoản của tôi" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/account/orders"
              onClick={handleDrawerToggle}
            >
              <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
              <ListItemText primary="Đơn hàng của tôi" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/account/wishlist"
              onClick={handleDrawerToggle}
            >
              <ListItemIcon><FavoriteIcon /></ListItemIcon>
              <ListItemText primary="Danh sách yêu thích" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Đăng xuất" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem
              button
              component={Link}
              to="/auth/login"
              onClick={handleDrawerToggle}
            >
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Đăng nhập" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/auth/register"
              onClick={handleDrawerToggle}
            >
              <ListItemIcon><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Đăng ký" />
            </ListItem>
          </>
        )}
      </List>
    </div>
  );
  
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          
          <Link to="/" className={classes.logoContainer}>
            <img src="/logo.png" alt="Logo" className={classes.logo} />
            <Typography variant="h6" className={classes.title}>
              RunOut
            </Typography>
          </Link>
          
          <div className={classes.navLinks}>
            {navigationLinks.map((link) => (
              <Button
                key={link.text}
                component={Link}
                to={link.path}
                className={classes.navLink}
              >
                {link.text}
              </Button>
            ))}
          </div>
          
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <form onSubmit={handleSearchSubmit}>
              <InputBase
                placeholder="Tìm kiếm..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                value={searchQuery}
                onChange={handleSearchChange}
                inputProps={{ 'aria-label': 'search' }}
              />
            </form>
          </div>
          
          <div className={classes.actions}>
            <IconButton
              className={classes.iconButton}
              color="inherit"
              component={Link}
              to="/cart"
            >
              <Badge badgeContent={totalItems} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            
            {isAuthenticated ? (
              <IconButton
                className={classes.iconButton}
                edge="end"
                aria-label="account"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircleIcon />
              </IconButton>
            ) : (
              <Button
                color="primary"
                variant="outlined"
                component={Link}
                to="/auth/login"
              >
                Đăng nhập
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      
      {renderProfileMenu}
      
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
    </div>
  );
};

export default Header;
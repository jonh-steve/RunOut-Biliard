import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiButton from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 4,
    padding: '8px 16px',
    fontWeight: 600,
    textTransform: 'none',
  },
  primary: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  secondary: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  outlined: {
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  text: {
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  small: {
    padding: '4px 8px',
    fontSize: '0.875rem',
  },
  medium: {
    padding: '8px 16px',
    fontSize: '1rem',
  },
  large: {
    padding: '12px 24px',
    fontSize: '1.125rem',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
}));

/**
 * Button component
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, outlined, text)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {Object} props.rest - Additional props
 * @returns {React.ReactElement} Button component
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  ...rest
}) => {
  const classes = useStyles();

  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return classes.primary;
      case 'secondary':
        return classes.secondary;
      case 'outlined':
        return classes.outlined;
      case 'text':
        return classes.text;
      default:
        return classes.primary;
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return classes.small;
      case 'medium':
        return classes.medium;
      case 'large':
        return classes.large;
      default:
        return classes.medium;
    }
  };

  return (
    <MuiButton
      className={`${classes.root} ${getVariantClass()} ${getSizeClass()} ${
        fullWidth ? classes.fullWidth : ''
      } ${disabled ? classes.disabled : ''}`}
      disabled={disabled}
      onClick={onClick}
      fullWidth={fullWidth}
      {...rest}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
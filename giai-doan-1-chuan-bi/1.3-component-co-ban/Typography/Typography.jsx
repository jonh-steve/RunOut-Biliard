import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiTypography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
  noMargin: {
    margin: 0,
  },
  gutterBottom: {
    marginBottom: theme.spacing(2),
  },
  alignLeft: {
    textAlign: 'left',
  },
  alignCenter: {
    textAlign: 'center',
  },
  alignRight: {
    textAlign: 'right',
  },
  alignJustify: {
    textAlign: 'justify',
  },
  noWrap: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  lowercase: {
    textTransform: 'lowercase',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  primary: {
    color: theme.palette.primary.main,
  },
  secondary: {
    color: theme.palette.secondary.main,
  },
  textPrimary: {
    color: theme.palette.text.primary,
  },
  textSecondary: {
    color: theme.palette.text.secondary,
  },
  error: {
    color: theme.palette.error.main,
  },
  light: {
    fontWeight: 300,
  },
  regular: {
    fontWeight: 400,
  },
  medium: {
    fontWeight: 500,
  },
  bold: {
    fontWeight: 700,
  },
}));

/**
 * Typography component
 * @param {Object} props - Component props
 * @param {string} props.variant - Typography variant (h1, h2, h3, h4, h5, h6, subtitle1, subtitle2, body1, body2, caption, overline)
 * @param {string} props.component - HTML element to render
 * @param {string} props.align - Text alignment (left, center, right, justify)
 * @param {string} props.color - Text color (primary, secondary, textPrimary, textSecondary, error)
 * @param {string} props.weight - Font weight (light, regular, medium, bold)
 * @param {string} props.transform - Text transform (uppercase, lowercase, capitalize)
 * @param {boolean} props.noWrap - Whether text should be wrapped
 * @param {boolean} props.gutterBottom - Whether text should have bottom margin
 * @param {boolean} props.noMargin - Whether text should have no margin
 * @param {React.ReactNode} props.children - Typography content
 * @param {Object} props.rest - Additional props
 * @returns {React.ReactElement} Typography component
 */
const Typography = ({
  variant = 'body1',
  component,
  align = 'left',
  color,
  weight,
  transform,
  noWrap = false,
  gutterBottom = false,
  noMargin = false,
  children,
  ...rest
}) => {
  const classes = useStyles();

  const getAlignClass = () => {
    switch (align) {
      case 'center':
        return classes.alignCenter;
      case 'right':
        return classes.alignRight;
      case 'justify':
        return classes.alignJustify;
      default:
        return classes.alignLeft;
    }
  };

  const getColorClass = () => {
    if (!color) return '';
    
    switch (color) {
      case 'primary':
        return classes.primary;
      case 'secondary':
        return classes.secondary;
      case 'textPrimary':
        return classes.textPrimary;
      case 'textSecondary':
        return classes.textSecondary;
      case 'error':
        return classes.error;
      default:
        return '';
    }
  };

  const getWeightClass = () => {
    if (!weight) return '';
    
    switch (weight) {
      case 'light':
        return classes.light;
      case 'regular':
        return classes.regular;
      case 'medium':
        return classes.medium;
      case 'bold':
        return classes.bold;
      default:
        return '';
    }
  };

  const getTransformClass = () => {
    if (!transform) return '';
    
    switch (transform) {
      case 'uppercase':
        return classes.uppercase;
      case 'lowercase':
        return classes.lowercase;
      case 'capitalize':
        return classes.capitalize;
      default:
        return '';
    }
  };

  const rootClasses = `
    ${classes.root}
    ${noMargin ? classes.noMargin : ''}
    ${gutterBottom ? classes.gutterBottom : ''}
    ${getAlignClass()}
    ${getColorClass()}
    ${getWeightClass()}
    ${getTransformClass()}
    ${noWrap ? classes.noWrap : ''}
  `;

  return (
    <MuiTypography
      variant={variant}
      component={component}
      className={rootClasses}
      noWrap={noWrap}
      {...rest}
    >
      {children}
    </MuiTypography>
  );
};

export default Typography;
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  fullPage: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 9999,
  },
  inline: {
    display: 'inline-flex',
    marginRight: theme.spacing(1),
  },
  text: {
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  small: {
    '& .MuiCircularProgress-root': {
      width: 24,
      height: 24,
    },
    '& .MuiTypography-root': {
      fontSize: '0.75rem',
    },
  },
  medium: {
    '& .MuiCircularProgress-root': {
      width: 40,
      height: 40,
    },
  },
  large: {
    '& .MuiCircularProgress-root': {
      width: 60,
      height: 60,
    },
    '& .MuiTypography-root': {
      fontSize: '1.25rem',
    },
  },
  primary: {
    '& .MuiCircularProgress-root': {
      color: theme.palette.primary.main,
    },
  },
  secondary: {
    '& .MuiCircularProgress-root': {
      color: theme.palette.secondary.main,
    },
  },
}));

/**
 * Loader component
 * @param {Object} props - Component props
 * @param {string} props.size - Loader size (small, medium, large)
 * @param {string} props.color - Loader color (primary, secondary)
 * @param {string} props.text - Loader text
 * @param {boolean} props.fullPage - Whether loader should take full page
 * @param {boolean} props.inline - Whether loader should be inline
 * @param {Object} props.rest - Additional props
 * @returns {React.ReactElement} Loader component
 */
const Loader = ({
  size = 'medium',
  color = 'primary',
  text,
  fullPage = false,
  inline = false,
  ...rest
}) => {
  const classes = useStyles();

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

  const getColorClass = () => {
    switch (color) {
      case 'primary':
        return classes.primary;
      case 'secondary':
        return classes.secondary;
      default:
        return classes.primary;
    }
  };

  const rootClasses = `
    ${classes.root}
    ${fullPage ? classes.fullPage : ''}
    ${inline ? classes.inline : ''}
    ${getSizeClass()}
    ${getColorClass()}
  `;

  return (
    <div className={rootClasses} {...rest}>
      <CircularProgress color="inherit" />
      {text && (
        <Typography variant="body2" className={classes.text}>
          {text}
        </Typography>
      )}
    </div>
  );
};

export default Loader;
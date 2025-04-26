import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
  },
  title: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
  },
  subtitle: {
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  divider: {
    margin: `${theme.spacing(2)}px 0`,
  },
  content: {
    marginTop: theme.spacing(2),
  },
  actions: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-end',
    '& > button': {
      marginLeft: theme.spacing(1),
    },
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
  },
  error: {
    color: theme.palette.error.main,
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.error.light,
    borderRadius: theme.shape.borderRadius,
  },
}));

/**
 * Form component
 * @param {Object} props - Component props
 * @param {string} props.title - Form title
 * @param {string} props.subtitle - Form subtitle
 * @param {React.ReactNode} props.children - Form content
 * @param {React.ReactNode} props.actions - Form actions (buttons)
 * @param {boolean} props.loading - Whether form is in loading state
 * @param {string} props.error - Error message
 * @param {boolean} props.showDivider - Whether to show divider between title and content
 * @param {function} props.onSubmit - Form submit handler
 * @param {Object} props.rest - Additional props
 * @returns {React.ReactElement} Form component
 */
const Form = ({
  title,
  subtitle,
  children,
  actions,
  loading = false,
  error = '',
  showDivider = true,
  onSubmit,
  ...rest
}) => {
  const classes = useStyles();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(event);
    }
  };

  return (
    <Paper className={classes.root} elevation={1}>
      <form onSubmit={handleSubmit} {...rest}>
        {title && (
          <Typography variant="h5" component="h2" className={classes.title}>
            {title}
          </Typography>
        )}

        {subtitle && (
          <Typography variant="body2" className={classes.subtitle}>
            {subtitle}
          </Typography>
        )}

        {showDivider && title && <Divider className={classes.divider} />}

        {error && <div className={classes.error}>{error}</div>}

        {loading ? (
          <div className={classes.loading}>
            <CircularProgress />
          </div>
        ) : (
          <div className={classes.content}>{children}</div>
        )}

        {actions && <div className={classes.actions}>{actions}</div>}
      </form>
    </Paper>
  );
};

export default Form;
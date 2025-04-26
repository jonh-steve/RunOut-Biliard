import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  icon: {
    fontSize: '1.2rem',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
  },
  action: {
    marginRight: -8,
  },
}));

/**
 * Alert component
 * @param {Object} props - Component props
 * @param {string} props.severity - Alert severity (success, error, warning, info)
 * @param {string} props.title - Alert title
 * @param {React.ReactNode} props.children - Alert content
 * @param {boolean} props.closable - Whether alert can be closed
 * @param {function} props.onClose - Close handler
 * @param {boolean} props.autoHideDuration - Auto hide duration in milliseconds
 * @param {boolean} props.show - Whether alert is shown
 * @param {Object} props.rest - Additional props
 * @returns {React.ReactElement} Alert component
 */
const Alert = ({
  severity = 'info',
  title,
  children,
  closable = false,
  onClose,
  autoHideDuration = 0,
  show = true,
  ...rest
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(show);

  useEffect(() => {
    setOpen(show);
  }, [show]);

  useEffect(() => {
    if (autoHideDuration > 0 && open) {
      const timer = setTimeout(() => {
        setOpen(false);
        if (onClose) {
          onClose();
        }
      }, autoHideDuration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [autoHideDuration, open, onClose]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Collapse in={open}>
      <MuiAlert
        className={classes.root}
        severity={severity}
        action={
          closable && (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
              className={classes.action}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          )
        }
        {...rest}
      >
        {title && <AlertTitle className={classes.title}>{title}</AlertTitle>}
        <div className={classes.message}>{children}</div>
      </MuiAlert>
    </Collapse>
  );
};

export default Alert;
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiModal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2, 4, 3),
    outline: 'none',
    maxWidth: '90%',
    maxHeight: '90%',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  title: {
    fontWeight: 600,
  },
  closeButton: {
    padding: theme.spacing(0.5),
  },
  content: {
    marginTop: theme.spacing(2),
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
    '& > button': {
      marginLeft: theme.spacing(1),
    },
  },
  small: {
    width: '400px',
  },
  medium: {
    width: '600px',
  },
  large: {
    width: '800px',
  },
  fullWidth: {
    width: '90%',
  },
}));

/**
 * Modal component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether modal is open
 * @param {function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer
 * @param {string} props.size - Modal size (small, medium, large, fullWidth)
 * @param {boolean} props.disableBackdropClick - Whether to disable backdrop click
 * @param {boolean} props.disableEscapeKeyDown - Whether to disable escape key
 * @param {Object} props.rest - Additional props
 * @returns {React.ReactElement} Modal component
 */
const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  ...rest
}) => {
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return;
    }
    if (onClose) {
      onClose(event, reason);
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
      case 'fullWidth':
        return classes.fullWidth;
      default:
        return classes.medium;
    }
  };

  return (
    <MuiModal
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      disableBackdropClick={disableBackdropClick}
      disableEscapeKeyDown={disableEscapeKeyDown}
      {...rest}
    >
      <Fade in={open}>
        <div className={`${classes.paper} ${getSizeClass()}`}>
          {title && (
            <>
              <div className={classes.header}>
                <Typography variant="h6" className={classes.title}>
                  {title}
                </Typography>
                <IconButton
                  className={classes.closeButton}
                  aria-label="close"
                  onClick={onClose}
                >
                  <CloseIcon />
                </IconButton>
              </div>
              <Divider />
            </>
          )}

          <div className={classes.content}>{children}</div>

          {footer && (
            <>
              <Divider />
              <div className={classes.footer}>{footer}</div>
            </>
          )}
        </div>
      </Fade>
    </MuiModal>
  );
};

export default Modal;
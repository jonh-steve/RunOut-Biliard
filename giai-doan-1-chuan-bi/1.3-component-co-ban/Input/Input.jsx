import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  input: {
    borderRadius: 4,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.grey[300],
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-error fieldset': {
        borderColor: theme.palette.error.main,
      },
    },
  },
  label: {
    marginBottom: theme.spacing(0.5),
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  helperText: {
    marginTop: theme.spacing(0.5),
    fontSize: '0.75rem',
  },
  error: {
    color: theme.palette.error.main,
  },
}));

/**
 * Input component
 * @param {Object} props - Component props
 * @param {string} props.id - Input id
 * @param {string} props.name - Input name
 * @param {string} props.label - Input label
 * @param {string} props.type - Input type (text, password, email, etc.)
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {string} props.placeholder - Input placeholder
 * @param {boolean} props.required - Whether input is required
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {boolean} props.fullWidth - Whether input should take full width
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text
 * @param {React.ReactNode} props.startAdornment - Start adornment
 * @param {React.ReactNode} props.endAdornment - End adornment
 * @param {Object} props.rest - Additional props
 * @returns {React.ReactElement} Input component
 */
const Input = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  fullWidth = true,
  error = '',
  helperText = '',
  startAdornment,
  endAdornment,
  ...rest
}) => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const renderPasswordToggle = () => {
    if (type === 'password') {
      return (
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      );
    }
    return endAdornment;
  };

  return (
    <div className={classes.root}>
      <TextField
        id={id}
        name={name}
        label={label}
        type={type === 'password' && showPassword ? 'text' : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        error={!!error}
        className={classes.input}
        variant="outlined"
        InputProps={{
          startAdornment: startAdornment && (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ),
          endAdornment: renderPasswordToggle(),
        }}
        {...rest}
      />
      {(error || helperText) && (
        <FormHelperText
          className={`${classes.helperText} ${error ? classes.error : ''}`}
        >
          {error || helperText}
        </FormHelperText>
      )}
    </div>
  );
};

export default Input;
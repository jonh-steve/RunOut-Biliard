import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

/**
 * Button component for common actions
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, outline, text)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
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
  const classNames = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? 'button--full-width' : '',
    disabled ? 'button--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default Button;
import React from 'react';

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
 * @param {string} props.className - Additional CSS classes
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
  className = '',
  children,
  ...rest
}) => {
  // Mapping Material UI variants to Tailwind classes
  const variantClasses = {
    h1: 'text-4xl',
    h2: 'text-3xl',
    h3: 'text-2xl',
    h4: 'text-xl',
    h5: 'text-lg',
    h6: 'text-base font-medium',
    subtitle1: 'text-lg',
    subtitle2: 'text-base',
    body1: 'text-base',
    body2: 'text-sm',
    caption: 'text-xs',
    overline: 'text-xs uppercase tracking-wider',
  };

  // Mapping alignment to Tailwind classes
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  // Mapping colors to Tailwind classes
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    error: 'text-red-600',
  };

  // Mapping font weights to Tailwind classes
  const weightClasses = {
    light: 'font-light',
    regular: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold',
  };

  // Mapping text transforms to Tailwind classes
  const transformClasses = {
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
  };

  // Mapping variants to HTML elements if component is not specified
  const variantElements = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle1: 'h6',
    subtitle2: 'h6',
    body1: 'p',
    body2: 'p',
    caption: 'span',
    overline: 'span',
  };

  // Determine which HTML element to use
  const Element = component || variantElements[variant] || 'p';

  // Combine all classes
  const classes = `
    ${variantClasses[variant] || variantClasses.body1}
    ${alignClasses[align] || alignClasses.left}
    ${color ? colorClasses[color] || '' : ''}
    ${weight ? weightClasses[weight] || '' : ''}
    ${transform ? transformClasses[transform] || '' : ''}
    ${noWrap ? 'whitespace-nowrap overflow-hidden overflow-ellipsis' : ''}
    ${gutterBottom ? 'mb-4' : ''}
    ${noMargin ? 'm-0' : 'mb-2'}
    ${className}
  `;

  return (
    <Element className={classes} {...rest}>
      {children}
    </Element>
  );
};

export default Typography;
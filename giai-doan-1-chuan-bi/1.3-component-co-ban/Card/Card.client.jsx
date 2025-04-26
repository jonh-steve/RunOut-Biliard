import React from 'react';

/**
 * Card component
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} props.subheader - Card subheader
 * @param {React.ReactNode} props.avatar - Card avatar
 * @param {string} props.image - Card image URL
 * @param {string} props.imageAlt - Card image alt text
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.actions - Card actions
 * @param {boolean} props.raised - Whether card is raised
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.rest - Additional props
 * @returns {React.ReactElement} Card component
 */
const Card = ({
  title,
  subheader,
  avatar,
  image,
  imageAlt = '',
  children,
  actions,
  raised = false,
  onClick,
  className = '',
  ...rest
}) => {
  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }
  };

  // Base card classes
  const cardClasses = `
    bg-white
    rounded-lg
    overflow-hidden
    transition-shadow
    duration-300
    ${raised ? 'shadow-lg' : 'shadow'}
    ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}
    ${className}
  `;

  // Default avatar if title exists but no avatar provided
  const defaultAvatar = title && !avatar && (
    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
      {title.charAt(0)}
    </div>
  );

  return (
    <div className={cardClasses} onClick={handleClick} {...rest}>
      {/* Card Header */}
      {(title || subheader || avatar) && (
        <div className="px-4 py-3 flex items-center">
          {(avatar || defaultAvatar) && (
            <div className="mr-3">
              {avatar || defaultAvatar}
            </div>
          )}
          <div>
            {title && <h3 className="text-gray-800 font-medium">{title}</h3>}
            {subheader && <p className="text-gray-500 text-sm">{subheader}</p>}
          </div>
        </div>
      )}

      {/* Card Image */}
      {image && (
        <div className="w-full relative pb-[56.25%]">
          <img 
            src={image} 
            alt={imageAlt} 
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
      )}

      {/* Card Content */}
      <div className={`px-4 py-3 ${!actions ? 'pb-4' : ''}`}>
        {typeof children === 'string' ? (
          <p className="text-gray-600 text-sm">{children}</p>
        ) : (
          children
        )}
      </div>

      {/* Card Actions */}
      {actions && (
        <div className="px-2 py-2 flex justify-end">
          {actions}
        </div>
      )}
    </div>
  );
};

export default Card;
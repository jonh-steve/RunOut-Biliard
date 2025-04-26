import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

/**
 * Card component for displaying content in a contained manner
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.actions - Card actions (buttons, links)
 * @param {boolean} props.elevated - Whether card has elevation
 */
const Card = ({ children, title, actions, elevated = false, ...rest }) => {
  const cardClasses = ['card', elevated ? 'card--elevated' : ''].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...rest}>
      {title && <div className="card-header">{title}</div>}
      <div className="card-content">{children}</div>
      {actions && <div className="card-actions">{actions}</div>}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  actions: PropTypes.node,
  elevated: PropTypes.bool,
};

export default Card;
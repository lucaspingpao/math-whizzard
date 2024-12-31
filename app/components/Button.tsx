import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  type = 'button',
  variant = 'primary'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button ${variant}`}
    >
      {children}
    </button>
  );
};

export default Button;
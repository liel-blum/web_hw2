import React from 'react';

interface ButtonProps {
  onClick: () => void;
  text: string;        
}

export const Button: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <button onClick={onClick} className={`${text}_button`}>
      {text}
    </button>
  );
};

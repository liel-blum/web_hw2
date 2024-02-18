import React from 'react';
interface ButtonProps {
  onClick: () => void;
  text: string;        
}

export const Button: React.FC<ButtonProps> = ({ onClick, text }) => {
  const className = text.replace(/'/g, '').replace(/\s+/g, '-').toLocaleLowerCase() + '-button ';
  return (
    <button onClick={onClick} className={className}>
      {text}
    </button>
  );
};

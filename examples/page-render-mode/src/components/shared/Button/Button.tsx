import React from 'react';

type Props = {
  onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
  children?: React.ReactNode;
};

export const Button = ({ children, onClick }: Props) => (
  <button type="button" onClick={onClick}>
    {children}
  </button>
);

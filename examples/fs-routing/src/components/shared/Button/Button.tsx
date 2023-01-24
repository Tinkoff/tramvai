import React from 'react';

type Props = {
  onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
  children?: React.ReactNode;
  id?: string;
};

export const Button = ({ children, onClick, id }: Props) => (
  <button id={id} type="button" onClick={onClick}>
    {children}
  </button>
);

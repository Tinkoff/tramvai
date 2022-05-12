/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

export const FallbackError = () => {
  return (
    <div>
      <div
        style={{
          textAlign: 'center',
          marginBottom: 11,
          paddingTop: 26,
          fontSize: 30,
          lineHeight: '36px',
          fontWeight: 200,
        }}
      >
        An error occurred :(
      </div>
      <div
        style={{
          textAlign: 'center',
          marginBottom: 17,
          color: '#9299a2',
          fontSize: 20,
          lineHeight: '24px',
        }}
      >
        Try{' '}
        <a href="" onClick={() => window.location.reload()}>
          reloading the page
        </a>
      </div>
    </div>
  );
};

FallbackError.displayName = 'FallbackError';
/* eslint-enable jsx-a11y/anchor-is-valid */

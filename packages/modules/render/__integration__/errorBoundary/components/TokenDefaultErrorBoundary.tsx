export const TokenDefaultErrorBoundary = ({ error }) => {
  return (
    <main>
      <h1>Token Default Error Boundary</h1>
      <p>Error: {error.message}</p>
    </main>
  );
};

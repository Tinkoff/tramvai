const FSPagesErrorBoundary = ({ error }) => {
  return (
    <main>
      <h1>FS Pages Error Boundary</h1>
      <p>Error: {error.message}</p>
    </main>
  );
};

export default FSPagesErrorBoundary;

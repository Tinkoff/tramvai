export function handleErrors() {
  process.on('uncaughtException', (err) => {
    console.error('Global error was not caught');
    console.error(err, err.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    console.log('Unhandled promise');
    console.error(err);
    process.exit(1);
  });
}

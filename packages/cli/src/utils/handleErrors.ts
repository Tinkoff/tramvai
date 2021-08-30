export function handleErrors() {
  process.on('uncaughtException', (err) => {
    console.error('Возникла не перехваченная глобальная ошибка');
    console.error(err, err.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    console.log('Не отловленный promise');
    console.error(err);
    process.exit(1);
  });
}

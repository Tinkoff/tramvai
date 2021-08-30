export const getErrorMessage = (message: string) => {
  switch (true) {
    case /network timeout at/i.test(message) || /request timed out/i.test(message):
      return 'Время истекло. Обновите страницу и повторите попытку.';
    default:
      return 'Что-то пошло не так. Мы уже решаем проблему. Попробуйте снова через несколько минут.';
  }
};

export const formatError = (error: Error & { originalMessage?: string }) => {
  if (error.originalMessage) {
    return error;
  }

  const originalMessage = error.message;
  const message = getErrorMessage(originalMessage);

  return Object.assign(error, { message, originalMessage });
};

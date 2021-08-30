# Validtors

## Интерфейс
### все ок
`{ name: 'checkBuild', status: 'ok' }`

### есть варнинги
`{ name: 'checkBuild', status: 'warning', message: 'my warning' }`

### ошибка
throw new Error('Причина для падения');

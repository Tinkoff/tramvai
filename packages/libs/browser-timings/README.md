# Browser-timings
Библиотека для получения перфоманс данных от клиентов. Автоматически собирает и собирает вомзожные данные.

## Как подключить
Устанавливаем npm модуль
```bash
npm i --save @tinkoff/browser-timings
```

## Как использовать
```tsx
import { browserTimings } from '@tinkoff/browser-timings';

window.addEventListener('load', () => {
  setTimout(() => { // setTimout нужен, что бы отработали и появились все метрики. Иначе не будет доступен loadEventEnd
    const perfData = browserTimings();
  }, 0)
});
```

После выполнения этого кода в perfData будет объект с данными о клиенте, которые можно переотправить в внешние системы

Необходимо выполнять библиотеку только после инициализации браузером страницы. Иначе библиотека не сможет получить данные и вернет пустой объект.

## Интерфейс библиотеки
```tsx
export interface Timings {
  /* Время на подключение клиента к серверу */
  connection: number;
  /* Сколько длился ответ на бэекенде */
  backend: number;
  /* Скачивание страницы клиентов */
  pageDownload: number;
  /* Отобразилась первоя информация клиенту */
  'first-paint': number;
  /* С страницей можно взаимодействовать */
  domInteractive: number;
  /* DOM полностью построен */
  domComplete: number;
  /* Страница и ресурсы полностью загружены */
  pageLoadTime: number;
  /* Общая информация о том, сколько было ресурсов и времени загрузки */
  download: {
      html: TimingResource;
      js: TimingResource;
      css: TimingResource;
      img: TimingResource;
      font: TimingResource;
      other: TimingResource;
    };
}
interface TimingResource {
  /* Общее время загрузки ресурсов */
  duration: number;
  /* Общий размер в байтах используемого на странице данных */
  encodedDecodeSize: number;
  /* Общий размер переданных данных по сети. На разнице между encodedDecodeSize - transferSize можно узнать, сколько данных не попало в кэш */
  transferSize: number;
}
```

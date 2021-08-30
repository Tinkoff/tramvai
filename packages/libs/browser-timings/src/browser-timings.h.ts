export interface TimingResource {
  duration: number;
  encodedBodySize: number;
  transferSize: number;
}

export interface Timings {
  /* Время старта приложения */
  navigationStart: number;
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

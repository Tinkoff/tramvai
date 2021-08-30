module.exports = {
  'Getting started': [
    'get-started/overview',
    'get-started/create-app',
    'get-started/app-structure',
    'get-started/core-modules',
  ],
  'Основные концепции': [
    'concepts/overview',
    'concepts/di',
    'concepts/provider',
    'concepts/module',
    'concepts/command-line-runner',
    'concepts/action',
    'concepts/bundle',
  ],
  Возможности: [
    'features/react',
    {
      type: 'category',
      label: 'Routing',
      items: [
        'features/routing',
        {
          type: 'doc',
          label: 'Интеграция с tramvai',
          id: 'references/modules/router',
        },
        {
          type: 'doc',
          label: 'Библиотека @tinkoff/router',
          id: 'references/libs/router',
        },
      ],
    },
    {
      type: 'category',
      label: 'State management',
      items: [],
    },
    {
      type: 'category',
      label: 'Data fetching',
      items: [
        {
          type: 'doc',
          label: 'HTTP запросы',
          id: 'references/modules/http-client',
        },
        {
          type: 'doc',
          label: 'Введение в экшены',
          id: 'concepts/action',
        },
        {
          type: 'doc',
          label: 'Создание экшена',
          id: 'how-to/how-create-action',
        },
        {
          type: 'doc',
          label: 'Глобальные экшены',
          id: 'how-to/actions-execution',
        },
        {
          type: 'doc',
          label: 'Условия выполнения экшенов',
          id: 'how-to/actions-conditions',
        },
        {
          type: 'doc',
          label: 'Интерфейс createAction',
          id: 'references/tramvai/create-action',
        },
      ],
    },
    {
      type: 'category',
      label: 'API routes',
      items: [
        'features/papi/introduction',
        {
          type: 'doc',
          label: 'Рецепты',
          id: 'how-to/how-create-papi',
        },
        {
          type: 'doc',
          label: 'Библиотека @tramvai/papi',
          id: 'references/libs/papi',
        },
      ],
    },
    {
      type: 'category',
      label: 'React Query',
      items: [],
    },
    'features/migration',
  ],
  Рецепты: [
    'how-to/how-create-module',
    'how-to/how-create-bundle',
    'how-to/how-create-action',
    'how-to/how-create-papi',
    'how-to/how-create-async-component',
    'how-to/how-enable-modern',
    'how-to/how-debug-modules',
    'how-to/universal',
    'how-to/bundle-optimization',
    'how-to/deploy',
  ],
  Справочник: [
    {
      type: 'category',
      label: 'API',
      items: [
        'references/tramvai/create-app',
        'references/tramvai/create-bundle',
        'references/tramvai/create-action',
        'references/tramvai/module',
      ],
    },
    {
      type: 'category',
      label: 'Модули',
      items: [],
    },
    {
      type: 'category',
      label: 'Библиотеки',
      items: [],
    },
    {
      type: 'category',
      label: 'Токены',
      items: [],
    },
  ],
  Сообщество: [],
};

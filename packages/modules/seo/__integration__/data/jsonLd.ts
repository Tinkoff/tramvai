export const jsonLd = {
  '@graph': [
    {
      url: 'https://www.tinkoff.ru/',
      name: 'Тинькофф Банк',
      '@type': 'BankOrCreditUnion',
      image:
        'https://static.tinkoff.ru/dist/portal-new/compiled/be23084191c7e7b4012da807d829ac04.png',
      address: {
        '@type': 'PostalAddress',
        postalCode: '123060',
        streetAddress: '1-й Волоколамский проезд, д.10, стр.1',
        addressCountry: 'Россия',
        addressLocality: 'Москва',
      },
      '@context': 'http://schema.org/',
      legalName: 'АО «Тинькофф Банк»',
      telephone: '+7 800 333-777-3',
      priceRange: '0-7999',
      description: 'лицензия ЦБ РФ № 2673',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+7 800 333-777-3',
        areaServed: 'Для звонков по России',
        contactType: 'customer service',
        contactOption: 'TollFree',
      },
    },
    {
      url: 'https://www.tinkoff.ru/',
      name: 'Тинькофф Банк',
      '@type': 'Organization',
      image:
        'https://static.tinkoff.ru/dist/portal-new/compiled/be23084191c7e7b4012da807d829ac04.png',
      address: {
        '@type': 'PostalAddress',
        postalCode: '123060',
        streetAddress: '1-й Волоколамский проезд, д.10, стр.1',
        addressCountry: 'Россия',
        addressLocality: 'Москва',
      },
      '@context': 'http://schema.org/',
      legalName: 'АО «Тинькофф Банк»',
      telephone: '+7 800 333-777-3',
      description: 'лицензия ЦБ РФ № 2673',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+7 800 333-777-3',
        areaServed: 'Для звонков по России',
        contactType: 'customer service',
        contactOption: 'TollFree',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        reviewCount: '439',
      },
    },
    {
      name: 'Кредитная карта «Тинькофф Платинум»',
      '@type': 'Product',
      image: {
        url: 'https://static2.tinkoff.ru/portal/mobile-home/img-platinum-char.png',
        '@type': 'ImageObject',
      },
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '590',
        offeredBy: {
          name: 'Тинькофф Банк',
          '@type': 'BankOrCreditUnion',
          image: {
            url: 'https://static.tinkoff.ru/dist/portal-new/compiled/c5e2e251a557ad1e3a5f120d5516d00d.png',
            '@type': 'ImageObject',
          },
          address: {
            '@type': 'PostalAddress',
            postalCode: '123060',
            streetAddress: '1-й Волоколамский проезд, д.10, стр.1',
            addressCountry: 'Россия',
            addressLocality: 'Москва',
          },
          telephone: '+7 800 555-777-8',
          priceRange: '0-7999',
        },
        priceCurrency: 'RUB',
      },
      '@context': 'http://schema.org',
      description: 'Кредитный лимит на карте до 300 000 рублей. Без процентов до 55 дней',
      potentialAction: {
        url: 'https://www.tinkoff.ru/cards/credit-cards/tinkoff-platinum/#form',
        name: 'Оформить карту',
        '@type': 'Action',
      },
    },
  ],
  '@context': 'http://schema.org',
};

import type { Converter } from '@tinkoff/meta-tags-generate';
import { metaInnerHtml, metaName, metaProperty, metaLink } from './metaType';

const robotsNoIndex = [metaName('robots', 'noindex, follow'), metaName('robots', 'noarchive')];
const robotsNoFollow = [metaName('robots', 'index, nofollow'), metaName('robots', 'noarchive')];
const robotsNone = [
  metaName('robots', 'none'),
  metaName('robots', 'noindex, nofollow'),
  metaName('robots', 'noarchive'),
];

const metaRobotsContent = {
  all: [
    metaName('robots', 'all'),
    metaName('robots', 'index, follow'),
    metaName('robots', 'noarchive'),
  ],
  noindex: robotsNoIndex,
  'noindex, follow': robotsNoIndex,
  nofollow: robotsNoFollow,
  'index, nofollow': robotsNoFollow,
  none: robotsNone,
  'noindex, nofollow': robotsNone,
};

export const converters: Record<string, Converter> = {
  title: metaInnerHtml('title'),
  description: metaName('description'),
  keywords: metaName('keywords'),
  canonical: metaLink('canonical'),
  viewport: metaName('viewport'),
  ogTitle: metaProperty('og:title'),
  ogDescription: metaProperty('og:description'),
  ogSiteName: metaProperty('og:site_name'),
  ogUrl: metaProperty('og:url'),
  ogType: metaProperty('og:type'),
  ogImage: metaProperty('og:image'),
  ogImageSecure: metaProperty('og:image:secure_url'),
  ogImageType: metaProperty('og:image:type'),
  ogImageAlt: metaProperty('og:image:alt'),
  ogImageWidth: metaProperty('og:image:width'),
  ogImageHeight: metaProperty('og:image:height'),
  ogLocale: metaProperty('og:locale'),
  twitterTitle: metaName('twitter:title'),
  twitterDescription: metaName('twitter:description'),
  twitterCard: metaName('twitter:card'),
  twitterSite: metaName('twitter:site'),
  twitterCreator: metaName('twitter:creator'),
  twitterImage: metaName('twitter:image'),
  twitterImageAlt: metaName('twitter:image:alt'),
  robots: (x: string) => metaRobotsContent[x],
};

import type { StaticDescriptor, DynamicDescriptor } from '@tinkoff/htmlpagebuilder';
import { dynamicRender, staticRender } from '@tinkoff/htmlpagebuilder';
import { ResourceSlot } from '@tramvai/tokens-render';
import { formatAttributes } from './utils';

const {
  REACT_RENDER,
  HEAD_CORE_SCRIPTS,
  HEAD_DYNAMIC_SCRIPTS,
  HEAD_META,
  HEAD_POLYFILLS,
  HEAD_CORE_STYLES,
  HEAD_PERFORMANCE,
  HEAD_ANALYTICS,
  BODY_START,
  BODY_END,
  HEAD_ICONS,
  BODY_TAIL_ANALYTICS,
  BODY_TAIL,
} = ResourceSlot;

export const htmlPageSchemaFactory = ({
  htmlAttrs,
}): Array<StaticDescriptor | DynamicDescriptor> => {
  return [
    staticRender('<!DOCTYPE html>'),
    staticRender(`<html ${formatAttributes(htmlAttrs, 'html')}>`),

    staticRender('<head>'),
    staticRender('<meta charset="UTF-8">'),
    dynamicRender(HEAD_META),
    dynamicRender(HEAD_PERFORMANCE),
    dynamicRender(HEAD_CORE_STYLES),
    dynamicRender(HEAD_POLYFILLS),
    dynamicRender(HEAD_DYNAMIC_SCRIPTS),
    dynamicRender(HEAD_CORE_SCRIPTS),
    dynamicRender(HEAD_ANALYTICS),
    dynamicRender(HEAD_ICONS),
    staticRender('</head>'),
    staticRender(`<body ${formatAttributes(htmlAttrs, 'body')}>`),
    dynamicRender(BODY_START),
    // react app
    dynamicRender(REACT_RENDER),
    dynamicRender(BODY_END),
    dynamicRender(BODY_TAIL_ANALYTICS),
    dynamicRender(BODY_TAIL),
    staticRender('</body>'),
    staticRender('</html>'),
  ];
};

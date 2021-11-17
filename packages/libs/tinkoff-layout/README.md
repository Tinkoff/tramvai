# @tinkoff/layout-factory

## Installation

Install `@tinkoff/layout-factory` using your package manager, e.g. for npm:

```bash
npm i @tinkoff/layout-factory
```

Create new layout object

```tsx
import React from 'react';
import { createLayout } from '@tinkoff/layout-factory';
import { Content, Page, Feedback } from './components';
import { layoutWrapper, feedbackWrapper } from './wrappers';

const MyLayout = createLayout({
  components: {
    page: Page,
    content: Content,
    feedback: Feedback,
  },
  wrappers: {
    layout: layoutWrapper,
    feedback: feedbackWrapper,
  },
});
```

## Layout structure

Layout has the following structure:

```tsx
<LayoutWrapper>
  {globalComponents}
  <ContentWrapper>
    <HeaderWrapper>
      <Header />
    </HeaderWrapper>
    <PageWrapper>{page}</PageWrapper>
    <FooterWrapper>
      <Footer />
    </FooterWrapper>
  </ContentWrapper>
</LayoutWrapper>
```

Any of the wrappers could be customized. By default, every wrapper just renders passed `children` prop, but `HeaderWrapper` and `FooterWrapper` render only if components `Header` and `Footer` were passed as props to result layout.

## Customization ways

Customization is made through options `components` and `wrappers`

### Components

React components

- `header`, `footer`, `layout`, `content`, `page` are base components for wrappers. They should render passed prop `children`. By default, `layout`, `content`, `page` are "render children" while `header` and `footer` are "render prop"
- any of the other components are, so called, `globalComponents`. They are just rendered as components inside `LayoutWrapper`

### Wrappers

[HOC](https://ru.reactjs.org/docs/higher-order-components.html) for `components`

- `header`, `footer`, `layout`, `content`, `page` - HOC for the base components
- all of the other components are HOCs for все остальные wrappers - HOC for corresponding `globalComponents`

It is possible to pass a list of HOCs. This way order of render wrapping for passed component will be from end to start of the list.

Such wrappers and used for:

- hide/show elements by condition
- set additional css style for components
- inject additional code/handler
- pass additional props

Example of such wrapper:

```tsx
function layoutWrapper(WrappedComponent) {
  return (props) => (
    <div className="ui-layout">
      <WrappedComponent {...props} />
    </div>
  );
}
```

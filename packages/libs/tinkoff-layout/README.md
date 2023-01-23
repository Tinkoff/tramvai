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

import type { PropsWithChildren } from 'react';
import React, { forwardRef } from 'react';
import { createBundle } from '@tramvai/core';
import { Link, useRoute, useUrl } from '@tramvai/module-router';
import { lazy } from '@tramvai/react';

const CustomLink = forwardRef<PropsWithChildren, any>(({ children, ...props }, ref) => {
  return (
    <a ref={ref} {...props}>
      {children}
    </a>
  );
});

const Layout = ({ children }: PropsWithChildren) => {
  const route = useRoute();
  const { path } = useUrl();

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link url="/">main</Link>
          </li>
          <li>
            <Link url="/second/">
              <a>second</a>
            </Link>
          </li>
          <li>
            <Link url="/third/">
              <CustomLink>third</CustomLink>
            </Link>
          </li>
          <li>
            <Link url="/not-found-route/">not-found-route</Link>
          </li>
          <li>
            <Link url="https://www.test.test/">absolute-url</Link>
          </li>
        </ul>
      </nav>
      <h2>Route name: {route.name}</h2>
      <div>Route path: {path}</div>
      {children}
      <footer style={{ paddingTop: '2000px' }}>
        <Link url="/out-of-viewport/">out-of-viewport</Link>
      </footer>
    </>
  );
};

// eslint-disable-next-line import/no-default-export
export default createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: lazy(() => import('../pages/main')),
    secondPage: lazy(() => import('../pages/second')),
    thirdPage: lazy(() => import('../pages/third')),
    outOfViewportPage: lazy(() => import('../pages/out-of-viewport')),
    nestedLayoutComponent: Layout,
  },
});

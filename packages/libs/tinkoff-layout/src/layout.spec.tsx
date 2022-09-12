/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { createLayout } from './layout';

const Page = () => <div>Page</div>;
const Header = ({ prop }) => <header>head{prop ? ` prop=${prop}` : null}</header>;
const Footer = ({ prop }) => <footer>foot{prop ? ` prop=${prop}` : null}</footer>;

describe('createLayout', () => {
  it('layout with empty parameters', () => {
    const Layout = createLayout({
      wrappers: {},
      components: {},
    });
    const { container } = render(
      <Layout>
        <Page />
      </Layout>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('layout with nothing', () => {
    const Layout = createLayout();
    const { container } = render(
      <Layout>
        <Page />
      </Layout>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('layout with full options', () => {
    const Layout = createLayout({
      wrappers: {
        footer: [
          (Wrapped) => (props) =>
            (
              <div>
                Footer
                <Wrapped {...props} />
              </div>
            ),
        ],
        header: [
          (Wrapped) => (props) =>
            (
              <div>
                Header
                <Wrapped {...props} />
              </div>
            ),
          (Wrapped) => (props) =>
            (
              <div className="header-wrapper">
                <Wrapped {...props} />
              </div>
            ),
        ],
        page: [
          (Wrapped) => (props) =>
            (
              <div className="page-wrapper">
                <Wrapped {...props} />
              </div>
            ),
        ],
        layout: [
          (Wrapped) => (props) =>
            (
              <div className="layout">
                <Wrapped {...props} />
              </div>
            ),
        ],
        content: [
          (Wrapped) => (props) =>
            (
              <div className="page-wrapper">
                <Wrapped {...props} />
              </div>
            ),
        ],
      },
      components: {
        global1: () => <div>global component</div>,
        global2: () => <div>global2 component</div>,
      },
    });

    const { container } = render(
      <Layout Header={Header} Footer={Footer}>
        <Page />
      </Layout>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('layout with only layout wrapper', () => {
    const Layout = createLayout({
      components: {
        feedback: () => <div>fedback</div>,
        popup: () => <div>popup</div>,
      },
      wrappers: {
        layout: [
          (Wrapped) => (props) =>
            (
              <div className="layout">
                <Wrapped {...props} />
              </div>
            ),
        ],
      },
    });

    const { container } = render(
      <Layout>
        <Page />
      </Layout>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('layout with header and footer', () => {
    const Layout = createLayout({
      components: {
        feedback: () => <div>fedback</div>,
        popup: () => <div>popup</div>,
      },
      wrappers: {
        layout: [
          (Wrapped) => (props) =>
            (
              <div className="layout">
                <Wrapped {...props} />
              </div>
            ),
        ],
      },
    });

    const { container } = render(
      <Layout Header={Header} Footer={Footer}>
        <Page />
      </Layout>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('layout with base layout, content and page components', () => {
    const Layout = createLayout({
      wrappers: {
        layout: (Wrapped) => (props) => <Wrapped {...props} className="layout" />,
        content: (Wrapped) => (props) => <Wrapped {...props} className="content" />,
        page: (Wrapped) => (props) => <Wrapped {...props} className="page" />,
      },
      components: {
        layout: ({ children, className }) => (
          <div className={className}>
            Base layout
            {children}
          </div>
        ),
        content: ({ children, className }) => (
          <div className={className}>
            Content page
            {children}
          </div>
        ),
        page: ({ children, className }) => (
          <div className={className}>
            Base page
            {children}
          </div>
        ),
      },
    });

    const { container } = render(
      <Layout>
        <Page />
      </Layout>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should not render wrappers when Header and Footer is missing', () => {
    const Layout = createLayout({
      wrappers: {
        header: [
          (Wrapped) => (props) =>
            (
              <div className="header">
                <Wrapped {...props} />
              </div>
            ),
        ],
        footer: [
          (Wrapped) => (props) =>
            (
              <div className="footer">
                <Wrapped {...props} />
              </div>
            ),
        ],
        layout: [
          (Wrapped) => (props) =>
            (
              <div className="layout">
                <Wrapped {...props} />
              </div>
            ),
        ],
      },
    });

    const { container } = render(
      <Layout>
        <Page />
      </Layout>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should not render Header when some of wrappers return null', () => {
    const Layout = createLayout({
      wrappers: {
        header: [
          (Wrapped) => (props) =>
            (
              <div className="header">
                <Wrapped {...props} />
              </div>
            ),
          (Wrapped) => (props) => null,
        ],
        footer: [
          (Wrapped) => (props) =>
            (
              <div className="footer">
                <Wrapped {...props} />
              </div>
            ),
        ],
        layout: [
          (Wrapped) => (props) =>
            (
              <div className="layout">
                <Wrapped {...props} />
              </div>
            ),
        ],
      },
    });

    const { container } = render(
      <Layout Header={Header} Footer={Footer}>
        <Page />
      </Layout>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should pass custom props from some of wrappers to Header and Footer', () => {
    const Layout = createLayout({
      wrappers: {
        header: [
          (Wrapped) => (props) =>
            (
              <div className="header">
                <Wrapped {...props} />
              </div>
            ),
          (Wrapped) => (props) => <Wrapped {...props} prop="a" />,
        ],
        footer: [
          (Wrapped) => (props) =>
            (
              <div className="footer">
                <Wrapped {...props} prop="b" />
              </div>
            ),
        ],
        layout: [
          (Wrapped) => (props) =>
            (
              <div className="layout">
                <Wrapped {...props} />
              </div>
            ),
        ],
      },
    });

    const { container } = render(
      <Layout Header={Header} Footer={Footer}>
        <Page />
      </Layout>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

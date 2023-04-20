# @tinkoff/meta-tags-generate

Library for generating and updating meta-tags in browser.

Link to complete SEO and Meta documentation - https://tramvai.dev/docs/features/seo/

## Api

- `Meta({ list: [] }): Meta` - object used for constructing an instance of meta-tags based on passed sources
- `Render(meta: Meta): { render(): string }` - render of specific _Meta_ instance as a string. Used in SSR
- `Update(meta: Meta): { update(): void }` - updates meta-tags layout in browser. Used in browser while SPA-navigations

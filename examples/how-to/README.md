## How to run example

1. Make sure you've built packages in the repo (with `yarn build` or `yarn watch`)
2. Choose an app that you want to run - every nested directory it is a separate app with the name equals to the name of directory, e.g. `react-query-usage`
3. From the root of `examples/how-to` run command `npm run examples:howto -- start <app_name>` where `<app_name>` is the name of chosen app
4. The app will start. To see available routes you can refer to `routes.ts` file inside app directory, e.g. `react-query-usage/routes.ts`

# Child App examples

## Explanation

### root-app

Root app with included `@tramvai/module-child-app` in order to add functionality to child app management

## How to

### Run examples

1. Start root app

   ```sh
   cd examples/child-app
   yarn start:root
   ```

1. Run another terminal
1. Start any of child app

   ```sh
   cd examples/child-app
   yarn start:children
   ```

1. Open browser and go to page `http://localhost:3000/[child-app-name]` to see child-app on the page

# __mocks__
This folder contains React components and their transpiled equivalents. Before serving a component to a `Wormhole`, they must be transpiled into pure JavaScript as this is the format they're expected to presented to at runtime.

## Creating a Wormhole
To create a `Wormhole`, you must first create a **single** file which:
  - Must at a minimum, `export default` a `Component`.
    - Your file can contain multiple `Component`s, but you may only `export default` **one** of them.
  - Depend purely on the global scope of the runtime application.
    - By default, it only supports global dependence upon `react` and `react-native`. This can be extended, but you will need to manage versioning of your runtime versus remote plugins to ensure plugin compatibility prior to rendering.

Finally, you must run your component through [**Babel**](https://babeljs.io/docs/en/babel-cli):

```sh
yarn add --dev @babel/core @babel/cli @babel/preset-env @babel/preset-react
npx babel --presets=@babel/preset-env,@babel/preset-react MyComponent.jsx -o MyWormhole.js
```

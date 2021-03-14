# 🌌 [`react-native-wormhole`](http://npmjs.com/package/react-native-wormhole)
A `Wormhole` allows your [⚛️ **React Native**](https://reactnative/dev) application to consume components from a remote URL as if it were a local `import`, enabling them to easily become remotely configurable at runtime!

[🎬 **Watch the Demo!**](https://twitter.com/cawfree/status/1370809787294879746)

> ⚠️ Implementors must take care to protect their Wormholes from [**arbitrary code execution**](https://en.wikipedia.org/wiki/Arbitrary_code_execution). Insufficient protection will put your user's data and device at risk. 💀

### 🚀 Getting Started

Using [**Yarn**](https://yarnpkg.com):

```sh
yarn add react-native-wormhole
```

Next, you'll need a component to serve. Let's create a quick project to demonstrate how this works:

```
mkdir my-new-wormhole
cd my-new-wormhole
yarn init
yarn add --dev @babel/core @babel/cli @babel/preset-env @babel/preset-react
```

That should be enough. Inside `my-new-wormhole/`, let's quickly create a simple component:

**`my-new-wormhole/MyNewWormhole.jsx`**:

```javascript
import * as React from 'react';
import { Animated, Alert, TouchableOpacity } from 'react-native';

function CustomButton() {
  return (
    <TouchableOpacity onPress={() => Alert.alert('Hello!')}>
      <Animated.Text children="Click here!" />
    </TouchableOpacity>
  );
}

export default function MyNewWormhole() {
  const message = React.useMemo('Hello, world!', []);
  return (
    <Animated.View style={{ flex: 1, backgroundColor: 'red' }}>
      <Animated.Text>{message}</Animated.Text>
      <CustomButton />
    </Animated.View>
  );
}
```

> 🤔 **What syntax am I allowed to use?**
> 
> By default, you can use all functionality exported by `react` and `react-native`. The only requirement is that you must `export default` the Component that you wish to have served through the `Wormhole`.

Now our the component needs to be [**transpiled**](https://babeljs.io/docs/en/babel-cli). Below, we use [**Babel**](https://babeljs.io/) to convert `MyNewWormhole` into a format that can be executed at runtime:

```
npx babel --presets=@babel/preset-env,@babel/preset-react MyNewWormhole.jsx -o MyNewWormhole.js
```

After doing this, we'll have produced `MyNewWormhole.js`, which has been expressed in a format that is suitable to serve remotely. If you're unfamiliar with this process, take a quick look through the contents of the generated file to understand how it has changed.

Next, you'd need to serve this file somewhere. For example, you could save it on GitHub, [**IPFS**](https://ipfs.io/) or on your own local server. To see an example of this, check out the [**Example Server**](./example/scripts/serve.js).

> 👮 **Security Notice**
> 
> In production environments, you **must** serve content using [**HTTPS**](https://en.wikipedia.org/wiki/HTTPS) to prevent [**Man in the Middle**](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) attacks. Additionally, served content must be signed using public-key encryption to ensure authenticity of the returned source code. A demonstration of this approach using [**Ethers**](https://github.com/ethers-io/ethers.js/) is shown in the [**Example App**](https://github.com/cawfree/react-native-wormhole/blob/bdb127b21e403dab1fb63894f5d6764a92a002d4/example/App.tsx#L11).


Finally, let's render our `<App />`! For the purpose of this tutorial, let's assume the file is served at [https://cawfree.com/MyNewWormhole.jsx](https://cawfree.com/MyNewWormhole.jsx):

```javascript
import * as React from 'react';
import { createWormhole } from 'react-native-wormhole';

const { Provider, Wormhole } = createWormhole({
  verify: async () => true,
});

export default function App() {
  return (
    <Provider>
      <Wormhole source={{ uri: 'https://cawfree.com/MyNewWormhole.jsx' }} />
    </Provider>
  );
}
```

And that's everything! Once our component has finished downloading, it'll be mounted and visible on screen. 🚀

### 🔩 Configuration

#### 🌎 Global Scope

By default, a `Wormhole` is only capable of consuming global functionality from two different modules; [`react`](https://github.com/facebook/react) and [`react-native`](https://github.com/facebook/react-native), meaning that only "vanilla" React Native functionality is available. However, it is possible to introduce support for additional modules. In the snippet below, we show how to allow a `Wormhole` to render a [`WebView`](https://github.com/react-native-webview/react-native-webview):

```diff
const { Provider, Wormhole } = createWormhole({
+  global: {
+    require: (moduleId: string) => {
+      if (moduleId === 'react') {
+        return require('react');
+      } else if (moduleId === 'react-native') {
+        return require('react-native');
+      } else if (moduleId === 'react-native-webview') {
+        return require('react-native-webview);
+      }
+      return null;
+    },
+  },
  verify: async () => true,
});
```

> ⚠️  Version changes to `react`, `react-native` or any other dependencies your Wormholes consume may not be backwards-compatible. It's recommended that APIs serving content to requestors verify the compatibility of the requester version to avoid serving incompatible content. `react-native-wormhole` is **not** a package manager!

#### 🔏 Verification and Signing

Calls to [`createWormhole`](./src/constants/createWormhole.tsx) must at a minimum provide a `verify` function, which has the following declaration:

```typescript
readonly verify: (response: AxiosResponse<string>) => Promise<boolean>;
```

This property is used to determine the integrity of a response, and is responsible for identifying whether remote content may be trusted for execution. If the `async` function does not return `true`, the request is terminated and the content will not be rendered via a `Wormhole`. In the [**Example App**](https://github.com/cawfree/react-native-wormhole/blob/bdb127b21e403dab1fb63894f5d6764a92a002d4/example/App.tsx#L11), we show how content can be signed to determine the authenticity of a response:

```diff
+ import { ethers } from 'ethers';
+ import { SIGNER_ADDRESS, PORT } from '@env';

const { Provider, Wormhole } = createWormhole({
+  verify: async ({ headers, data }: AxiosResponse) => {
+    const signature = headers['x-csrf-token'];
+    const bytes = ethers.utils.arrayify(signature);
+    const hash = ethers.utils.hashMessage(data);
+    const address = await ethers.utils.recoverAddress(
+      hash,
+      bytes
+    );
+    return address === SIGNER_ADDRESS;
+  },
});
```

In this implementation, the server is expected to return a HTTP response header `x-csrf-token` whose value is a [`signedMessage`](https://docs.ethers.io/v5/api/signer/) of the response body. Here, the client computes the expected signing address of the served content using the digest stored in the header.

If the recovered address is not trusted, the script **will not be executed**.

### ✌️ License
[**MIT**](./LICENSE)

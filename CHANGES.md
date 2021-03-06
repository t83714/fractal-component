## 4.4.4

## 4.4.3

- Completely remove @babel/polyfill, it is deprecated as of Babel 7.4.0
- Removed unused @babel/node & @babel/cli from dependencies
- Made tsconfig.json config consistent accross different example apps
- Bug Fix: namespace not deregister `ComponentManager` properly and `namespaceDestroyCallback` is not called

## 4.4.2

- Set package as `sideEffects` free for webpack
- Removed unnecessary config option tsconfig.json

## 4.4.1

- Upgraded lodash to 4.17.15
- Upgrade to babel 7.5.5

## 4.4.0

- Removed `persistState` option from ComponentManager options
- Added  `forceOverwriteInitialState` & `cleanStateDuringDestroy`
- Store Component State data to global store with flat string key
- Replaced Object.values calls with Object.keys
- Auto recycle component auto Id on component destroy / unmount

## 4.3.0

- Introduced `SharedState` that allows to share state data among components via [SharedState](https://t83714.github.io/fractal-component/api/SharedState.html)

## 4.2.1

- Will not fix React Native Bundle to `production` mode (React Native Metro Bundler will set env probably).

## 4.2.0

- Optimise bundle size
- Fixed the `cannot locate os module` issue with React Native's Metro bundler
- Expose `is` utils directly
- Added utils.isInReactNative function
- Build browser ES module import compitible mjs bundle. 

e.g.:
```html
<script type="module" src="https://unpkg.com/fractal-component@latest/dist/fractal-component.esm.mjs"></script>
```
see: https://developers.google.com/web/fundamentals/primers/modules

## 4.1.3

- Fixed: Cleaned up `cachedState` reference when component is unmonted
- ManageableComponentOptions.`name` (undocumented option) renamed to `displayName`
- Will log a warning under development mode ONLY if can't locate an appContainer from context or component \`props\` and a default appContainer is used 

## 4.1.2 

- Performance improvement: reduced unnecessary component state sync 

## 4.1.1

- Added `serialiseAction` & `deserialiseAction` function to `AppContainer`
- Rename `is.managed` to `is.managedComponentInstance` & Logic fixed

## 4.1.0

- Support React [Function Components](https://reactjs.org/docs/components-and-props.html#function-and-class-components) via [React Hooks API](https://reactjs.org/docs/hooks-custom.html)

## 4.0.1

- Added `appContainer` to `ActionForwarder`'s `propTypes`

## 4.0.0

- Added React New Context API Support (Require React 16.6.0 above)
- Improved ComponentManager initialisation process
- Improved SSR support: No need to set `isServerSideRendering` option

## 3.4.1

- fixed incorrect ActionForwarder prop.types definition

## 3.4.2

- effects.take will throw an error if pattern parameter is empty.

## 3.4.1

- Fixed an incompatible issue with redux-saga version `v1.0.0-beta.3`

## 3.4.0

- Removed `toGlobal` & `absoluteDispatchPath` property from `ActionForwarder`

## 3.3.0

- Effects API provided through namespaced saga includes all redux-saga effects creators
- Test typescript definitions
- Added takeMabe & debounce to namespaced Effects 

## 3.2.3

- Fixed: avoid using toString to convert action type in effects
- Fixed: throttle effects not use `pattern` parameter.
- Fixed: effects typescript definitions.

## 3.2.2

-   Moved `symbolToString` to `utils`. Fixed remaining symbol.toString issue for UMD version

## 3.2.1

-   Fixed: avoid symbol.toString to be coverted to ""+ by minifier

## 3.2.0

-   Won't include redux-saga in bundle anymore to avoid UMD version usage issue
-   Reduced bundle size check to 15K
-   Upgrade redux-saga to 1.0.0-beta.2
-   Not rely on redux-saga.is anymore so that UMD version doesn't require another script

## 3.1.2

-   Fixed UMD version reported `process` is undefined
-   Not include `redux-saga` in distribution bundle anymore to avoid UMD use case issue
-   Remove dependency on `@redux-saga/is`

# fractal-component

[![Build Status](https://travis-ci.org/t83714/fractal-component.svg?branch=master)](https://travis-ci.org/t83714/fractal-component)

`fractal-component` helps to encapsulate state store access, actions (messages, events) processing and side-effect management into decoupled container components by introducing the following features to react / redux ecosystem:

- `Multicast` Actions
- Namespaced Actions
- Serializable [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) Action Type 
- `Hot Plug` Redux Reducer & Auto mount / unmount
- `Hot Plug` [Saga](https://redux-saga.js.org/) & Auto mount / unmount
- Namespaced Redux Store
- Auto Component State Management & Redux Store Mapping

With `fractal-component`, you can create fractal reusable [Container Components](https://redux.js.org/basics/usagewithreact#presentational-and-container-components) and construct scalable [fractal architecture](https://www.metropolismag.com/architecture/science-for-designers-scaling-and-fractals/) application while still enjoy the convenience of [Redux dev tool](https://github.com/zalmoxisus/redux-devtools-extension) & predictable single global state store.

To try it out, take a look at the [example app](examples/exampleApp) and find out how `fractal-component` solves the classical [Scalable Architecture Problem](https://github.com/slorber/scalable-frontend-with-elm-or-redux).

To run the example App:

1. Clone this repository
```
git clone https://github.com/t83714/fractal-component.git
```

2. Install Dependencies

We use yarn to manage monorepo workspaces:

```
yarn install
```

3. Run the Example App

At project root directory:
```
yarn start
```

## Getting started

### Install

```
yarn add fractal-component
```
or
```
npm install --save fractal-component
```

Alternatively, you may use the UMD builds from [unpkg](https://unpkg.com/fractal-component) directly in the <script> tag of an HTML page.
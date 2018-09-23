# Beginner Tutorial

## 1. Overview

This tutorial attempts to lead you through the simple process of creating a reusable component `RandomGif` (See below) and how to create a new component `RandomGifPair` by reusing the existing component using `fractal-component`. You might need some basic understandings of [ReactJs](https://reactjs.org/), [Redux](https://redux.js.org/introduction) & [Redux-Saga](https://redux-saga.js.org/). But don't worry if you haven't got a chance to look at those. As `fractal-component` tries to make things simplier by integrating with everyhting, you actually can pick up those concepts along the tutorial.

### 1.1 RandomGif Component

![RandomGif](../assets/BeginnerTutorial/RandomGif.png)

The `RandomGif` Component comes with a main display area that is for a Gif image and a `Get Gif` button. Once the button is clicked, this component will send a request to `https://giphy.com` to get a random gif image and display it in the display area. In the tutorial, we will try to create a highly decoupled component that doesn't make any assumptions on `outside world`. i.e.
- State Structure Independent: It doesn't rely on any particular state structure. The component's state can be moved to anywhere on the application's state tree without impacting its functionality. 
- Presentation Structure Independent: It doesn't require to be used within any particular React Component structure. i.e. It can be moved to anywhere within the Component tree without impact its functionality.
- Action Type Independent: Any action types defined by this component will never be coincidentally same with action types defined by any other components. 

### 1.2 RandomGifPair Component

![RandomGifPair](../assets/BeginnerTutorial/RandomGifPair.png)

The `RandomGifPair` Component will be built by reusing two `RandomGif` components. It comes with two image display areas and a `Get Gif Pair` button. Once the button is clicked, two gif images will be requested from `https://giphy.com` and displayed in the image display area. 

## 2. Initial Setup

Before we start, we need to clone the [Beginner Tutorial Repo](https://github.com/t83714/fractal-component-beginner-tutorial)

You can do so by:

```bash
git clone https://github.com/t83714/fractal-component-beginner-tutorial.git
```

You will want to checkout the `blank-template` branch to follow this tutorial (Complete demo code can be found from `master` branch).

```bash
cd fractal-component-beginner-tutorial
git checkout blank-template
```

To run the blank application, run:

```bash
npm start
```

After the application is started, you can access the application from:
```
http://localhost:3000/
```

you should see `Hello World!` in your browser.

## 3. RandomGif

### 3.1 Get Started
To start our `RandomGif` component, firstly, we need to create a `RandomGif` folder in `src` folder with the following structure:
```
src/
├── RandomGif/
│   ├── actions/
│   ├── reducers/
│   ├── sagas/
│   |── styles/
|   └-- index.js
```
The `index.js` is the entry point of our `RandomGif` component (it's also the [main file](https://docs.npmjs.com/files/package.json#main) when we publish the component as a NPM module). We normaly define the React Component in `index.js` and it also includes all visual presentation in [JSX](https://reactjs.org/docs/introducing-jsx.html) in this file (unless it's a component that comes with very complicated presentation. In which case, you probably want to seperate your JSX code into different files). All other folders will contians:
- `actions` folder : contains action type definitions & action creation functions
- `reducers` folder: contains namespaced reducer functions.  A reducer function will transite component state to next state depends on the actions received.
- `sagas` folder: contains namespaced sagas. A saga is a [generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) that yields [redux-saga effects](https://redux-saga.js.org/docs/basics/DeclarativeEffects.html). You can consider `redux-saga` effects as command desciptions that to be executed at later time by `redux-saga`. Sagas are used for managing component [action / event loop](https://en.wikipedia.org/wiki/Event_loop) and managing effects (e.g. send network requests etc.)
- `styles` folder: contains [`in-component` styls / CSS](https://github.com/cssinjs/jss/blob/master/docs/json-api.md) that managed by lib [JSS](https://github.com/cssinjs/jss). You also can use traditional global CSS stylsheet to style your component. However, use the approach recommended here will make your component fully independent, plus you also get other [benefits](http://cssinjs.org/benefits/)
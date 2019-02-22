# An example app built fractal-component

To run the example App:

1. Clone this repository
```
git clone https://github.com/t83714/fractal-component.git
```

2. Install Dependencies & build

We use yarn to manage monorepo workspaces. Run the following from project root

```
yarn install
yarn build
```

3. Run the Example App

```
cd examples/exampleApp
yarn start
```

## Giphy.com API key

The exampleApp comes with a testing Giphy.com API key in order to retrieve random Gifs from https://giphy.com/. The api key is limted to **40 requests** per hour.

You can create your own API key from https://developers.giphy.com/ and replace the API key in [Component RandomGif](../RandomGif/index.js)
# A Sample RandomGif UI Component

## Overview

This is a sample UI Component built using [fractal-component](https://github.com/t83714/fractal-component) to its component reusability.

## API / Interface
### Component Properties

- apiKey: Giphy.com API key. If not set, default one will be used
- showButton: Boolean. Whether a click button should be shown. You will want to hide the button when you reuse this component to create a new component. e.g. `RandomGifPair`

### Action Interface
#### Outgoing Actions
- NEW_GIF: Send out when a new gif url has been retrieved from Giphy.com
- LOADING_START: Send out when loading is started
- LOADING_COMPLETE: Send out when loading is completed

#### Outgoing Actions
- REQUEST_NEW_GIF: Will attempt to get a random Gif from Giphy.com when receive this action

## Giphy.com API key

This comes with a testing Giphy.com API key in order to retrieve random Gifs from https://giphy.com/. The api key is limted to **40 requests** per hour.

You can create your own API key from https://developers.giphy.com/ and set the API key by `api` property. e.g.
```javascript
<Random apiKey="xxxxxxxx" />
```

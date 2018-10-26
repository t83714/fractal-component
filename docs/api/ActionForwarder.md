## ActionForwarder

- [1. `Overview`](#1-overview)
- [2. `Key Properties`](#2-key-properties)
    - [2.1 `namespacePrefix`](#21-namespaceprefix)
    - [2.2 `pattern`](#22-pattern)
    - [2.3 `relativeDispatchPath`](#23-relativedispatchpath)
    - [2.4 `transformer`](#24-transformer)


### 1. Overview

`ActionForwarder` is a helper `fractal-component` `Container Component` that used to redirect / forward action dispatch flow. It acts as normal React Component and can used anywhere in React Component tree (i.e. its functionality won't be impacted in any way by its position on the React Component Tree). Its `render()` method simply return `null`. Therefore, it won't be rendered by react. Instead, it provides a reconfigurable way to:
- Forward action from one `Namespace path` to another `Namespace path`
- Optionally convert actions to a different type and alter action data

Here is an example of typical usage of `ActionForwarder`:

```jsx
<div>
    <div className={classes.table}>
        <div className={classes.cell}>
            {/*
                RandomGif / RandomGifPair / RandomGifPairPair support apiKey property as well
                You can supply your giphy API key as component property
            */}
            <RandomGif namespacePrefix="exampleApp/RandomGif" />
            {/*Forward `NEW_GIF` actions (and convert to `INCREASE_COUNT`) to ToggleButton for processing*/}
            <ActionForwarder
                namespacePrefix="exampleApp/RandomGif"
                pattern={randomGifActionTypes.NEW_GIF}
                relativeDispatchPath="../ToggleButton/*"
                transformer={counterActionTypes.INCREASE_COUNT}
            />
        </div>
        <div className={classes.cell}>
            <Counter namespacePrefix="exampleApp/Counter" />
        </div>
    </div>
    <div className={classes.table}>
        <div className={classes.cell}>
            <RandomGifPair namespacePrefix="exampleApp/RandomGifPair" />
            {/*Forward `NEW_GIF` actions (and convert to `INCREASE_COUNT`) to ToggleButton for processing*/}
            <ActionForwarder
                namespacePrefix="exampleApp/RandomGifPair"
                pattern={randomGifActionTypes.NEW_GIF}
                relativeDispatchPath="../ToggleButton/*"
                transformer={counterActionTypes.INCREASE_COUNT}
            />
        </div>
        <div className={classes.cell}>
            {/*
                ToggleButton acts as a proxy --- depends on its status
                add an `toggleButtonActive`= true / false field to all actions
                and then forward actions to Counter
            */}
            <ToggleButton
                namespacePrefix="exampleApp/ToggleButton"
                pattern={randomGifActionTypes.INCREASE_COUNT}
                relativeDispatchPath="../Counter/*"
                transformer={counterActionTypes.INCREASE_COUNT}
            />
        </div>
    </div>
    <div>
        <RandomGifPairPair namespacePrefix="exampleApp/RandomGifPairPair" />
        {/*Forward `NEW_GIF` actions (and convert to `INCREASE_COUNT`) to ToggleButton for processing*/}
        <ActionForwarder
            namespacePrefix="exampleApp/RandomGifPairPair"
            pattern={randomGifActionTypes.NEW_GIF}
            relativeDispatchPath="../ToggleButton/*"
            transformer={counterActionTypes.INCREASE_COUNT}
        />
    </div>
</div>
```

The full example can be found from [here](https://github.com/t83714/fractal-component/tree/master/examples/exampleApp).

### 2. Key Properties

The `ActionForwarder`'s functionalities can be configured by its React Component properties. Here is the list of supported properties:

#### 2.1 `namespacePrefix`

You can adjust `ActionForwarder`'s `Full Namespace Path` via this properties to make sure the interested actions can reach your `ActionForwarder`. More info on component namespace can be found from [here](../Introduction/BeginnerTutorial/RandomGif/Namespace.md).

#### 2.2 `pattern`

You can use `pattern` to specify the actions that you are interested in and `ActionForwarder` will only `forward` the actions match your `pattern`. This property can be the followings:

- string "*": match any actions.
- Symbol: e.g. `randomGifActionTypes.NEW_GIF` above: Only match the actions with the symbol as action type.
- Function: the action is matched if pattern(action) is true.
- Array: Each item in the array is matched with beforementioned rules. 
e.g. If you set array below as `pattern`, actions with either type `randomGifActionTypes.NEW_GIF` or `counterActionTypes.INCREASE_COUNT` will be matched.
```javascript
[randomGifActionTypes.NEW_GIF, function(action){
    return action.type === counterActionTypes.INCREASE_COUNT;
}]
```

#### 2.3 `relativeDispatchPath`

You can use `relativeDispatchPath` property to specify the dispatch namespace path that you want `ActionForwarder` to forwarder to.

> Please note: this is a `relative path` that will be calculated based on `ActionForwarder`'s `namespacePrefix` property above.

e.g. if `ActionForwarder`'s `namespacePrefix` is `exampleApp/RandomGifPairPair` and `relativeDispatchPath` is `../ToggleButton/*`, the actual dispatch path will be `exampleApp/ToggleButton/*`.

#### 2.4 `transformer`

You can use `transformer` property to either change the action type or alter action data before forward it. It can be the followings:

- Symbol: Replace the received actions' type to the `Symbol` provided by this property.
- Function: Take the received action as parameter and return an altered action for forwarding.

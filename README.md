condition
============

Advanced condition library for Node, Phantom, RequireJS, CommonJS and the Browser. 

## Changelog

[**View Changelog**](Changelog.md)

## Installation

 - `npm install condition`

## Usage

Getting an instance of `condition` can be different depending on the kind of environment you're in. `condition` supports many different environments and module systems - just try yours, chances are, it'll work. If not, file an issue and I'll work on it.

```js
// Get an instance of condition
var condition = require('condition');

// Wait for a condition to call a function
condition.wait(function() {
    // Do your condition testing here
    return true;
}, function(res) {
    // This is your callback
    // Res is the result from your condition
    console.log('Callback!');
});

// Every time a condition is true, call a function
condition.when(function() {
    // Do your condition testing here
    return true;
}, function(res) {
    // Res is the result from your condition
    return true;
});

// Call a function until a condition becomes true
condition.until(function () {
    // Do your condition testing here
    return true;
}, function (res) {
    // Execute this function until the previous condition returns true
});
```

## Asynchronous Conditions

Sometimes your condition functions will be asynchronous, `condition` supports that too. Simply ask for at least one argument in your condition function, and `condition` will assume that it is an asynchronous condition. Call the first argument that the condition function is passed, with your "result", when you're done.
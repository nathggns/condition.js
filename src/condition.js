(function() {

    /**
     * Polyfill for setImmediate
     * @param  {Function} callback Callback to call
     */
    var tick = (typeof setImmediate !== 'undefined' && function(callback) {

        if (typeof callback !== 'function') {
            // debugger;
        }

        return setImmediate(callback);
    }) || function(callback) {
        return setTimeout(callback, 0);
    };

    /**
     * Weak polyfill for Object.prototype.hasOwnProperty
     * @param  {object} obj  Object to test property
     * @param  {string} prop Property name to test
     * @return {bool}        Does the object have it's own property
     *
     * @todo Make this work in browsers that don't even have window.hasOwnProperty
     */
    var has = function(obj, prop) {

        if (typeof obj.hasOwnProperty !== 'undefined') {
            return obj.hasOwnProperty(prop);
        }

        if (typeof window !== 'undefined' && window.hasOwnProperty) {
            return window.hasOwnProperty.call(obj, prop);
        }

        throw 'Environment does not support hasOwnProperty';
    };

    /**
     * Loop over an array. Return false from a callback to disable looping
     * @param {Array}    arr     The array to loop over
     * @param {Function} cb      The callback to call
     * @param {mixed}    context The optional context to call the callback with
     */
    var each = function(arr, cb, context) {
        for (var i in arr) {
            if (arr.hasOwnProperty(i)) {
                var res = cb.call(context || arr, arr[i], i, arr);

                if (res === false) {
                    break;
                }
            }
        }
    };

    /**
     * This object handles "ticks"
     * @type {Object}
     */
    var ticker = {

        /**
         * This array stores all the callbacks
         * @type {Array}
         */
        callbacks: [],

        /**
         * Have we started the tick loop or not
         * @type {Boolean}
         */
        started: false,

        /**
         * Add a callback to the tick loop
         * @param  {Function} cb The callback to call
         * @return {Function}    Function to remove the callback
         */
        add: function(cb) {

            /**
             * If we haven't started the tick loop loop, start it
             */
            if (!this.started) {
                this.start();
            }

            /**
             * Add an item to the tick loop
             */
            this.callbacks.push(cb);

            /**
             * Get the index of the item we just added
             * @type {Number}
             */
            var index = this.callbacks.length - 1;

            /**
             * Create a "safe" reference to the ticker
             * @type {Object}
             */
            var ticker = this;

            /**
             * Return a function to remove the item from
             * the tick loop
             */
            return function() {
                ticker.remove(index);
            };
        },

        /**
         * This function removes an item from the tick loop
         * by index.
         * @param  {Number}   index The index of the item to remove
         * @return {Function}       The item that we removed
         */
        remove: function(index) {
            /**
             * Remove the item using splice
             * @type {Function}
             */
            var ret = this.callbacks.splice(index, 1);

            /**
             * If we just removed the last item, stop the loop
             */
            if (this.started && !this.callbacks.length) {
                this.stop();
            }

            return ret;
        },

        /**
         * This function "starts" the loop
         */
        start: function() {
            this.started = true;
            return this.loop();
        },

        loop: function() {
            /**
             * If we've ended the loop, stop.
             */
            if (!this.started) return;

            /**
             * Create a "safe" reference to the ticker
             * @type {Object}
             */
            var ticker = this;

            /**
             * "tick"
             */
            this.tick();

            /**
             * After a tick in the browser, restart this function
             */
            return tick(function() {
                return ticker.loop();
            });
        },

        /**
         * This function is called for each tick. Loops over the
         * callbacks and calls them.
         */
        tick: function() {
            each(this.callbacks, function(cb, i) {
                cb.call(this, i);
            }, this);
        },

        /**
         * End the tick loop
         */
        stop: function() {
            this.started = false;
        }
    };

    /**
     * All condition functions go through this function
     * @param {object}   config    Config for the type of condition
     * @param {Function} condition The condition object to call
     * @param {Function} callback  The callback to call
     * @param {Boolean}  autoCheck Should we automatically start watching?
     * 
     * @return {Function} Function to manually check the condition. 
     *                    Has some extra properties too.
     *                    {
     *                        @property isWatching    are we currently watching
     *                        @method   startWatching Start watching
     *                        @method   stopWatching  stop watching
     *                    }
     */
    var condition = function(config, condition, callback, autoCheck) {

        /**
         * Lets default autoCheck to true
         */
        if (typeof autoCheck === 'undefined') {
            autoCheck = true;
        }

        /**
         * We'll set this to a function that does nothing so
         * we don't have to check for the variable when we're
         * trying to remove the ticker.
         */
        var rem = function(){};

        /**
         * Is this an asynchronous condition function?
         * @type {Boolean}
         */
        var isAsync = config.async && condition.length > 0;

        /**
         * We'll create a reference to this so that done knows how
         * to tick, despite defining it afterwards.
         */
        var check;

        /**
         * We'll create a reference to done to as we'll need it before
         * it's actually defined.
         */
        var done;

        /**
         * This sort of controls starting and stopping
         */
        check = function() {
            /**
             * Get the result from the condition function.
             * @type {mixed}
             */
            var result = condition(config.async && done);

            /**
             * If we're not calling asynchronously, call the done function
             * straight away.
             */
            if (!isAsync) {
                done(result);
            }
        };

        /**
         * Are we watching or not?
         *
         * @type {Boolean}
         */
        check.isWatching = false;

        /**
         * This starts a continous tick
         */
        check.startWatching = function() {
            check.isWatching = true;

            /**
             * Call the tick differently depending on if we're
             * asynchronous or not.
             */
            if (isAsync) {
                setTimeout(check);
            } else {
                rem = ticker.add(check);
            }
        };

        /**
         * This stops watching
         */
        check.stopWatching = function() {
            check.isWatching = false;
            rem();
        };

        /**
         * The function called when the condition has finished running
         * Needs to be in a seperate function so we can support
         * async conditions
         * 
         * @param  {any} result Result of the condition function.
         */
        done = function(result) {
            // We only want to call the callback if the condition result evalulates as true
            if (result) {
                // If we're doing the "until" type of condition, end if result is true
                if (config.type === 'until') {
                    return rem();
                }

                callback(result);

                // If we're doing the "wait" type of condition, we can safely end here
                if (config.type === 'wait') {
                    return rem();
                }
            } else if (!result && config.type === 'until') {
                callback(result);
            }

            /**
             * If we're doing an asynchronous condition function, "tick"
             */
            if (isAsync && check.isWatching) {
                tick(check);
            }
        };

        check.startWatching();

        return check;
    };

    // Time to build the condition object with the different types
    var Condition = {};

    // JSHint complains about making functions within loops,
    // get around that.
    var generate_condition = function(type) {
        return function() {
            // arguments will be the array to be "unshifted":
            // the {type, async} object will be pushed as the first
            // item in arguments
            Array.prototype.unshift.call(arguments, {
                type: type,
                async: true
            });

            return condition.apply(this, arguments);
        };
    };

    // The types of condition objects we have
    var types = ['wait', 'when', 'until'];

    // Assign all the types to the condition object
    for (var k in types) {
        if (has(types, k)) {
            Condition[types[k]] = generate_condition(types[k]);
        }
    }

    // Assign our special helpers to the condition object too.
    Condition.condition = condition;
    Condition.tick = tick;
    Condition.has = has;

    // This is the bit where we assign our Condition object in different ways
    if (typeof module !== 'undefined' && 'exports' in module) {
        // Node
        module.exports = Condition;
    } else if (typeof define !== 'undefined') {
        // CommonJS
        define(function(require, exports, module) {
            module.exports = Condition;
        });
    } else if (typeof window !== 'undefined') {
        // Browser
        window.condition = Condition;
    }
})();

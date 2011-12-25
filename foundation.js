
// start metric
var start = (new Date()).getTime(),

    // scripts booted
    booted = [],

    /**
     * js
     * 
     * Function to accomodate booting js files with callback firing. Boots
     * scripts in sequence/series, rather than in parallel.
     * 
     * @access public
     * @param  string|Object assets
     * @param  Function callback
     * @return void
     */
    js = function(assets, callback) {

        /**
         * __contains
         * 
         * Peforms a check against an array to see if it contains another
         * object.
         * 
         * @access private
         * @param  Array arr
         * @param  String query
         * @return void
         */
        var __contains = function(arr, query) {
                for(var x = 0, l = arr.length; x < l; ++x) {
                    if(arr[x] === query){
                        return true;
                    }
                }
                return false;
            },

            /**
             * __boot
             * 
             * Performs a script boot and runs the callback after completion.
             * 
             * @access private
             * @param  string src
             * @param  Function callback
             * @return void
             */
            __boot = function(src, callback) {
                var script = document.createElement('script'),
                    scripts = document.getElementsByTagName('script'),
                    length = scripts.length,
                    loaded = function() {
                        try {
                            callback && callback();
                        } catch(exception) {
                            log('[Caught Exception]', exception);
                        }
                    };
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('charset', 'utf-8');
                if (script.readyState) {
                    script.onreadystatechange = function() {
                        if (
                            script.readyState === 'loaded'
                            || script.readyState === 'complete'
                        ) {
                            script.onreadystatechange = null;
                            loaded();
                        }
                    };
                } else {
                    script.onload = loaded;
                }
                script.setAttribute('src', src);
                document.body.insertBefore(script, scripts[(length - 1)].nextSibling);
            };

        // recursive booting
        if (typeof assets === 'string') {
            if (__contains(booted, assets)) {
                callback();
            } else {
                booted.push(assets);
                __boot(assets, callback);
            }
        } else if (assets.constructor === Array) {
            if (assets.length !== 0) {
                js(assets.shift(), function() {
                    js(assets, callback);
                });
            } else {
                try {
                    callback && callback();
                } catch(exception) {
                    log('[Caught Exception]', exception);
                }
            }
        }
    },

    /**
     * log
     * 
     * Safe console-logging.
     * 
     * @access public
     * @return void
     */
    log = function() {
        if (
            typeof(console) !== 'undefined'
            && console
            && console.log
        ) {
            var args = arguments.length > 1 ? arguments : arguments[0];
            console.log(args);
        }
    },

    // queueing singleton/closure
    queue = (function() {
        var stack = [];
        return {

            /**
             * push
             * 
             * Pushes <task> (a function) to the <stack>-closure.
             * 
             * @access public
             * @param  Function task
             * @return void
             */
            push: function(task) {
                stack.push(task);
            },

            /**
             * process
             * 
             * Runs the queued up functions.
             * 
             * @access public
             * @return void
             */
            process: function() {
                var task;
                while (task = stack.shift()) { task(); }
            }
        };
    })(),

    /**
     * ready
     * 
     * Registers a function to be fired when the document is ready.
     * 
     * @see    http://javascript.nwbox.com/ContentLoaded/contentloaded.js
     * @access public
     * @param  Function callback
     * @return void
     */
    ready = function(callback) {
        var done = false,
            top = true,
            doc = window.document,
            root = doc.documentElement,
    
            add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
            rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
            pre = doc.addEventListener ? '' : 'on',
    
            init = function(e) {
                if (e.type === 'readystatechange' && doc.readyState !== 'complete') {
                    return;
                }
                (e.type === 'load' ? window : doc)[rem](pre + e.type, init, false);
                if (!done && (done = true)) {
                    callback.call(window, e.type || e);
                }
            },
    
            poll = function() {
                try {
                    root.doScroll('left');
                } catch (e) {
                    setTimeout(poll, 50);
                    return;
                }
                init('poll');
            };
    
        if (doc.readyState === 'complete') {
            callback.call(window, 'lazy');
        } else {
            if (doc.createEventObject && root.doScroll) {
                try {
                    top = !window.frameElement;
                } catch (e) {}
                if (top) {
                    poll();
                }
            }
            doc[add](pre + 'DOMContentLoaded', init, false);
            doc[add](pre + 'readystatechange', init, false);
            window[add](pre + 'load', init, false);
        }
    };

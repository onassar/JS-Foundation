/**
 * <Foundation.js>
 * 
 * A small-collection of variables/functions that ought to be included inline in
 * a document. Functionality includes script booting, logging, function queuing
 * and document ready function/callback firing.
 * 
 * @see    <http://jscompress.com/>
 * @author Oliver Nassar <onassar@gmail.com>
 */

// start metric
var start = (new Date()).getTime(),

    // scripts booted
    booted = [],

    /**
     * Boolean tracking whether the "required" scripts have been
     * included for booting.
     */
    included = false,

    // scripts which must be for further <foundation> usage
    required = [],

    /**
     * js
     * 
     * Function to accomodate booting js files with callback firing. Boots
     * scripts in sequence/series, rather than in parallel.
     * 
     * @access  public
     * @param   string|Object assets
     * @param   Function callback
     * @return  void
     * @example
     * <code>
     *     js(
     *         ['/static/js/c.js'],
     *         function() {
     *             log('Booted!');
     *         }
     *     );
     * </code>
     */
    js = function(assets, callback) {

        // if no arguments passed, no assets or callback
        if (arguments.length === 0) {
            callback = function() {};
            assets = [];
        }
        /**
         * Otherwise if only one argument is defined, presume it's the callback. This case
         * is allowed when a <require> method is called against the foundation
         * library, but no script paths are passed into the <js> method.
         */
        else if (arguments.length === 1) {
            callback = assets;
            assets = [];
        }

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
        var __boot = function(src, callback) {
                var script = document.createElement('script'),
                    scripts = document.getElementsByTagName('script'),
                    length = scripts.length,
                    loaded = function() {
                        try {
                            callback && callback();
                        } catch(exception) {
                            __error(exception);
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
            },

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
            __contains = function(arr, query) {
                for(var x = 0, l = arr.length; x < l; ++x) {
                    if(arr[x] === query){
                        return true;
                    }
                }
                return false;
            },

            /**
             * __error
             * 
             * Handles logging out of an error (eg. TypeError) notice and
             * stack.
             * 
             * @access private
             * @param  mixed exception
             * @return void
             */
            __error = function(exception) {
                log('Caught Exception:');
                log(exception.stack);
                log('');
            };

        // check if the required scripts have been included
        if (included === false) {

            // reset assets as array
            if (typeof assets === 'string') {
                assets = [assets];
            }

            // concat required scripts as part of defined assets
            assets = assets.concat(required);

            // mark that required assets have been included
            included = true;
        }

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
                    __error(exception);
                }
            }
        }
    },

    /**
     * log
     * 
     * Safe console-logging.
     * 
     * @access  public
     * @return  void
     * @example
     * <code>
     *     log('Hello World!');
     * </code>
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
             * @access  public
             * @param   Function task
             * @return  void
             * @example
             * <code>
             *     queue.push(function() {
             *         log('Callback executed.');
             *     });
             * </code>
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
            },

            /**
             * unshift
             * 
             * Pushes <task> (a function) to the beginning of the
             * <stack>-closure.
             * 
             * @access  public
             * @param   Function task
             * @return  void
             * @example
             * <code>
             *     queue.unshift(function() {
             *         log('Callback executed.');
             *     });
             * </code>
             */
            unshift: function(task) {
                stack.unshift(trask);
            }
        };
    })(),

    /**
     * ready
     * 
     * Registers a function to be fired when the document is ready.
     * 
     * @see     http://javascript.nwbox.com/ContentLoaded/contentloaded.js
     * @access  public
     * @param   Function callback
     * @return  void
     * @example
     * <code>
     *     ready(function() {
     *         js(
     *             ['/static/js/a.js', '/static/js/b.js'],
     *             function() {
     *                 log('pre: ', (new Date()).getTime() - start);
     *                 queue.process();
     *                 log('post: ', (new Date()).getTime() - start);
     *             }
     *         );
     *     });
     * </code>
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

                    /**
                     * Originally passed event-type (eg. DOMContentLoaded or
                     * readystatechange) to callback. Caused problems when
                     * passing <js> directly as callback (since it would then
                     * set the <assets> argument to the event-type string).
                     * 
                     * Thus, no arguments getting passed to the callback :)
                     */
                    callback();
                    // callback.call(window, e.type || e);
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
    },

    /**
     * require
     * 
     * Sets an asset, or multiple, as requirements for the page.
     * 
     * @access  public
     * @param   string|Object assets
     * @return  void
     * @example
     * <code>
     *     require(
     *         ['/static/js/a.js']
     *     );
     * </code>
     */
    require = function(assets) {
        if (typeof assets === 'string') {
            assets = [assets];
        }
        required = required.concat(assets);
    };


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
             * Pushs <task> (a function) to the <stack>-closure.
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
    })();

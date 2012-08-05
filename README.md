JS-Foundation
===
This small script (with a
[minified](https://github.com/onassar/JS-Foundation/blob/master/minified.js)
version available) includes basic functionality to speed up the perceived
rendering time of a page by putting off javascript-asset-loading until after the
page is ready.

Additionally, it provides a cross-browser console logging function and a
queue-singleton to queue functions up to be executed after the page, and
it&#039;s JavaScript dependencies have been loaded/booted in.

### Booting Example

The following example showcases the straightforward way to boot a static js
file, and after it&#039;s been booted, fire a callback.

``` javascript
js(
    ['/static/js/c.js'],
    function() {
        log('Booted!');
    }
);
```

### Usage
I use this script in the `head` of all the pages I work on. It&#039;s the only
JS the page gets booted with. Everything else gets loaded in through the `js`
function.

It&#039;s part of my [HTML-Blueprint](https://github.com/onassar/HTML-Blueprint)
library for that reason; really light weight but powerful.

### Window Properties
As a result of using this library, the following properties are added to the
window object:

* `booted` An array of all the scripts that were booted
* `included` Whether or not scripts that were defined using the `require` method
have been included within the scope of the booting sequence (this is
operational; shouldn't need to be accessed)
* `required` Scripts that must be loaded before any functions are executed in
the `queue` `list` stack
* `queue` A closure that provides two methods for queueing and executing
functions after the page is ready for processing

### Methods
The following methods are available for use with this foundation library.

* `js` A method accepting one or two properties. If one is passed in, it presumes
that it is the callback, and will be executed after all the scripts defined
using the `require` method have been loaded. If two are parameters are defined,
the first is assumed to be a single or multiple (array) of assets that should be
loaded before the callback (second) function is executed)
* `log` A logging method that prevents errors in browsers where the `console`
object is not available, or the `log` method on that object is not available
* `queue.push` A method that accepts a single function as it's parameter, which
will be executed (not automatically; see next method) after the page is ready
* `queue.process` A method which processes all the functions in the `queue`
stack, as added through usage of the `queue.push` method
* `ready` A function, accepting a callback, which is executed after the page is
ready for processing
* `require` A function, which accepts a string of array of script resources,
which are included for booting in the `js` method listed above, before the page
is marked as ready for further processing

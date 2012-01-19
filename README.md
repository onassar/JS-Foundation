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

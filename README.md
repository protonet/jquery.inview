# Element 'inview' Event Plugin

Event that is fired when an element enters or leaves the user's viewport.

* **Author:** [Christopher Blum](http://twitter.com/ChristopherBlum)
* **Original idea and concept by:** [Remy Sharp](http://remysharp.com/2009/01/26/element-in-view-event-plugin/)
* **Forked from:** [https://github.com/zuk/jquery.inview/](https://github.com/zuk/jquery.inview/)
* **Requires:** jQuery 1.8+

## Usage

The script makes use of the new $.contains method - so it will only work with jQuery 1.8 upwards. If you need to use it with older versions of jQuery, drop a comment, and I'll post an alternative.

The event will only fire when the element comes in to view of the viewport, and out of view. It won't keep firing if the user scrolls and the element remains in view.

The variable after the event argument indicates the visible state in the viewport.

    $('div').on('inview', function(event, isInView) {
      if (isInView) {
        // element is now visible in the viewport
      } else {
        // element has gone out of viewport
      }
    });

To stop listening for the event - simply unbind:

    $('div').off('inview');

Remember you can also bind once:

    $('div').one('inview', fn);

Live events

Yep, inview events can also be used with .on/.delegate methods.
*Please note that this could slow down your app when the selector is too complex and/or matches a huge set of elements.*
The following code snippet only loads images when they appear in the browser's viewport.

    // Assuming that all images have set the 'data-src' attribute instead of the 'src'attribute
    $("body").on("inview", "img[data-src]", function() {
      var $this = $(this);
      $this.attr("src", $this.attr("data-src"));
      // Remove it from the set of matching elements in order to avoid that the handler gets re-executed
      $this.removeAttr("data-src");
    });

## Use cases

* Reduce http requests and traffic on server by loading assets (images, javascript, html, ...) only when they are visible to the user
* Endless scrolling (twitter-like)
* Tracking (eg. to see whether a user has read an entire article)
* ...

## Browser Compatibility

The Test Suite succeeds in the following browsers that were tested:

* Firefox 3+
* Safari 3+
* Chrome 7+
* Opera 10+
* IE 6+
* Mobile Safari on iPad 4.2.2

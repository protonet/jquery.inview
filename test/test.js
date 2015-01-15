QUnit.config.reorder = false;

window['jQuery 1.11'].each(['jQuery 1.4', 'jQuery 1.5', 'jQuery 1.6', 'jQuery 1.7', 'jQuery 1.8', 'jQuery 1.9', 'jQuery 1.10', 'jQuery 1.11'], function(i, version) {
  var jQuery  = window[version],
      $       = jQuery;

  QUnit.module('jquery.inview - ' + version + ' (' + $.fn.jquery + ')', {
    beforeEach: function() {
      $(window).scrollTop(0).scrollLeft(0);

      this.size = 20000;
      this.container = $('<div>', {
        "class": 'test-container'
      }).appendTo("body");

      this.element = $('<div>', {
        html: 'testing ...',
        "class": 'test-element'
      }).css({
        background: '#eee',
        width:      '50px',
        height:     '50px',
        position:   'absolute'
      });

      this.element2 = this.element.clone();
    },

    afterEach: function() {
      $(window).scrollTop(0).scrollLeft(0);

      this.container.remove();
      this.element.remove();
      this.element2.remove();
    }
  });


  QUnit.test('Check vertical scrolling', function(assert) {
    var done = assert.async();
    assert.expect(5);

    var element = this.element,
        firstCall,
        secondCall,
        thirdCall,
        inView;

    element.css({ left: 0, top: this.size - 50 + 'px' });
    element.appendTo('body');
    element.bind('inview.firstCall', function() { firstCall = true; });

    setTimeout(function() {
      $(window).scrollTop(0).scrollLeft(0);
      assert.ok(!firstCall, 'inview shouldn\'t be triggered initially when the element isn\'t in the viewport');
      element.unbind('inview.firstCall');
      element.bind('inview.secondCall', function(event, inViewParam) {
        secondCall = true;
        inView = inViewParam;
      });

      $(window).scrollTop(9999999);

      setTimeout(function() {

        assert.ok(secondCall, 'Triggered handler after element appeared in viewport');
        assert.ok(inView, 'Parameter, indicating whether the element is in the viewport, is set to "true"');
        element.unbind('inview.secondCall');
        element.bind('inview.thirdCall', function(event, inViewParam) {
          thirdCall = true;
          inView = inViewParam;
        });

        $(window).scrollTop(0).scrollLeft(0);

        setTimeout(function() {
          assert.ok(thirdCall, 'Triggered handler after element disappeared in viewport');
          assert.strictEqual(inView, false, 'Parameter, indicating whether the element is in the viewport, is set to "false"');
          done();
        }, 1000);

      }, 1000);

    }, 1000);
  });


  QUnit.test('Check horizontal scrolling', function(assert) {
    var done = assert.async();
    assert.expect(5);

    var element = this.element,
        firstCall,
        secondCall,
        thirdCall,
        inView;

    element.css({ top: 0, left: this.size - 50 + 'px' });
    element.appendTo('body');
    element.bind('inview.firstCall', function() { firstCall = true; });

    setTimeout(function() {
      $(window).scrollTop(0).scrollLeft(0);

      assert.ok(!firstCall, 'inview shouldn\'t be triggered initially when the element isn\'t in the viewport');
      element.unbind('inview.firstCall');
      element.bind('inview.secondCall', function(event, inViewParam) {
        secondCall = true;
        inView = inViewParam;
      });

      $(window).scrollLeft(9999999);

      setTimeout(function() {

        assert.ok(secondCall, 'Triggered handler after element appeared in viewport');
        assert.ok(inView, 'Parameter, indicating whether the element is in the viewport, is set to "true"');
        element.unbind('inview.secondCall');
        element.bind('inview.thirdCall', function(event, inViewParam) {
          thirdCall = true;
          inView = inViewParam;
        });

        $(window).scrollTop(0).scrollLeft(0);

        setTimeout(function() {
          assert.ok(thirdCall, 'Triggered handler after element disappeared in viewport');
          assert.strictEqual(inView, false, 'Parameter, indicating whether the element is in the viewport, is set to "false"');
          done();
        }, 1000);

      }, 1000);

    }, 1000);
  });


  QUnit.test('Move element into viewport without scrolling', function(assert) {
    var done = assert.async();
    assert.expect(3);

    var element = this.element, calls = 0;

    element
      .css({ left: '-500px', top: 0 })
      .appendTo('body')
      .bind('inview', function(event) { calls++; });

    setTimeout(function() {

      assert.equal(calls, 0, 'Callback hasn\'t been fired since the element isn\'t in the viewport');
      element.css({ left: 0 });

      setTimeout(function() {

        assert.equal(calls, 1, 'Callback has been fired after the element appeared in the viewport');
        element.css({ left: '10000px' });

        setTimeout(function() {

          assert.equal(calls, 2, 'Callback has been fired after the element disappeared from viewport');
          done();

        }, 1000);

      }, 1000);

    }, 1000);
  });


  QUnit.test('Check whether element which isn\'t in the dom tree triggers the callback', function(assert) {
    var done = assert.async();
    assert.expect(0);

    this.element.bind('inview', function(event, isInView) {
      assert.ok(false, 'Callback shouldn\'t be fired since the element isn\'t even in the dom tree');
      done();
    });

    setTimeout(function() { done(); }, 1000);
  });


  QUnit.test('Check whether element which is on the top outside of viewport is not firing the event', function(assert) {
    var done = assert.async();
    assert.expect(0);

    this.element.bind('inview', function(event, isInView) {
      assert.ok(false, 'Callback shouldn\'t be fired since the element is outside of viewport');
      done();
    });

    this.element.css({
      top: '-50px',
      left: '50px'
    }).appendTo('body');

    setTimeout(function() { done(); }, 1000);
  });


  QUnit.test('Check whether element which is on the left outside of viewport is not firing the event', function(assert) {
    var done = assert.async();
    assert.expect(0);

    this.element.bind('inview', function(event, isInView) {
      assert.ok(false, 'Callback shouldn\'t be fired since the element is outside of viewport');
      done();
    });

    this.element.css({
      top: '50px',
      left: '-50px'
    }).appendTo('body');

    setTimeout(function() { done(); }, 1000);
  });


  QUnit.test('Check visiblePartX & visiblePartY parameters #1', function(assert) {
    var done = assert.async();
    assert.expect(2);

    this.element.css({
      top: '-25px',
      left: '-25px'
    }).appendTo('body');

    this.element.bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
      assert.equal(visiblePartX, 'right', 'visiblePartX has correct value');
      assert.equal(visiblePartY, 'bottom', 'visiblePartY has correct value');
      done();
    });
  });


  QUnit.test('Check visiblePartX & visiblePartY parameters #2', function(assert) {
    var done = assert.async();
    assert.expect(2);

    this.element.css({
      top: '0',
      left: '-25px'
    }).appendTo('body');

    this.element.bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
      assert.equal(visiblePartX, 'right', 'visiblePartX has correct value');
      assert.equal(visiblePartY, 'both', 'visiblePartY has correct value');
      done();
    });
  });


  QUnit.test('Check visiblePartX & visiblePartY parameters #3', function(assert) {
    var done = assert.async();
    assert.expect(2);

    this.element.css({
      top: '0',
      left: '0'
    }).appendTo('body');

    this.element.bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
      assert.equal(visiblePartX, 'both', 'visiblePartX has correct value');
      assert.equal(visiblePartY, 'both', 'visiblePartY has correct value');
      done();
    });
  });


  // the live event was removed in jQuery version 1.9
  if (window['jQuery 1.11'].versioncompare('1.9', $.fn.jquery) > 0) {
    QUnit.test('Check "live" events', function (assert) {
      var done = assert.async();
      assert.expect(3);

      var that = this,
          elems = $("body .test-container > div.test-element");
      elems.live("inview", function (event) {
        elems.die("inview");
        assert.ok(true, "Live event correctly fired");
        assert.equal(event.currentTarget, that.element[0], "event.currentTarget correctly set");
        assert.equal(this, that.element[0], "Handler bound to target element");
        done();
      });

      this.element.css({
        top: '0',
        left: '0'
      }).appendTo(this.container);
    });
  }


  // the one event was introduced in jQuery version 1.7
  if (window['jQuery 1.11'].versioncompare('1.7', $.fn.jquery) <= 0) {
    QUnit.test('Check "one" events', function (assert) {
      var done = assert.async();
      assert.expect(3);

      var that = this,
          elems = $("body .test-container > div.test-element");
      this.element.one("inview", elems, function (event) {
        assert.ok(true, "Live event correctly fired");
        assert.equal(event.currentTarget, that.element[0], "event.currentTarget correctly set");
        assert.equal(this, that.element[0], "Handler bound to target element");
        done();
      });

      this.element.css({
        top: '0',
        left: '0'
      }).appendTo(this.container);
    });
  }


  QUnit.test('Check "delegate" events', function(assert) {
    var done = assert.async();
    assert.expect(3);

    var that = this;
    this.container.delegate(".test-element", "inview", function(event) {
      assert.ok(true, "Delegated event correctly fired");
      assert.equal(event.currentTarget, that.element[0], "event.currentTarget correctly set");
      assert.equal(this, that.element[0], "Handler bound to target element");
      done();
    });

    this.element.css({
      top: '0',
      left: '0'
    }).appendTo(this.container);
  });


  QUnit.test('Check namespaced "delegate" events', function(assert) {
    var done = assert.async();
    assert.expect(1);

    this.container.delegate(".test-element", "inview.foo", function(event) {
      assert.ok(true, "Delegated event correctly fired");
      done();
    });

    this.element.css({
      top: '0',
      left: '0'
    }).appendTo(this.container);
  });


  QUnit.test('Check multiple elements', function(assert) {
    var done = assert.async();
    assert.expect(2);

    var i = 0;

    this.element.add(this.element2).css({
      top: '0',
      left: '0'
    }).appendTo(this.container);

    $('.test-element').bind('inview', function() {
      assert.ok(true);
      if (++i == 2) {
        done();
      }
    });
  });


  if (!("ontouchstart" in window)) {
    QUnit.test('Scroll to element via focus()', function(assert) {
      // This test will fail on iOS
      var done = assert.async();
      assert.expect(1);

      var $input = $("<input>").css({
        position: "absolute",
        top: "7000px",
        left: "5000px"
      }).appendTo(this.container);

      $input.bind('inview', function() {
        assert.ok(true);
        $input.remove();
        done();
      });

      setTimeout(function() {
        $input.focus();
      }, 1000);
    });
  }
});

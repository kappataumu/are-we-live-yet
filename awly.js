var Awly = (function(){

  var target = document.getElementsByTagName('img')[0];
  if (typeof(target) != 'undefined' && target != null) {
    target = target.src;
  } else {
    target = false;
  }

  var config = {
    asset: target,
    cssClassName: 'awly',
    ttfbProdThreshold: 25,
    verbose: false,
  };

  var _init = function(options) {
    for (var opt in options) {
      config[opt] = options[opt];
    }
    debug('Initialized.');

    if (!config.asset) {
      debug('Unable to find any <img> in the document.');
      debug('You need to explicitly set the asset to be timed.');
      return;
    }

    _measure_ttfb(config.asset)
  }

  var _measure_ttfb = function(file) {
    var measure = function(el) {
      return function() {
        var timer = window.performance.getEntriesByName(el.src);
        var responseStart = timer[0]['responseStart'].toFixed(0);
        var requestStart  = timer[0]['requestStart'].toFixed(0);
        var ttfb = responseStart - requestStart;
        _show_panel(ttfb);
      }
    };
    var el = new Image;
    el.onload = measure(el);
    el.src = file + _cacheBuster();
  };

  var _show_panel = function(ttfb) {
    debug('TTFB: '+ config.asset + ' ' + ttfb + 'ms');

    var is_production = ttfb < config.ttfbProdThreshold;
    if (!config.verbose && is_production) {
      return;
    }

    // http://stackoverflow.com/a/524721
    var css = is_production ? _cssText('green') : _cssText('red'),
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    var panel = document.createElement('div');
    panel.className = config.cssClassName;
    panel.innerHTML += ttfb + 'ms';

    head.appendChild(style);
    document.body.appendChild(panel);
  };

  var _cssText = function(bgColor) {
    return '.' + config.cssClassName + ' {' +
        'position: fixed;' +
        'bottom: 0;' +
        'right: 0;' +
        'text-align: center;' +
        'line-height: 40px;' +
        'color: white;' +
        'width: 80px;' +
        'height: 40px;' +
        'opacity: 0.3;' +
        'z-index: 100;' +
        'background:'  + bgColor + ';';
  };

  var _cacheBuster = function() {
    return '?awly=' + Math.random() + new Date().getTime();
  };

  var debug = function(msg) {
    if (config.verbose) {
      console.debug('[AWLY] %s', msg);
    }
  }

  return {
    run: function(options) {
      _init(options);
    }
  }
})();

// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
$(document).ready(function () {
  var btn = $(".button");
  btn.click(function () {
    btn.toggleClass("paused");
    return false;
  });
});
var rangeSlider = document.getElementById("rs-range-line");
var rangeBullet = document.getElementById("rs-bullet");
var index = 0;
d3.json("https://raw.githubusercontent.com/UW-CSE442-WI20/A3-game-dev-pubg/master/src/game_data.json").then(function (dat) {
  function draw() {
    // define the svg
    d3.selectAll("svg > *").remove();
    document.getElementById("controller").style.visibility = "visible";
    d3.select("#play_pause_button").classed("paused", false);
    var rect = {
      height: 20,
      marginV: 10,
      marginH: 10,
      marginT: 40
    };
    var font = {
      height: 10,
      margin: 100
    };
    var svg = d3.select("svg").append("g");
    var stop = false; // load the initial data

    var dataEntry = dat[index];
    var dataValue = dataEntry["entities"].sort(function (x, y) {
      return y.total_global_sale - x.total_global_sale;
    });
    var maxSale = dataValue[0].total_global_sale;
    var maxHeight = (rect.marginV + rect.height) * (dataValue.length - 1) + rect.marginT;
    var comment = svg.append("text").attr("x", 300).attr("y", maxHeight).attr("fill", "grey").text(dataEntry.year).style("font-size", "40"); // load data to svg

    var groups = svg.selectAll("g").data(dataValue).enter().append("g").style("cursor", "pointer"); // load labels and rects to svg

    var labels = groups.append("text").text(function (d) {
      return d.publisher;
    }).attr("id", "label").attr("x", rect.marginH).style("font-size", "".concat(font.height, "px")).on("click", function (d) {
      document.getElementById("controller").style.visibility = "hidden";
      stop = true;
      clearInterval(intervalId);
      d3.selectAll("svg > *").remove();
      svg = d3.select("svg").append("g");
      dataEntry = d;
      dataValue = dataEntry["game"].sort(function (x, y) {
        return y.game_global_sale - x.game_global_sale;
      });
      maxSale = dataValue[0].game_global_sale;
      maxHeight = (rect.marginV + rect.height) * (dataValue.length - 1) + rect.marginT;
      groups = svg.selectAll("g").data(dataValue).enter().append("g").style("cursor", "pointer");
      var gamelabels = groups.append("text").text(function (d) {
        return d.game_name;
      }).attr("x", rect.marginH).style("font-size", "".concat(font.height, "px")).on("click", function () {
        return draw();
      });
      var rects = groups.append("rect").attr("x", rect.marginH + font.margin).attr("height", rect.height);
      var scale = d3.scaleLinear().domain([0, maxSale]).range([0, 300]);
      gamelabels.data(dataValue, function (d) {
        return d.game_name;
      }).transition().duration(600).attr("y", function (_, i) {
        return (rect.marginV + rect.height) * i + rect.marginT + rect.height / 2;
      });
      rects.data(dataValue, function (d) {
        return d.game_name;
      }).transition().duration(600).attr("y", function (_, i) {
        return (rect.marginV + rect.height) * i + rect.marginT;
      }).attr("width", function (d) {
        return scale(d.game_global_sale);
      });
      var xScale = d3.scaleLinear().domain([0, maxSale]).range([0, 300]);
      var xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format(".1f"));
      svg.append("g").attr("transform", "translate(" + (rect.marginH + font.margin) + "," + (maxHeight + rect.height + rect.marginV) + ")").call(xAxis);
    });
    var rects = groups.append("rect").attr("id", "rect").attr("x", rect.marginH + font.margin).attr("height", rect.height); // type means the which radio button is checked

    function updateElements(type) {
      var scale = d3.scaleLinear().domain([0, maxSale]).range([0, 300]);
      labels.data(dataValue, function (d) {
        return d.publisher;
      }).transition().duration(600).attr("y", function (_, i) {
        return (rect.marginV + rect.height) * i + rect.marginT + rect.height / 2;
      });

      if (type === "total_global_sale") {
        rects.data(dataValue, function (d) {
          return d.publisher;
        }).transition().duration(600).attr("y", function (_, i) {
          return (rect.marginV + rect.height) * i + rect.marginT;
        }).attr("width", function (d) {
          return scale(d.total_global_sale);
        });
      } else if (type === "average_global_sale") {
        rects.data(dataValue, function (d) {
          return d.publisher;
        }).transition().duration(600).attr("y", function (_, i) {
          return (rect.marginV + rect.height) * i + rect.marginT;
        }).attr("width", function (d) {
          return scale(d.average_global_sale);
        });
      } else if (type === "average_user_score") {
        rects.data(dataValue, function (d) {
          return d.publisher;
        }).transition().duration(600).attr("y", function (_, i) {
          return (rect.marginV + rect.height) * i + rect.marginT;
        }).attr("width", function (d) {
          return scale(d.average_user_score);
        });
      } else if (type === "average_critic_score") {
        rects.data(dataValue, function (d) {
          return d.publisher;
        }).transition().duration(600).attr("y", function (_, i) {
          return (rect.marginV + rect.height) * i + rect.marginT;
        }).attr("width", function (d) {
          return scale(d.average_critic_score);
        });
      } // rerender the axis


      var xScale = d3.scaleLinear().domain([0, maxSale]).range([0, 300]);

      if (type === "average_user_score" || type === "average_critic_score") {
        xScale = d3.scaleLinear().domain([0, 100]).range([0, 300]);
      }

      var xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d"));

      if (type === "average_global_sale") {
        xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format(".1f"));
      }

      svg.append("g").attr("id", "axis").attr("transform", "translate(" + (rect.marginH + font.margin) + "," + (maxHeight + rect.height + rect.marginV) + ")").call(xAxis);
    }

    if (!stop) updateElements("total_global_sale");

    function update(i, type) {
      document.getElementById("year_slider").value = i % dat.length + 2003;

      if (!stop) {
        // update the data and year
        dataEntry = dat[i];

        if (type === "total_global_sale") {
          dataValue = dataEntry["entities"].sort(function (x, y) {
            return y.total_global_sale - x.total_global_sale;
          });
          maxSale = dataValue[0].total_global_sale;
        } else if (type === "average_global_sale") {
          dataValue = dataEntry["entities"].sort(function (x, y) {
            return y.average_global_sale - x.average_global_sale;
          });
          maxSale = dataValue[0].average_global_sale;
        } else if (type === "average_user_score") {
          dataValue = dataEntry["entities"].sort(function (x, y) {
            return y.average_user_score - x.average_user_score;
          });
          maxSale = dataValue[0].average_user_score;
        } else if (type === "average_critic_score") {
          dataValue = dataEntry["entities"].sort(function (x, y) {
            return y.average_critic_score - x.average_critic_score;
          });
          maxSale = dataValue[0].average_critic_score;
        }

        comment.text(dataEntry.year); // remove the old axis

        d3.select("#axis").remove();
        updateElements(type);
      }
    }

    var intervalId;

    function updateGraphType(type) {
      index = 0;
      intervalId = setInterval(function () {
        return update(index++ % dat.length, type);
      }, 1300);
    } // radio button are selected


    d3.selectAll("input[name='type']").on("change", function () {
      clearInterval(intervalId);
      d3.select("#play_pause_button").classed("paused", false);
      updateGraphType(this.value);
    });
    d3.select("#play_pause_button").on("click", function () {
      if (d3.select("#play_pause_button").classed("paused")) {
        for (var i = 1; i <= intervalId; i++) {
          clearInterval(i);
        }
      } else {
        intervalId = setInterval(function () {
          return update(index++ % dat.length, d3.select("input[name='type']:checked").node().value);
        }, 1300);
      }
    });
    d3.select("#year_slider").on("input", function () {
      d3.select("#play_pause_button").classed("paused", true);
      clearInterval(intervalId);
      index = this.value - 2003;
      update(index % dat.length, d3.select("input[name='type']:checked").node().value);
    });
    intervalId = setInterval(function () {
      return update(++index % dat.length, "total_global_sale");
    }, 1300);
  }

  draw();
});
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60396" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map
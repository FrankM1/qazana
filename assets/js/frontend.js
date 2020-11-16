/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 380);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__(35);
var $find = __webpack_require__(83)(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(72)(KEY);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 3 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.11' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(33)('wks');
var uid = __webpack_require__(34);
var Symbol = __webpack_require__(2).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(10)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(6);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(23);
var createDesc = __webpack_require__(65);
module.exports = __webpack_require__(7) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(20)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(110);
var defined = __webpack_require__(38);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var core = __webpack_require__(3);
var ctx = __webpack_require__(98);
var hide = __webpack_require__(16);
var has = __webpack_require__(9);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(22);
var IE8_DOM_DEFINE = __webpack_require__(73);
var toPrimitive = __webpack_require__(50);
var dP = Object.defineProperty;

exports.f = __webpack_require__(12) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(15);
var createDesc = __webpack_require__(30);
module.exports = __webpack_require__(12) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(53)('wks');
var uid = __webpack_require__(32);
var Symbol = __webpack_require__(5).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.11' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(17);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(8);
var IE8_DOM_DEFINE = __webpack_require__(67);
var toPrimitive = __webpack_require__(62);
var dP = Object.defineProperty;

exports.f = __webpack_require__(7) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var hide = __webpack_require__(11);
var has = __webpack_require__(42);
var SRC = __webpack_require__(34)('src');
var $toString = __webpack_require__(71);
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__(21).inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(29);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(8);
var toObject = __webpack_require__(66);
var toLength = __webpack_require__(26);
var toInteger = __webpack_require__(29);
var advanceStringIndex = __webpack_require__(69);
var regExpExec = __webpack_require__(63);
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
__webpack_require__(64)('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(23).f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__(7) && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),
/* 29 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(21);
var global = __webpack_require__(2);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(70) ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 34 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var core = __webpack_require__(21);
var hide = __webpack_require__(11);
var redefine = __webpack_require__(25);
var ctx = __webpack_require__(37);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(76);
var enumBugKeys = __webpack_require__(54);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(49);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 38 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(148);

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Module = __webpack_require__(46),
    ViewModule;

ViewModule = Module.extend({
  elements: null,
  getDefaultElements: function getDefaultElements() {
    return {};
  },
  bindEvents: function bindEvents() {},
  onInit: function onInit() {
    this.initElements();
    this.bindEvents();
  },
  initElements: function initElements() {
    this.elements = this.getDefaultElements();
  }
});
module.exports = ViewModule;

/***/ }),
/* 41 */,
/* 42 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(22);
var dPs = __webpack_require__(109);
var enumBugKeys = __webpack_require__(54);
var IE_PROTO = __webpack_require__(52)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(74)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(114).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 44 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isRegExp = __webpack_require__(103);
var anObject = __webpack_require__(8);
var speciesConstructor = __webpack_require__(135);
var advanceStringIndex = __webpack_require__(69);
var toLength = __webpack_require__(26);
var callRegExpExec = __webpack_require__(63);
var regexpExec = __webpack_require__(48);
var fails = __webpack_require__(10);
var $min = Math.min;
var $push = [].push;
var $SPLIT = 'split';
var LENGTH = 'length';
var LAST_INDEX = 'lastIndex';
var MAX_UINT32 = 0xffffffff;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { RegExp(MAX_UINT32, 'y'); });

// @@split logic
__webpack_require__(64)('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return $split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy[LAST_INDEX];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
    };
  } else {
    internalSplit = $split;
  }

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = defined(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
});


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(0);

var _create = _interopRequireDefault(__webpack_require__(94));

__webpack_require__(28);

var _typeof2 = _interopRequireDefault(__webpack_require__(60));

__webpack_require__(45);

var Module = function Module() {
  var $ = jQuery,
      instanceParams = arguments,
      self = this,
      settings,
      events = {};

  var ensureClosureMethods = function ensureClosureMethods() {
    $.each(self, function (methodName) {
      var oldMethod = self[methodName];

      if ('function' !== typeof oldMethod) {
        return;
      }

      self[methodName] = function () {
        return oldMethod.apply(self, arguments);
      };
    });
  };

  var initSettings = function initSettings() {
    settings = self.getDefaultSettings();
    var instanceSettings = instanceParams[0];

    if (instanceSettings) {
      $.extend(settings, instanceSettings);
    }
  };

  var init = function init() {
    self.__construct.apply(self, instanceParams);

    ensureClosureMethods();
    initSettings();
    self.trigger('init');
  };

  this.getItems = function (items, itemKey) {
    if (itemKey) {
      var keyStack = itemKey.split('.'),
          currentKey = keyStack.splice(0, 1);

      if (!keyStack.length) {
        return items[currentKey];
      }

      if (!items[currentKey]) {
        return;
      }

      return this.getItems(items[currentKey], keyStack.join('.'));
    }

    return items;
  };

  this.getSettings = function (setting) {
    return this.getItems(settings, setting);
  };

  this.setSettings = function (settingKey, value, settingsContainer) {
    if (!settingsContainer) {
      settingsContainer = settings;
    }

    if ('object' === (0, _typeof2.default)(settingKey)) {
      $.extend(settingsContainer, settingKey);
      return self;
    }

    var keyStack = settingKey.split('.'),
        currentKey = keyStack.splice(0, 1);

    if (!keyStack.length) {
      settingsContainer[currentKey] = value;
      return self;
    }

    if (!settingsContainer[currentKey]) {
      settingsContainer[currentKey] = {};
    }

    return self.setSettings(keyStack.join('.'), value, settingsContainer[currentKey]);
  };

  this.forceMethodImplementation = function (methodArguments) {
    var functionName = methodArguments.callee.name;
    throw new ReferenceError('The method ' + functionName + ' must to be implemented in the inheritor child.');
  };

  this.on = function (eventName, callback) {
    if ('object' === (0, _typeof2.default)(eventName)) {
      $.each(eventName, function (singleEventName) {
        self.on(singleEventName, this);
      });
      return self;
    }

    var eventNames = eventName.split(' ');
    eventNames.forEach(function (singleEventName) {
      if (!events[singleEventName]) {
        events[singleEventName] = [];
      }

      events[singleEventName].push(callback);
    });
    return self;
  };

  this.off = function (eventName, callback) {
    if (!events[eventName]) {
      return self;
    }

    if (!callback) {
      delete events[eventName];
      return self;
    }

    var callbackIndex = events[eventName].indexOf(callback);

    if (-1 !== callbackIndex) {
      delete events[eventName][callbackIndex];
    }

    return self;
  };

  this.trigger = function (eventName) {
    var methodName = 'on' + eventName[0].toUpperCase() + eventName.slice(1),
        params = Array.prototype.slice.call(arguments, 1);

    if (self[methodName]) {
      self[methodName].apply(self, params);
    }

    var callbacks = events[eventName];

    if (!callbacks) {
      return self;
    }

    $.each(callbacks, function (index, callback) {
      callback.apply(self, params);
    });
    return self;
  };

  this.getDeviceName = function () {
    return jQuery('body').data('qazana-device-mode');
  };

  init();
};

Module.prototype.__construct = function () {};

Module.prototype.getDefaultSettings = function () {
  return {};
};

Module.extendsCount = 0;

Module.extend = function (properties) {
  var $ = jQuery,
      parent = this;

  var child = function child() {
    return parent.apply(this, arguments);
  };

  $.extend(child, parent);
  child.prototype = (0, _create.default)($.extend({}, parent.prototype, properties));
  child.prototype.constructor = child;
  /*
   * Constructor ID is used to set an unique ID
      * to every extend of the Module.
      *
   * It's useful in some cases such as unique
   * listener for frontend handlers.
   */

  var constructorID = ++Module.extendsCount;

  child.prototype.getConstructorID = function () {
    return constructorID;
  };

  child.__super__ = parent.prototype;
  return child;
};

module.exports = Module;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(8);
var toLength = __webpack_require__(26);
var advanceStringIndex = __webpack_require__(69);
var regExpExec = __webpack_require__(63);

// @@match logic
__webpack_require__(64)('match', 1, function (defined, MATCH, $match, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[MATCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative($match, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      if (!rx.global) return regExpExec(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__(82);

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(17);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 51 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(53)('keys');
var uid = __webpack_require__(32);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(3);
var global = __webpack_require__(5);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(31) ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 54 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(15).f;
var has = __webpack_require__(9);
var TAG = __webpack_require__(18)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(18);


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var core = __webpack_require__(3);
var LIBRARY = __webpack_require__(31);
var wksExt = __webpack_require__(57);
var defineProperty = __webpack_require__(15).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 59 */,
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var _Symbol$iterator = __webpack_require__(117);

var _Symbol = __webpack_require__(126);

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof _Symbol === "function" && typeof _Symbol$iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof _Symbol === "function" && obj.constructor === _Symbol && obj !== _Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(38);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(6);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__(97);
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(107);
var redefine = __webpack_require__(25);
var hide = __webpack_require__(11);
var fails = __webpack_require__(10);
var defined = __webpack_require__(24);
var wks = __webpack_require__(4);
var regexpExec = __webpack_require__(48);

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(24);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(7) && !__webpack_require__(10)(function () {
  return Object.defineProperty(__webpack_require__(68)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(6);
var document = __webpack_require__(2).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__(106)(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(33)('native-function-to-string', Function.toString);


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(4)('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(11)(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(12) && !__webpack_require__(20)(function () {
  return Object.defineProperty(__webpack_require__(74)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(17);
var document = __webpack_require__(5).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 75 */,
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(9);
var toIObject = __webpack_require__(13);
var arrayIndexOf = __webpack_require__(111)(false);
var IE_PROTO = __webpack_require__(52)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 77 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(31);
var $export = __webpack_require__(14);
var redefine = __webpack_require__(79);
var hide = __webpack_require__(16);
var Iterators = __webpack_require__(55);
var $iterCreate = __webpack_require__(121);
var setToStringTag = __webpack_require__(56);
var getPrototypeOf = __webpack_require__(95);
var ITERATOR = __webpack_require__(18)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16);


/***/ }),
/* 80 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(76);
var hiddenKeys = __webpack_require__(54).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__(8);
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(37);
var IObject = __webpack_require__(84);
var toObject = __webpack_require__(66);
var toLength = __webpack_require__(26);
var asc = __webpack_require__(88);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(19);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 85 */,
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(44);
var createDesc = __webpack_require__(30);
var toIObject = __webpack_require__(13);
var toPrimitive = __webpack_require__(50);
var has = __webpack_require__(9);
var IE8_DOM_DEFINE = __webpack_require__(73);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(12) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(0);

__webpack_require__(27);

__webpack_require__(45);

var _keys = _interopRequireDefault(__webpack_require__(39));

__webpack_require__(1);

var ViewModule = __webpack_require__(40),
    HandlerModule;

HandlerModule = ViewModule.extend({
  $element: null,
  editorListeners: null,
  onElementChange: null,
  onEditSettingsChange: null,
  onGeneralSettingsChange: null,
  onPageSettingsChange: null,
  isEdit: null,
  __construct: function __construct(settings) {
    this.$element = settings.$element;
    this.isEdit = this.$element.hasClass('qazana-element-edit-mode');

    if (this.isEdit) {
      this.addEditorListeners();
    }
  },
  findElement: function findElement(selector) {
    var $mainElement = this.$element;
    return $mainElement.find(selector).filter(function () {
      return jQuery(this).closest('.qazana-element').is($mainElement);
    });
  },
  getUniqueHandlerID: function getUniqueHandlerID(cid, $element) {
    if (!cid) {
      cid = this.getModelCID();
    }

    if (!$element) {
      $element = this.$element;
    }

    return cid + $element.attr('data-element_type') + this.getConstructorID();
  },
  initEditorListeners: function initEditorListeners() {
    var self = this;
    self.editorListeners = [{
      event: 'element:destroy',
      to: qazana.channels.data,
      callback: function callback(removedModel) {
        if (removedModel.cid !== self.getModelCID()) {
          return;
        }

        self.onDestroy();
      }
    }];

    if (self.onElementChange) {
      var elementName = self.getElementName(),
          eventName = 'change';

      if ('global' !== elementName) {
        eventName += ':' + elementName;
      }

      self.editorListeners.push({
        event: eventName,
        to: qazana.channels.editor,
        callback: function callback(controlView, elementView) {
          var elementViewHandlerID = self.getUniqueHandlerID(elementView.model.cid, elementView.$el);

          if (elementViewHandlerID !== self.getUniqueHandlerID()) {
            return;
          }

          self.onElementChange(controlView.model.get('name'), controlView, elementView);
        }
      });
    }

    if (self.onEditSettingsChange) {
      self.editorListeners.push({
        event: 'change:editSettings',
        to: qazana.channels.editor,
        callback: function callback(changedModel, view) {
          if (view.model.cid !== self.getModelCID()) {
            return;
          }

          self.onEditSettingsChange((0, _keys.default)(changedModel.changed)[0]);
        }
      });
    }

    ['page', 'general'].forEach(function (settingsType) {
      var listenerMethodName = 'on' + qazana.helpers.firstLetterUppercase(settingsType) + 'SettingsChange';

      if (self[listenerMethodName]) {
        self.editorListeners.push({
          event: 'change',
          to: qazana.settings[settingsType].model,
          callback: function callback(model) {
            self[listenerMethodName](model.changed);
          }
        });
      }
    });
  },
  getEditorListeners: function getEditorListeners() {
    if (!this.editorListeners) {
      this.initEditorListeners();
    }

    return this.editorListeners;
  },
  addEditorListeners: function addEditorListeners() {
    var uniqueHandlerID = this.getUniqueHandlerID();
    this.getEditorListeners().forEach(function (listener) {
      qazanaFrontend.addListenerOnce(uniqueHandlerID, listener.event, listener.callback, listener.to);
    });
  },
  removeEditorListeners: function removeEditorListeners() {
    var uniqueHandlerID = this.getUniqueHandlerID();
    this.getEditorListeners().forEach(function (listener) {
      qazanaFrontend.removeListeners(uniqueHandlerID, listener.event, null, listener.to);
    });
  },
  getElementName: function getElementName() {
    return this.$element.data('element_type').split('.')[0];
  },
  getSkinName: function getSkinName() {
    return this.$element.data('element_type').split('.')[1];
  },
  getID: function getID() {
    return this.$element.data('id');
  },
  getModelCID: function getModelCID() {
    return this.$element.data('model-cid');
  },
  getDocumentSettings: function getDocumentSettings() {
    if (qazanaFrontend.isEditMode()) {
      return qazana.settings.page.getSettings().settings;
    }

    return jQuery(this.$element).closest('.qazana').data('settings');
  },
  getElementSettings: function getElementSettings(setting) {
    var elementSettings = {},
        skinName,
        settings,
        modelCID = this.getModelCID(),
        self = this,
        elementName = self.getElementName().replace(/-/g, '_'),
        handHeldDevice = this.getDeviceName();

    if (qazanaFrontend.isEditMode() && modelCID) {
      settings = qazanaFrontend.config.elements.data[modelCID];
      skinName = 'global' !== elementName ? settings.attributes._skin : 'default';
      jQuery.each(settings.getActiveControls(), function (controlKey) {
        var newControlKey = controlKey;

        if (skinName !== 'default') {
          newControlKey = controlKey.replace(skinName + '_', '');
        }

        elementSettings[newControlKey] = settings.attributes[controlKey];
      });
    } else {
      skinName = self.getSkinName() && 'global' !== elementName ? self.getSkinName().replace(/-/g, '_') : 'default';
      settings = this.$element.data('settings') || {};
      elementSettings = settings;

      if (settings && skinName !== 'default') {
        jQuery.each(settings, function (controlKey) {
          var newControlKey = controlKey;
          newControlKey = controlKey.replace(skinName + '_', '');
          elementSettings[newControlKey] = self.getItems(settings, controlKey);
        });
      }
    }

    if (handHeldDevice) {
      jQuery.each(elementSettings, function (controlKey) {
        if (typeof elementSettings[controlKey + '_' + handHeldDevice] !== 'undefined') {
          elementSettings[controlKey] = elementSettings[controlKey + '_' + handHeldDevice]; // rewrite main value with mobile version
        }
      });
    }

    return this.getItems(elementSettings, setting);
  },
  getEditSettings: function getEditSettings(setting) {
    var attributes = {};

    if (this.isEdit) {
      attributes = qazanaFrontend.config.elements.editSettings[this.getModelCID()].attributes;
    }

    return this.getItems(attributes, setting);
  },
  onDestroy: function onDestroy() {
    this.removeEditorListeners();

    if (this.unbindEvents) {
      this.unbindEvents();
    }
  }
});
module.exports = HandlerModule;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(89);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(6);
var isArray = __webpack_require__(90);
var SPECIES = __webpack_require__(4)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(19);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 91 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 92 */,
/* 93 */,
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(115);

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(9);
var toObject = __webpack_require__(61);
var IE_PROTO = __webpack_require__(52)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 96 */,
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(19);
var TAG = __webpack_require__(4)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(91);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(77);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__(6);
var cof = __webpack_require__(19);
var MATCH = __webpack_require__(4)('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(157);

/***/ }),
/* 105 */,
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(29);
var defined = __webpack_require__(24);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__(48);
__webpack_require__(35)({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),
/* 108 */,
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(15);
var anObject = __webpack_require__(22);
var getKeys = __webpack_require__(36);

module.exports = __webpack_require__(12) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(77);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(13);
var toLength = __webpack_require__(112);
var toAbsoluteIndex = __webpack_require__(113);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(51);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(51);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(5).document;
module.exports = document && document.documentElement;


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(116);
var $Object = __webpack_require__(3).Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(14);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(43) });


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(118);

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(119);
__webpack_require__(122);
module.exports = __webpack_require__(57).f('iterator');


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(120)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(78)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(51);
var defined = __webpack_require__(38);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(43);
var descriptor = __webpack_require__(30);
var setToStringTag = __webpack_require__(56);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(16)(IteratorPrototype, __webpack_require__(18)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(123);
var global = __webpack_require__(5);
var hide = __webpack_require__(16);
var Iterators = __webpack_require__(55);
var TO_STRING_TAG = __webpack_require__(18)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(124);
var step = __webpack_require__(125);
var Iterators = __webpack_require__(55);
var toIObject = __webpack_require__(13);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(78)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 124 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 125 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(127);

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(128);
__webpack_require__(132);
__webpack_require__(133);
__webpack_require__(134);
module.exports = __webpack_require__(3).Symbol;


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(5);
var has = __webpack_require__(9);
var DESCRIPTORS = __webpack_require__(12);
var $export = __webpack_require__(14);
var redefine = __webpack_require__(79);
var META = __webpack_require__(129).KEY;
var $fails = __webpack_require__(20);
var shared = __webpack_require__(53);
var setToStringTag = __webpack_require__(56);
var uid = __webpack_require__(32);
var wks = __webpack_require__(18);
var wksExt = __webpack_require__(57);
var wksDefine = __webpack_require__(58);
var enumKeys = __webpack_require__(130);
var isArray = __webpack_require__(102);
var anObject = __webpack_require__(22);
var isObject = __webpack_require__(17);
var toObject = __webpack_require__(61);
var toIObject = __webpack_require__(13);
var toPrimitive = __webpack_require__(50);
var createDesc = __webpack_require__(30);
var _create = __webpack_require__(43);
var gOPNExt = __webpack_require__(131);
var $GOPD = __webpack_require__(86);
var $GOPS = __webpack_require__(80);
var $DP = __webpack_require__(15);
var $keys = __webpack_require__(36);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function' && !!$GOPS.f;
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(81).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(44).f = $propertyIsEnumerable;
  $GOPS.f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(31)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FAILS_ON_PRIMITIVES = $fails(function () { $GOPS.f(1); });

$export($export.S + $export.F * FAILS_ON_PRIMITIVES, 'Object', {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return $GOPS.f(toObject(it));
  }
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(16)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(32)('meta');
var isObject = __webpack_require__(17);
var has = __webpack_require__(9);
var setDesc = __webpack_require__(15).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(20)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(36);
var gOPS = __webpack_require__(80);
var pIE = __webpack_require__(44);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(13);
var gOPN = __webpack_require__(81).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 132 */
/***/ (function(module, exports) {



/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(58)('asyncIterator');


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(58)('observable');


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(8);
var aFunction = __webpack_require__(49);
var SPECIES = __webpack_require__(4)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 136 */,
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(14);
var core = __webpack_require__(3);
var fails = __webpack_require__(20);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 138 */
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(149);
module.exports = __webpack_require__(3).Object.keys;


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(61);
var $keys = __webpack_require__(36);

__webpack_require__(137)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(0);

var _parseInt2 = _interopRequireDefault(__webpack_require__(104));

var ViewModule = __webpack_require__(40);

module.exports = ViewModule.extend({
  getDefaultSettings: function getDefaultSettings() {
    return {
      container: null,
      items: null,
      columnsCount: 3,
      verticalSpaceBetween: 30
    };
  },
  getDefaultElements: function getDefaultElements() {
    return {
      $container: jQuery(this.getSettings('container')),
      $items: jQuery(this.getSettings('items'))
    };
  },
  run: function run() {
    var heights = [],
        distanceFromTop = this.elements.$container.position().top,
        settings = this.getSettings(),
        columnsCount = settings.columnsCount;
    distanceFromTop += (0, _parseInt2.default)(this.elements.$container.css('margin-top'), 10);
    this.elements.$items.each(function (index) {
      var row = Math.floor(index / columnsCount),
          $item = jQuery(this),
          itemHeight = $item[0].getBoundingClientRect().height + settings.verticalSpaceBetween;

      if (row) {
        var itemPosition = $item.position(),
            indexAtRow = index % columnsCount,
            pullHeight = itemPosition.top - distanceFromTop - heights[indexAtRow];
        pullHeight -= (0, _parseInt2.default)($item.css('margin-top'), 10);
        pullHeight *= -1;
        $item.css('margin-top', pullHeight + 'px');
        heights[indexAtRow] += itemHeight;
      } else {
        heights.push(itemHeight);
      }
    });
  }
});

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(158);
module.exports = __webpack_require__(3).parseInt;


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(14);
var $parseInt = __webpack_require__(159);
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

var $parseInt = __webpack_require__(5).parseInt;
var $trim = __webpack_require__(160).trim;
var ws = __webpack_require__(138);
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(14);
var defined = __webpack_require__(38);
var fails = __webpack_require__(20);
var spaces = __webpack_require__(138);
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var HotKeys = function HotKeys() {
  var hotKeysHandlers = {};

  var applyHotKey = function applyHotKey(event) {
    var handlers = hotKeysHandlers[event.which];

    if (!handlers) {
      return;
    }

    jQuery.each(handlers, function () {
      var handler = this;

      if (handler.isWorthHandling && !handler.isWorthHandling(event)) {
        return;
      } // Fix for some keyboard sources that consider alt key as ctrl key


      if (!handler.allowAltKey && event.altKey) {
        return;
      }

      event.preventDefault();
      handler.handle(event);
    });
  };

  this.isControlEvent = function (event) {
    return event[qazana.envData.mac ? 'metaKey' : 'ctrlKey'];
  };

  this.addHotKeyHandler = function (keyCode, handlerName, handler) {
    if (!hotKeysHandlers[keyCode]) {
      hotKeysHandlers[keyCode] = {};
    }

    hotKeysHandlers[keyCode][handlerName] = handler;
  };

  this.bindListener = function ($listener) {
    $listener.on('keydown', applyHotKey);
  };
};

module.exports = new HotKeys();

/***/ }),
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Handles managing all events for whatever you plug it into. Priorities for hooks are based on lowest to highest in
 * that, lowest priority hooks are fired first.
 */

var _interopRequireDefault = __webpack_require__(0);

var _parseInt2 = _interopRequireDefault(__webpack_require__(104));

var EventManager = function EventManager() {
  var slice = Array.prototype.slice,
      MethodsAvailable;
  /**
   * Contains the hooks that get registered with this EventManager. The array for storage utilizes a "flat"
   * object literal such that looking up the hook utilizes the native object literal hash.
   */

  var STORAGE = {
    actions: {},
    filters: {}
  };
  /**
   * Removes the specified hook by resetting the value of it.
   *
   * @param type Type of hook, either 'actions' or 'filters'
   * @param hook The hook (namespace.identifier) to remove
   *
   * @private
   */

  function _removeHook(type, hook, callback, context) {
    var handlers, handler, i;

    if (!STORAGE[type][hook]) {
      return;
    }

    if (!callback) {
      STORAGE[type][hook] = [];
    } else {
      handlers = STORAGE[type][hook];

      if (!context) {
        for (i = handlers.length; i--;) {
          if (handlers[i].callback === callback) {
            handlers.splice(i, 1);
          }
        }
      } else {
        for (i = handlers.length; i--;) {
          handler = handlers[i];

          if (handler.callback === callback && handler.context === context) {
            handlers.splice(i, 1);
          }
        }
      }
    }
  }
  /**
   * Use an insert sort for keeping our hooks organized based on priority. This function is ridiculously faster
   * than bubble sort, etc: http://jsperf.com/javascript-sort
   *
   * @param hooks The custom array containing all of the appropriate hooks to perform an insert sort on.
   * @private
   */


  function _hookInsertSort(hooks) {
    var tmpHook, j, prevHook;

    for (var i = 1, len = hooks.length; i < len; i++) {
      tmpHook = hooks[i];
      j = i;

      while ((prevHook = hooks[j - 1]) && prevHook.priority > tmpHook.priority) {
        hooks[j] = hooks[j - 1];
        --j;
      }

      hooks[j] = tmpHook;
    }

    return hooks;
  }
  /**
   * Adds the hook to the appropriate storage container
   *
   * @param type 'actions' or 'filters'
   * @param hook The hook (namespace.identifier) to add to our event manager
   * @param callback The function that will be called when the hook is executed.
   * @param priority The priority of this hook. Must be an integer.
   * @param [context] A value to be used for this
   * @private
   */


  function _addHook(type, hook, callback, priority, context) {
    var hookObject = {
      callback: callback,
      priority: priority,
      context: context
    }; // Utilize 'prop itself' : http://jsperf.com/hasownproperty-vs-in-vs-undefined/19

    var hooks = STORAGE[type][hook];

    if (hooks) {
      // TEMP FIX BUG
      var hasSameCallback = false;
      jQuery.each(hooks, function () {
        if (this.callback === callback) {
          hasSameCallback = true;
          return false;
        }
      });

      if (hasSameCallback) {
        return;
      } // END TEMP FIX BUG


      hooks.push(hookObject);
      hooks = _hookInsertSort(hooks);
    } else {
      hooks = [hookObject];
    }

    STORAGE[type][hook] = hooks;
  }
  /**
   * Runs the specified hook. If it is an action, the value is not modified but if it is a filter, it is.
   *
   * @param type 'actions' or 'filters'
   * @param hook The hook ( namespace.identifier ) to be ran.
   * @param args Arguments to pass to the action/filter. If it's a filter, args is actually a single parameter.
   * @private
   */


  function _runHook(type, hook, args) {
    var handlers = STORAGE[type][hook],
        i,
        len;

    if (!handlers) {
      return 'filters' === type ? args[0] : false;
    }

    len = handlers.length;

    if ('filters' === type) {
      for (i = 0; i < len; i++) {
        args[0] = handlers[i].callback.apply(handlers[i].context, args);
      }
    } else {
      for (i = 0; i < len; i++) {
        handlers[i].callback.apply(handlers[i].context, args);
      }
    }

    return 'filters' === type ? args[0] : true;
  }
  /**
   * Adds an action to the event manager.
   *
   * @param action Must contain namespace.identifier
   * @param callback Must be a valid callback function before this action is added
   * @param [priority=10] Used to control when the function is executed in relation to other callbacks bound to the same hook
   * @param [context] Supply a value to be used for this
   */


  function addAction(action, callback, priority, context) {
    if ('string' === typeof action && 'function' === typeof callback) {
      priority = (0, _parseInt2.default)(priority || 10, 10);

      _addHook('actions', action, callback, priority, context);
    }

    return MethodsAvailable;
  }
  /**
   * Performs an action if it exists. You can pass as many arguments as you want to this function; the only rule is
   * that the first argument must always be the action.
   */


  function doAction()
  /* action, arg1, arg2, ... */
  {
    var args = slice.call(arguments);
    var action = args.shift();

    if ('string' === typeof action) {
      _runHook('actions', action, args);
    }

    return MethodsAvailable;
  }
  /**
   * Removes the specified action if it contains a namespace.identifier & exists.
   *
   * @param action The action to remove
   * @param [callback] Callback function to remove
   */


  function removeAction(action, callback) {
    if ('string' === typeof action) {
      _removeHook('actions', action, callback);
    }

    return MethodsAvailable;
  }
  /**
   * Adds a filter to the event manager.
   *
   * @param filter Must contain namespace.identifier
   * @param callback Must be a valid callback function before this action is added
   * @param [priority=10] Used to control when the function is executed in relation to other callbacks bound to the same hook
   * @param [context] Supply a value to be used for this
   */


  function addFilter(filter, callback, priority, context) {
    if ('string' === typeof filter && 'function' === typeof callback) {
      priority = (0, _parseInt2.default)(priority || 10, 10);

      _addHook('filters', filter, callback, priority, context);
    }

    return MethodsAvailable;
  }
  /**
   * Performs a filter if it exists. You should only ever pass 1 argument to be filtered. The only rule is that
   * the first argument must always be the filter.
   */


  function applyFilters()
  /* filter, filtered arg, arg2, ... */
  {
    var args = slice.call(arguments);
    var filter = args.shift();

    if ('string' === typeof filter) {
      return _runHook('filters', filter, args);
    }

    return MethodsAvailable;
  }
  /**
   * Removes the specified filter if it contains a namespace.identifier & exists.
   *
   * @param filter The action to remove
   * @param [callback] Callback function to remove
   */


  function removeFilter(filter, callback) {
    if ('string' === typeof filter) {
      _removeHook('filters', filter, callback);
    }

    return MethodsAvailable;
  }
  /**
   * Maintain a reference to the object scope so our public methods never get confusing.
   */


  MethodsAvailable = {
    removeFilter: removeFilter,
    applyFilters: applyFilters,
    addFilter: addFilter,
    removeAction: removeAction,
    doAction: doAction,
    addAction: addAction
  }; // return all of the publicly available methods

  return MethodsAvailable;
};

module.exports = EventManager;

/***/ }),
/* 167 */,
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var HandlerModule = __webpack_require__(87);

module.exports = HandlerModule.extend({
  $activeContent: null,
  getDefaultSettings: function getDefaultSettings() {
    return {
      selectors: {
        tabTitle: '.qazana-tab-title',
        tabContent: '.qazana-tab-content'
      },
      classes: {
        active: 'qazana-active'
      },
      showTabFn: 'show',
      hideTabFn: 'hide',
      toggleSelf: true,
      hidePrevious: true,
      autoExpand: true
    };
  },
  getDefaultElements: function getDefaultElements() {
    var selectors = this.getSettings('selectors');
    return {
      $tabTitles: this.findElement(selectors.tabTitle),
      $tabContents: this.findElement(selectors.tabContent)
    };
  },
  activateDefaultTab: function activateDefaultTab() {
    var settings = this.getSettings();

    if (!settings.autoExpand || 'editor' === settings.autoExpand && !this.isEdit) {
      return;
    }

    var defaultActiveTab = this.getEditSettings('activeItemIndex') || 1,
        originalToggleMethods = {
      showTabFn: settings.showTabFn,
      hideTabFn: settings.hideTabFn
    }; // Toggle tabs without animation to avoid jumping

    this.setSettings({
      showTabFn: 'show',
      hideTabFn: 'hide'
    });
    this.changeActiveTab(defaultActiveTab); // Return back original toggle effects

    this.setSettings(originalToggleMethods);
  },
  deactivateActiveTab: function deactivateActiveTab(tabIndex) {
    var settings = this.getSettings(),
        activeClass = settings.classes.active,
        activeFilter = tabIndex ? '[data-tab="' + tabIndex + '"]' : '.' + activeClass,
        $activeTitle = this.elements.$tabTitles.filter(activeFilter),
        $activeContent = this.elements.$tabContents.filter(activeFilter);
    $activeTitle.add($activeContent).removeClass(activeClass);
    $activeContent[settings.hideTabFn]();
  },
  activateTab: function activateTab(tabIndex) {
    var settings = this.getSettings(),
        activeClass = settings.classes.active,
        $requestedTitle = this.elements.$tabTitles.filter('[data-tab="' + tabIndex + '"]'),
        $requestedContent = this.elements.$tabContents.filter('[data-tab="' + tabIndex + '"]');
    $requestedTitle.add($requestedContent).addClass(activeClass);
    $requestedContent[settings.showTabFn]();
  },
  isActiveTab: function isActiveTab(tabIndex) {
    return this.elements.$tabTitles.filter('[data-tab="' + tabIndex + '"]').hasClass(this.getSettings('classes.active'));
  },
  bindEvents: function bindEvents() {
    var _this = this;

    this.elements.$tabTitles.on({
      keydown: function keydown(event) {
        if ('Enter' === event.key) {
          event.preventDefault();

          _this.changeActiveTab(event.currentTarget.dataset.tab);
        }
      },
      click: function click(event) {
        event.preventDefault();

        _this.changeActiveTab(event.currentTarget.dataset.tab);
      }
    });
  },
  onInit: function onInit() {
    HandlerModule.prototype.onInit.apply(this, arguments);
    this.activateDefaultTab();
  },
  onEditSettingsChange: function onEditSettingsChange(propertyName) {
    if ('activeItemIndex' === propertyName) {
      this.activateDefaultTab();
    }
  },
  changeActiveTab: function changeActiveTab(tabIndex) {
    var isActiveTab = this.isActiveTab(tabIndex),
        settings = this.getSettings();

    if ((settings.toggleSelf || !isActiveTab) && settings.hidePrevious) {
      this.deactivateActiveTab();
    }

    if (!settings.hidePrevious && isActiveTab) {
      this.deactivateActiveTab(tabIndex);
    }

    if (!isActiveTab) {
      this.activateTab(tabIndex);
    }
  }
});

/***/ }),
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */,
/* 316 */,
/* 317 */,
/* 318 */,
/* 319 */,
/* 320 */,
/* 321 */,
/* 322 */,
/* 323 */,
/* 324 */,
/* 325 */,
/* 326 */,
/* 327 */,
/* 328 */,
/* 329 */,
/* 330 */,
/* 331 */,
/* 332 */,
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */,
/* 338 */,
/* 339 */,
/* 340 */,
/* 341 */,
/* 342 */,
/* 343 */,
/* 344 */,
/* 345 */,
/* 346 */,
/* 347 */,
/* 348 */,
/* 349 */,
/* 350 */,
/* 351 */,
/* 352 */,
/* 353 */,
/* 354 */,
/* 355 */,
/* 356 */,
/* 357 */,
/* 358 */,
/* 359 */,
/* 360 */,
/* 361 */,
/* 362 */,
/* 363 */,
/* 364 */,
/* 365 */,
/* 366 */,
/* 367 */,
/* 368 */,
/* 369 */,
/* 370 */,
/* 371 */,
/* 372 */,
/* 373 */,
/* 374 */,
/* 375 */,
/* 376 */,
/* 377 */,
/* 378 */,
/* 379 */,
/* 380 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(0);

__webpack_require__(27);

var _now = _interopRequireDefault(__webpack_require__(381));

__webpack_require__(47);

__webpack_require__(1);

/* global qazanaFrontendConfig */
(function ($) {
  var elements = {},
      EventManager = __webpack_require__(166),
      Module = __webpack_require__(87),
      ElementsHandler = __webpack_require__(384),
      YouTubeModule = __webpack_require__(401),
      VimeoModule = __webpack_require__(402),
      AnchorsModule = __webpack_require__(403),
      LightboxModule = __webpack_require__(404),
      CarouselModule = __webpack_require__(405);

  var QazanaFrontend = function QazanaFrontend() {
    var self = this,
        dialogsManager;
    this.config = qazanaFrontendConfig;
    this.Module = Module;

    var setDeviceModeData = function setDeviceModeData() {
      elements.$body.attr('data-qazana-device-mode', self.getCurrentDeviceMode());
    };

    var initElements = function initElements() {
      elements.window = window;
      elements.$window = $(window);
      elements.$document = $(document);
      elements.$body = $('body');
      elements.$qazana = elements.$document.find('.qazana');
      elements.$wpAdminBar = elements.$document.find('#wpadminbar');
    };

    var bindEvents = function bindEvents() {
      elements.$window.on('resize', setDeviceModeData);
    };

    var initOnReadyComponents = function initOnReadyComponents() {
      self.utils = {
        youtube: new YouTubeModule(),
        vimeo: new VimeoModule(),
        anchors: new AnchorsModule(),
        lightbox: new LightboxModule(),
        carousel: new CarouselModule() // loadingIndicator: new LoadingIndicatorModule(),

      };
      self.modules = {
        StretchElement: __webpack_require__(406),
        Masonry: __webpack_require__(156)
      };
      self.elementsHandler = new ElementsHandler($);
    };

    var initHotKeys = function initHotKeys() {
      self.hotKeys = __webpack_require__(161);
      self.hotKeys.bindListener(elements.$window);
    };

    var getSiteSettings = function getSiteSettings(settingType, settingName) {
      var settingsObject = self.isEditMode() ? qazana.settings[settingType].model.attributes : self.config.settings[settingType];

      if (settingName) {
        return settingsObject[settingName];
      }

      return settingsObject;
    };

    var addIeCompatibility = function addIeCompatibility() {
      var isIE = 'Microsoft Internet Explorer' === navigator.appName || !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g) || !!navigator.userAgent.match(/rv:11/),
          el = document.createElement('div'),
          supportsGrid = 'string' === typeof el.style.grid;

      if (!isIE && supportsGrid) {
        return;
      }

      elements.$body.addClass('qazana-msie');
      var msieCss = '<link rel="stylesheet" id="qazana-frontend-css-msie" href="' + qazanaFrontend.config.urls.assets + 'css/frontend-msie.min.css?' + qazanaFrontend.config.version + '" type="text/css" />';
      elements.$body.append(msieCss);
    };

    this.init = function () {
      self.hooks = new EventManager();
      initElements();
      addIeCompatibility();
      bindEvents();
      setDeviceModeData();
      elements.$window.trigger('qazana/frontend/init');

      if (!self.isEditMode()) {
        initHotKeys();
      }

      initOnReadyComponents();
    };

    this.getElements = function (element) {
      if (element) {
        return elements[element];
      }

      return elements;
    };

    this.getDialogsManager = function () {
      if (!dialogsManager) {
        dialogsManager = new DialogsManager.Instance();
      }

      return dialogsManager;
    };

    this.getPageSettings = function (settingName) {
      return getSiteSettings('page', settingName);
    };

    this.getGeneralSettings = function (settingName) {
      return getSiteSettings('general', settingName);
    };

    this.isEditMode = function () {
      return self.config.isEditMode;
    }; // Based on underscore function


    this.throttle = function (func, wait) {
      var timeout,
          context,
          args,
          result,
          previous = 0;

      var later = function later() {
        previous = (0, _now.default)();
        timeout = null;
        result = func.apply(context, args);

        if (!timeout) {
          context = args = null;
        }
      };

      return function () {
        var now = (0, _now.default)(),
            remaining = wait - (now - previous);
        context = this;
        args = arguments;

        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }

          previous = now;
          result = func.apply(context, args);

          if (!timeout) {
            context = args = null;
          }
        } else if (!timeout) {
          timeout = setTimeout(later, remaining);
        }

        return result;
      };
    };

    this.debounce = function (threshold, callback) {
      var timeout;
      return function debounced($event) {
        function delayed() {
          callback.call(this, $event);
          timeout = null;
        }

        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(delayed, threshold);
      };
    };

    this.addListenerOnce = function (listenerID, event, callback, to) {
      if (!to) {
        to = self.getElements('$window');
      }

      if (!self.isEditMode()) {
        to.on(event, callback);
        return;
      }

      this.removeListeners(listenerID, event, to);

      if (to instanceof jQuery) {
        var eventNS = event + '.' + listenerID;
        to.on(eventNS, callback);
      } else {
        to.on(event, callback, listenerID);
      }
    };

    this.removeListeners = function (listenerID, event, callback, from) {
      if (!from) {
        from = self.getElements('$window');
      }

      if (from instanceof jQuery) {
        var eventNS = event + '.' + listenerID;
        from.off(eventNS, callback);
      } else {
        from.off(event, callback, listenerID);
      }
    };

    this.getCurrentDeviceMode = function () {
      return getComputedStyle(elements.$qazana[0], ':after').content.replace(/"/g, '');
    };

    this.waypoint = function ($element, callback, options) {
      var defaultOptions = {
        offset: '100%',
        triggerOnce: true
      };
      options = $.extend(defaultOptions, options);

      var correctCallback = function correctCallback() {
        var element = this.element || this,
            result = callback.apply(element, arguments); // If is WayPoint new API and is frontend

        if (options.triggerOnce && this.destroy) {
          this.destroy();
        }

        return result;
      };

      return $element.qazanaWaypoint(correctCallback, options);
    };
  };

  window.qazanaFrontend = new QazanaFrontend();
})(jQuery);

if (!qazanaFrontend.isEditMode()) {
  jQuery(qazanaFrontend.init);
}

/***/ }),
/* 381 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(382);

/***/ }),
/* 382 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(383);
module.exports = __webpack_require__(3).Date.now;


/***/ }),
/* 383 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = __webpack_require__(14);

$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });


/***/ }),
/* 384 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(45);

__webpack_require__(1);

var ElementsHandler;

ElementsHandler = function ElementsHandler($) {
  var self = this; // element-type.skin-type

  var handlers = {
    // Elements
    section: __webpack_require__(385),
    // Widgets
    'accordion.default': __webpack_require__(387),
    'alert.default': __webpack_require__(388),
    'counter.default': __webpack_require__(389),
    'progress.default': __webpack_require__(390),
    'tabs.default': __webpack_require__(391),
    'toggle.default': __webpack_require__(392),
    'video.default': __webpack_require__(393),
    'tooltip.default': __webpack_require__(394),
    'piechart.default': __webpack_require__(395),
    'image-carousel.default': __webpack_require__(396),
    'text-editor.default': __webpack_require__(397),
    'spacer.default': __webpack_require__(398)
  };

  var addGlobalHandlers = function addGlobalHandlers() {
    qazanaFrontend.hooks.addAction('frontend/element_ready/global', __webpack_require__(399));
    qazanaFrontend.hooks.addAction('frontend/element_ready/widget', __webpack_require__(400));
  };

  var addElementsHandlers = function addElementsHandlers() {
    $.each(handlers, function (elementName, funcCallback) {
      qazanaFrontend.hooks.addAction('frontend/element_ready/' + elementName, funcCallback);
    });
  };

  var runElementsHandlers = function runElementsHandlers() {
    var $elements;

    if (qazanaFrontend.isEditMode()) {
      // Elements outside from the Preview
      $elements = jQuery('.qazana-element', '.qazana:not(.qazana-edit-mode)');
    } else {
      $elements = $('.qazana-element');
    }

    $elements.each(function () {
      self.runReadyTrigger($(this));
    });
  };

  var init = function init() {
    if (!qazanaFrontend.isEditMode()) {
      self.initHandlers();
    }
  };

  this.initHandlers = function () {
    addGlobalHandlers();
    addElementsHandlers();
    runElementsHandlers();
  };

  this.reInit = function ($scope) {
    var $elements = $scope.find('.qazana-element');
    $elements.each(function () {
      self.runReadyTrigger($(this));
    });
  };

  this.getHandlers = function (handlerName) {
    if (handlerName) {
      return handlers[handlerName];
    }

    return handlers;
  };

  this.runReadyTrigger = function ($scope) {
    // Initializing the `$scope` as frontend jQuery instance
    $scope = jQuery($scope);
    var elementType = $scope.attr('data-element_type');

    if (!elementType) {
      return;
    }

    var elementName = $scope.attr('data-element_type').split('.')[0];
    qazanaFrontend.hooks.doAction('frontend/element_ready/global', $scope, $);
    var isWidgetType = -1 === ['section', 'column'].indexOf(elementType);

    if (isWidgetType) {
      qazanaFrontend.hooks.doAction('frontend/element_ready/widget', $scope, $);
      qazanaFrontend.hooks.doAction('frontend/element_ready/' + elementType, $scope, $);
    }

    qazanaFrontend.hooks.doAction('frontend/element_ready/' + elementName, $scope, $);
  };

  init();
};

module.exports = ElementsHandler;

/***/ }),
/* 385 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(47);

__webpack_require__(27);

__webpack_require__(1);

var BackgroundVideo = __webpack_require__(386);

var HandlerModule = __webpack_require__(87);

var StretchedSection = HandlerModule.extend({
  stretchElement: null,
  bindEvents: function bindEvents() {
    var handlerID = this.getUniqueHandlerID();
    qazanaFrontend.addListenerOnce(handlerID, 'resize', this.stretch);
    qazanaFrontend.addListenerOnce(handlerID, 'sticky:stick', this.stretch, this.$element);
    qazanaFrontend.addListenerOnce(handlerID, 'sticky:unstick', this.stretch, this.$element);
  },
  unbindEvents: function unbindEvents() {
    qazanaFrontend.removeListeners(this.getUniqueHandlerID(), 'resize', this.stretch);
  },
  initStretch: function initStretch() {
    this.stretchElement = new qazanaFrontend.modules.StretchElement({
      element: this.$element,
      selectors: {
        container: this.getStretchContainer()
      }
    });
  },
  getStretchContainer: function getStretchContainer() {
    return qazanaFrontend.getGeneralSettings('qazana_stretched_section_container') || window;
  },
  stretch: function stretch() {
    if (!this.getElementSettings('stretch_section')) {
      return;
    }

    this.stretchElement.stretch();
  },
  onInit: function onInit() {
    HandlerModule.prototype.onInit.apply(this, arguments);
    this.initStretch();
    this.stretch();
  },
  onElementChange: function onElementChange(propertyName) {
    if ('stretch_section' === propertyName) {
      if (this.getElementSettings('stretch_section')) {
        this.stretch();
      } else {
        this.stretchElement.reset();
      }
    }
  },
  onGeneralSettingsChange: function onGeneralSettingsChange(changed) {
    if ('qazana_stretched_section_container' in changed) {
      this.stretchElement.setSettings('selectors.container', this.getStretchContainer());
      this.stretch();
    }
  }
});
var Shapes = HandlerModule.extend({
  getDefaultSettings: function getDefaultSettings() {
    return {
      selectors: {
        container: '> .qazana-shape-%s'
      },
      svgURL: qazanaFrontend.config.urls.assets + 'shapes/'
    };
  },
  getDefaultElements: function getDefaultElements() {
    var elements = {},
        selectors = this.getSettings('selectors');
    elements.$topContainer = this.$element.find(selectors.container.replace('%s', 'top'));
    elements.$bottomContainer = this.$element.find(selectors.container.replace('%s', 'bottom'));
    return elements;
  },
  buildSVG: function buildSVG(side) {
    var self = this,
        baseSettingKey = 'shape_divider_' + side,
        shapeType = self.getElementSettings(baseSettingKey),
        $svgContainer = this.elements['$' + side + 'Container'];
    $svgContainer.empty().attr('data-shape', shapeType);

    if (!shapeType) {
      return;
    }

    var fileName = shapeType;

    if (self.getElementSettings(baseSettingKey + '_negative')) {
      fileName += '-negative';
    }

    var svgURL = self.getSettings('svgURL') + fileName + '.svg';
    jQuery.get(svgURL, function (data) {
      $svgContainer.append(data.childNodes[0]);
    });
    this.setNegative(side);
  },
  setNegative: function setNegative(side) {
    this.elements['$' + side + 'Container'].attr('data-negative', !!this.getElementSettings('shape_divider_' + side + '_negative'));
  },
  onInit: function onInit() {
    var self = this;
    HandlerModule.prototype.onInit.apply(self, arguments);
    ['top', 'bottom'].forEach(function (side) {
      if (self.getElementSettings('shape_divider_' + side)) {
        self.buildSVG(side);
      }
    });
  },
  onElementChange: function onElementChange(propertyName) {
    var shapeChange = propertyName.match(/^shape_divider_(top|bottom)$/);

    if (shapeChange) {
      this.buildSVG(shapeChange[1]);
      return;
    }

    var negativeChange = propertyName.match(/^shape_divider_(top|bottom)_negative$/);

    if (negativeChange) {
      this.buildSVG(negativeChange[1]);
      this.setNegative(negativeChange[1]);
    }
  }
});
var HandlesPosition = HandlerModule.extend({
  isFirst: function isFirst() {
    return this.$element.is('.qazana-edit-mode .qazana-top-section:first');
  },
  getOffset: function getOffset() {
    return this.$element.offset().top;
  },
  setHandlesPosition: function setHandlesPosition() {
    var self = this;

    if (self.isFirst()) {
      var offset = self.getOffset(),
          $handlesElement = self.$element.find('> .qazana-element-overlay > .qazana-editor-section-settings'),
          insideHandleClass = 'qazana-section--handles-inside';

      if (offset < 25) {
        self.$element.addClass(insideHandleClass);

        if (offset < -5) {
          $handlesElement.css('top', -offset);
        } else {
          $handlesElement.css('top', '');
        }
      } else {
        self.$element.removeClass(insideHandleClass);
      }
    }
  },
  onInit: function onInit() {
    this.setHandlesPosition();
    this.$element.on('mouseenter', this.setHandlesPosition);
  }
});

module.exports = function ($scope) {
  if (qazanaFrontend.isEditMode() || $scope.hasClass('qazana-section-stretched')) {
    new StretchedSection({
      $element: $scope
    });
  }

  if (qazanaFrontend.isEditMode()) {
    new Shapes({
      $element: $scope
    });
    new HandlesPosition({
      $element: $scope
    });
  }

  new BackgroundVideo({
    $element: $scope
  });
};

/***/ }),
/* 386 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

var HandlerModule = __webpack_require__(87);

module.exports = HandlerModule.extend({
  player: null,
  isYTVideo: null,
  getDefaultSettings: function getDefaultSettings() {
    return {
      selectors: {
        backgroundVideoContainer: '.qazana-background-video-container',
        backgroundVideoEmbed: '.qazana-background-video-embed',
        backgroundVideoHosted: '.qazana-background-video-hosted'
      }
    };
  },
  getDefaultElements: function getDefaultElements() {
    var selectors = this.getSettings('selectors'),
        elements = {
      $backgroundVideoContainer: this.$element.find(selectors.backgroundVideoContainer)
    };
    elements.$backgroundVideoEmbed = elements.$backgroundVideoContainer.children(selectors.backgroundVideoEmbed);
    elements.$backgroundVideoHosted = elements.$backgroundVideoContainer.children(selectors.backgroundVideoHosted);
    return elements;
  },
  calcVideosSize: function calcVideosSize() {
    var containerWidth = this.elements.$backgroundVideoContainer.outerWidth(),
        containerHeight = this.elements.$backgroundVideoContainer.outerHeight(),
        aspectRatioSetting = '16:9',
        //TEMP
    aspectRatioArray = aspectRatioSetting.split(':'),
        aspectRatio = aspectRatioArray[0] / aspectRatioArray[1],
        ratioWidth = containerWidth / aspectRatio,
        ratioHeight = containerHeight * aspectRatio,
        isWidthFixed = containerWidth / containerHeight > aspectRatio;
    return {
      width: isWidthFixed ? containerWidth : ratioHeight,
      height: isWidthFixed ? ratioWidth : containerHeight
    };
  },
  changeVideoSize: function changeVideoSize() {
    var $video = this.isYTVideo ? jQuery(this.player.getIframe()) : this.elements.$backgroundVideoHosted,
        size = this.calcVideosSize();
    $video.width(size.width).height(size.height);
  },
  startVideoLoop: function startVideoLoop() {
    var self = this; // If the section has been removed

    if (!self.player.getIframe().contentWindow) {
      return;
    }

    var elementSettings = self.getElementSettings(),
        startPoint = elementSettings.background_video_start || 0,
        endPoint = elementSettings.background_video_end;
    self.player.seekTo(startPoint);

    if (endPoint) {
      var durationToEnd = endPoint - startPoint + 1;
      setTimeout(function () {
        self.startVideoLoop();
      }, durationToEnd * 1000);
    }
  },
  prepareYTVideo: function prepareYTVideo(YT, videoID) {
    var self = this,
        $backgroundVideoContainer = self.elements.$backgroundVideoContainer,
        elementSettings = self.getElementSettings(),
        startStateCode = YT.PlayerState.PLAYING; // Since version 67, Chrome doesn't fire the `PLAYING` state at start time

    if (window.chrome) {
      startStateCode = YT.PlayerState.UNSTARTED;
    }

    $backgroundVideoContainer.addClass('qazana-loading qazana-invisible');
    self.player = new YT.Player(self.elements.$backgroundVideoEmbed[0], {
      videoId: videoID,
      events: {
        onReady: function onReady() {
          self.player.mute();
          self.changeVideoSize();
          self.startVideoLoop();
          self.player.playVideo();
        },
        onStateChange: function onStateChange(event) {
          switch (event.data) {
            case startStateCode:
              $backgroundVideoContainer.removeClass('qazana-invisible qazana-loading');
              break;

            case YT.PlayerState.ENDED:
              self.player.seekTo(elementSettings.background_video_start || 0);
          }
        }
      },
      playerVars: {
        controls: 0,
        rel: 0
      }
    });
    jQuery(window).on('resize', self.changeVideoSize);
  },
  activate: function activate() {
    var self = this,
        videoLink = self.getElementSettings('background_video_link'),
        videoID = qazanaFrontend.utils.youtube.getYoutubeIDFromURL(videoLink);
    self.isYTVideo = !!videoID;

    if (videoID) {
      qazanaFrontend.utils.youtube.onYoutubeApiReady(function (YT) {
        setTimeout(function () {
          self.prepareYTVideo(YT, videoID);
        }, 1);
      });
    } else {
      self.elements.$backgroundVideoHosted.attr('src', videoLink).one('canplay', self.changeVideoSize);
      jQuery(window).on('resize', self.changeVideoSize);
    }
  },
  deactivate: function deactivate() {
    if (this.isYTVideo && this.player.getIframe()) {
      this.player.destroy();
    } else {
      this.elements.$backgroundVideoHosted.removeAttr('src');
    }
  },
  run: function run() {
    var elementSettings = this.getElementSettings();

    if ('video' === elementSettings.background_background && elementSettings.background_video_link) {
      this.activate();
    } else {
      this.deactivate();
    }
  },
  onInit: function onInit() {
    HandlerModule.prototype.onInit.apply(this, arguments);
    this.run();
  },
  onElementChange: function onElementChange(propertyName) {
    if ('background_background' === propertyName) {
      this.run();
    }
  }
});

/***/ }),
/* 387 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var TabsModule = __webpack_require__(168);

module.exports = function ($scope) {
  new TabsModule({
    $element: $scope,
    showTabFn: 'slideDown',
    hideTabFn: 'slideUp'
  });
};

/***/ }),
/* 388 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

module.exports = function ($scope, $) {
  $scope.find('.qazana-alert-dismiss').on('click', function () {
    $(this).parent().fadeOut();
  });
};

/***/ }),
/* 389 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

module.exports = function ($scope, $) {
  var $counter = $scope.find('.qazana-counter-number-value');
  var animation = $counter.data('animation-type');
  var odometer;

  if ('none' === animation) {
    return;
  }

  if ('count' === animation) {
    odometer = new Odometer({
      el: $counter[0],
      animation: 'count'
    });
  } else {
    odometer = new Odometer({
      el: $counter[0]
    });
  }

  qazanaFrontend.waypoint($counter, function () {
    odometer.update($(this).data('to-value'));
  }, {
    offset: '90%'
  });
};

/***/ }),
/* 390 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

module.exports = function ($scope, $) {
  qazanaFrontend.waypoint($scope.find('.qazana-progress-bar'), function () {
    var $progressbar = $(this);
    $progressbar.css('width', $progressbar.data('max') + '%');
  }, {
    offset: '90%'
  });
};

/***/ }),
/* 391 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var TabsModule = __webpack_require__(168);

module.exports = function ($scope) {
  new TabsModule({
    $element: $scope,
    toggleSelf: false
  });
};

/***/ }),
/* 392 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var TabsModule = __webpack_require__(168);

module.exports = function ($scope) {
  new TabsModule({
    $element: $scope,
    showTabFn: 'slideDown',
    hideTabFn: 'slideUp',
    hidePrevious: false,
    autoExpand: 'editor'
  });
};

/***/ }),
/* 393 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(27);

__webpack_require__(1);

var HandlerModule = __webpack_require__(87),
    VideoModule;

VideoModule = HandlerModule.extend({
  getDefaultSettings: function getDefaultSettings() {
    return {
      selectors: {
        imageOverlay: '.qazana-custom-embed-image-overlay',
        video: '.qazana-video',
        videoIframe: '.qazana-video-iframe'
      }
    };
  },
  getDefaultElements: function getDefaultElements() {
    var selectors = this.getSettings('selectors');
    return {
      $imageOverlay: this.$element.find(selectors.imageOverlay),
      $video: this.$element.find(selectors.video),
      $videoIframe: this.$element.find(selectors.videoIframe)
    };
  },
  getLightBox: function getLightBox() {
    return qazanaFrontend.utils.lightbox;
  },
  handleVideo: function handleVideo() {
    if (!this.getElementSettings('lightbox')) {
      this.elements.$imageOverlay.remove();
      this.playVideo();
    }
  },
  playVideo: function playVideo() {
    if (this.elements.$video.length) {
      this.elements.$video[0].play();
      return;
    }

    var $videoIframe = this.elements.$videoIframe,
        lazyLoad = $videoIframe.data('lazy-load');

    if (lazyLoad) {
      $videoIframe.attr('src', lazyLoad);
    }

    var newSourceUrl = $videoIframe[0].src.replace('&autoplay=0', '');
    $videoIframe[0].src = newSourceUrl + '&autoplay=1';
  },
  animateVideo: function animateVideo() {
    this.getLightBox().setEntranceAnimation(this.getElementSettings('lightbox_content_animation'));
  },
  handleAspectRatio: function handleAspectRatio() {
    this.getLightBox().setVideoAspectRatio(this.getElementSettings('aspect_ratio'));
  },
  bindEvents: function bindEvents() {
    this.elements.$imageOverlay.on('click', this.handleVideo);
  },
  onElementChange: function onElementChange(propertyName) {
    if ('lightbox_content_animation' === propertyName) {
      this.animateVideo();
      return;
    }

    var isLightBoxEnabled = this.getElementSettings('lightbox');

    if ('lightbox' === propertyName && !isLightBoxEnabled) {
      this.getLightBox().getModal().hide();
      return;
    }

    if ('aspect_ratio' === propertyName && isLightBoxEnabled) {
      this.handleAspectRatio();
    }
  }
});

module.exports = function ($scope) {
  new VideoModule({
    $element: $scope
  });
};

/***/ }),
/* 394 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

module.exports = function ($scope, $) {
  if ($scope.find('.qazana-tooltip').hasClass('v--show')) {
    return;
  }

  $scope.mouseenter(function () {
    $(this).find('.qazana-tooltip').addClass('v--show');
  }).mouseleave(function () {
    $(this).find('.qazana-tooltip').removeClass('v--show');
  });
};

/***/ }),
/* 395 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(0);

var _parseInt2 = _interopRequireDefault(__webpack_require__(104));

__webpack_require__(1);

var HandlerModule = __webpack_require__(87);

var PieChart = HandlerModule.extend({
  getDefaultSettings: function getDefaultSettings() {
    return {
      selectors: {
        chart: '.qazana-piechart-number',
        number: '.qazana-piechart-number',
        numberValue: '.qazana-piechart-number-value'
      }
    };
  },
  getDefaultElements: function getDefaultElements() {
    var selectors = this.getSettings('selectors'),
        elements = {
      $chart: this.$element.find(selectors.chart),
      $number: this.$element.find(selectors.number),
      $numberValue: this.$element.find(selectors.numberValue)
    };
    return elements;
  },
  onElementChange: function onElementChange(propertyName) {
    if ('starting_number' === propertyName || 'ending_number' === propertyName) {
      this.elements.$number.circleProgress('redraw');
    }
  },
  drawCircle: function drawCircle() {
    var self = this,
        fill = {
      gradient: []
    };
    fill.gradient.push(this.getElementSettings('circle_start_color'));
    fill.gradient.push(this.getElementSettings('circle_end_color'));
    this.elements.$numberValue.html((0, _parseInt2.default)(this.getElementSettings('starting_number')));
    var args = {
      startAngle: -Math.PI / 4 * 2,
      fill: fill,
      emptyFill: 'transparent',
      lineCap: this.getElementSettings('line_cap'),
      animation: {
        duration: this.getElementSettings('duration')
      },
      size: this.getElementSettings('circle_size').size,
      thickness: this.getElementSettings('circle_width').size,
      reverse: true,
      value: this.getElementSettings('ending_number').size / 100
    };

    if ('none' === this.getElementSettings('animation_type')) {
      args.animation = {
        duration: 0
      };
    }

    this.elements.$number.circleProgress(args).on('circle-animation-progress', function (event, progress) {
      self.elements.$numberValue.html((0, _parseInt2.default)(self.elements.$numberValue.data('value') * progress));
    }).on('circle-animation-end', function () {
      self.elements.$chart.addClass('qazana-element-animation-done');
    });
  },
  onInit: function onInit() {
    HandlerModule.prototype.onInit.apply(this, arguments);
    var self = this;
    var animation = {
      duration: this.getElementSettings('duration')
    };

    if (!animation) {
      this.elements.$number.html(this.elements.$number.data('value'));
      this.elements.$chart.addClass('qazana-element-animation-done');
    }

    qazanaFrontend.waypoint(this.elements.$chart, function () {
      if (!self.elements.$chart.hasClass('qazana-element-animation-done')) {
        self.drawCircle();
      }
    }, {
      offset: '90%'
    });
  }
});

module.exports = function ($scope) {
  new PieChart({
    $element: $scope
  });
};

/***/ }),
/* 396 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

var HandlerModule = __webpack_require__(87),
    ImageCarouselHandler;

ImageCarouselHandler = HandlerModule.extend({
  getDefaultSettings: function getDefaultSettings() {
    return {
      selectors: {
        carousel: '.qazana-image-carousel'
      }
    };
  },
  getDefaultElements: function getDefaultElements() {
    var selectors = this.getSettings('selectors');
    return {
      $carousel: this.$element.find(selectors.carousel)
    };
  },
  onInit: function onInit() {
    HandlerModule.prototype.onInit.apply(this, arguments);
    var self = this,
        elementSettings = this.getElementSettings(),
        slidesToShow = +elementSettings.slidesToShow || 3,
        isSingleSlide = 1 === slidesToShow,
        defaultLGDevicesSlidesCount = isSingleSlide ? 1 : 2,
        breakpoints = qazanaFrontend.config.breakpoints,
        addNav = qazanaFrontend.utils.carousel.addNav,
        slickGlobals = qazanaFrontend.utils.carousel.slickGlobals;
    var slickOptions = {
      slidesToShow: slidesToShow,
      autoplay: 'yes' === elementSettings.autoplay,
      autoplaySpeed: elementSettings.autoplaySpeed,
      infinite: 'yes' === elementSettings.infinite,
      pauseOnHover: 'yes' === elementSettings.pauseOnHover,
      speed: elementSettings.speed,
      rtl: 'rtl' === elementSettings.direction,
      responsive: [{
        breakpoint: breakpoints.lg,
        settings: {
          slidesToShow: +elementSettings.slidesToShow_tablet || defaultLGDevicesSlidesCount,
          slidesToScroll: +elementSettings.slidesToScroll_tablet || defaultLGDevicesSlidesCount
        }
      }, {
        breakpoint: breakpoints.md,
        settings: {
          slidesToShow: +elementSettings.slidesToShow_mobile || 1,
          slidesToScroll: +elementSettings.slidesToScroll_mobile || 1
        }
      }]
    };

    if (isSingleSlide) {
      slickOptions.fade = 'fade' === elementSettings.effect;
    } else {
      slickOptions.slidesToScroll = +elementSettings.slidesToScroll || defaultLGDevicesSlidesCount;
    }

    var options = jQuery.extend({}, slickOptions, slickGlobals);
    var navOptions = {
      slidesToScroll: elementSettings.slidesToScroll,
      arrows: -1 !== ['arrows', 'both'].indexOf(elementSettings.navigation),
      dots: -1 !== ['dots', 'both'].indexOf(elementSettings.navigation)
    }; // after slick is initialized (these wouldn't work properly if done before init);

    this.elements.$carousel.on('init', function (event, slick) {
      addNav(self.$element, slick.$slider, navOptions);
    });
    this.elements.$carousel.slick(options);
  }
});

module.exports = function ($scope) {
  new ImageCarouselHandler({
    $element: $scope
  });
};

/***/ }),
/* 397 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(47);

__webpack_require__(27);

__webpack_require__(1);

var HandlerModule = __webpack_require__(87),
    TextEditor;

TextEditor = HandlerModule.extend({
  dropCapLetter: '',
  getDefaultSettings: function getDefaultSettings() {
    return {
      selectors: {
        paragraph: 'p:first'
      },
      classes: {
        dropCap: 'qazana-drop-cap',
        dropCapLetter: 'qazana-drop-cap-letter'
      }
    };
  },
  getDefaultElements: function getDefaultElements() {
    var selectors = this.getSettings('selectors'),
        classes = this.getSettings('classes'),
        $dropCap = jQuery('<span>', {
      class: classes.dropCap
    }),
        $dropCapLetter = jQuery('<span>', {
      class: classes.dropCapLetter
    });
    $dropCap.append($dropCapLetter);
    return {
      $paragraph: this.$element.find(selectors.paragraph),
      $dropCap: $dropCap,
      $dropCapLetter: $dropCapLetter
    };
  },
  getElementName: function getElementName() {
    return 'text-editor';
  },
  wrapDropCap: function wrapDropCap() {
    var isDropCapEnabled = this.getElementSettings('drop_cap');

    if (!isDropCapEnabled) {
      // If there is an old drop cap inside the paragraph
      if (this.dropCapLetter) {
        this.elements.$dropCap.remove();
        this.elements.$paragraph.prepend(this.dropCapLetter);
        this.dropCapLetter = '';
      }

      return;
    }

    var $paragraph = this.elements.$paragraph;

    if (!$paragraph.length) {
      return;
    }

    var paragraphContent = $paragraph.html().replace(/&nbsp;/g, ' '),
        firstLetterMatch = paragraphContent.match(/^ *([^ ] ?)/);

    if (!firstLetterMatch) {
      return;
    }

    var firstLetter = firstLetterMatch[1],
        trimmedFirstLetter = firstLetter.trim(); // Don't apply drop cap when the content starting with an HTML tag

    if ('<' === trimmedFirstLetter) {
      return;
    }

    this.dropCapLetter = firstLetter;
    this.elements.$dropCapLetter.text(trimmedFirstLetter);
    var restoredParagraphContent = paragraphContent.slice(firstLetter.length).replace(/^ */, function (match) {
      return new Array(match.length + 1).join('&nbsp;');
    });
    $paragraph.html(restoredParagraphContent).prepend(this.elements.$dropCap);
  },
  onInit: function onInit() {
    HandlerModule.prototype.onInit.apply(this, arguments);
    this.wrapDropCap();
  },
  onElementChange: function onElementChange(propertyName) {
    if ('drop_cap' === propertyName) {
      this.wrapDropCap();
    }
  }
});

module.exports = function ($scope) {
  new TextEditor({
    $element: $scope
  });
};

/***/ }),
/* 398 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

var HandlerModule = __webpack_require__(87),
    SpaceModule;

SpaceModule = HandlerModule.extend({
  onElementChange: function onElementChange(propertyName) {
    if ('space' === propertyName) {
      var space = this.getElementSettings('space');
      this.$element.find('.qazana-space-resize-value').html('Spacing: ' + space.size + space.unit);
    }
  },
  onInit: function onInit() {
    if (!qazanaFrontend.isEditMode()) {
      return;
    }

    var space = this.getElementSettings('space');
    var text = '<span class="qazana-space-resize-value">Spacing: ' + space.size + space.unit + '</span>';
    this.$element.find('.qazana-spacer-inner').html(text);
  }
});

module.exports = function ($scope) {
  new SpaceModule({
    $element: $scope
  });
};

/***/ }),
/* 399 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

var HandlerModule = __webpack_require__(87),
    GlobalHandler;

GlobalHandler = HandlerModule.extend({
  getElementName: function getElementName() {
    return 'global';
  },
  animate: function animate() {
    var animationDuration,
        self = this,
        $element = this.$element,
        animation = this.getAnimation(),
        elementSettings = this.getElementSettings(),
        duration = elementSettings._animation_duration || '',
        animationDelay = elementSettings._animation_delay || elementSettings.animation_delay || 0;

    if ('fast' === duration) {
      animationDuration = '500';
    } else if ('slow' === duration) {
      animationDuration = '2000';
    } else {
      animationDuration = '1000';
    }

    $element.removeClass('qazana-element-animation-done').removeClass(self.prevAnimation);
    $element.css({
      'animation-duration': animationDuration + 'ms'
    });
    qazanaFrontend.waypoint($element, function () {
      setTimeout(function () {
        self.prevAnimation = animation;
        $element.addClass(animation).addClass('qazana-element-animation-done');
      }, animationDelay);
    }, {
      offset: '90%'
    });
  },
  getAnimation: function getAnimation() {
    var elementSettings = this.getElementSettings();
    return elementSettings._animation_animated && elementSettings._animation_in;
  },
  removeLoader: function removeLoader() {
    this.$element.find('.qazana-loading-indicator').remove();
    this.$element.removeClass('qazana-has-loading-indicator');
    jQuery(window).trigger('resize');
  },
  onInit: function onInit() {
    HandlerModule.prototype.onInit.apply(this, arguments);
    this.removeLoader();

    if ('animated' === this.getElementSettings('_animation_animated')) {
      this.animate();
    }
  },
  onElementChange: function onElementChange(propertyName) {
    if (/^_?animation/.test(propertyName)) {
      this.animate();
    }
  }
});

module.exports = function ($scope) {
  new GlobalHandler({
    $element: $scope
  });
};

/***/ }),
/* 400 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

module.exports = function ($scope, $) {
  if (!qazanaFrontend.isEditMode()) {
    return;
  }

  if ($scope.hasClass('qazana-widget-edit-disabled')) {
    return;
  }

  $scope.find('.qazana-element').each(function () {
    qazanaFrontend.elementsHandler.runReadyTrigger($(this));
  });
};

/***/ }),
/* 401 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(47);

var ViewModule = __webpack_require__(40);

module.exports = ViewModule.extend({
  getDefaultSettings: function getDefaultSettings() {
    return {
      isInserted: false,
      APISrc: 'https://www.youtube.com/iframe_api',
      selectors: {
        firstScript: 'script:first'
      }
    };
  },
  getDefaultElements: function getDefaultElements() {
    return {
      $firstScript: jQuery(this.getSettings('selectors.firstScript'))
    };
  },
  insertYTAPI: function insertYTAPI() {
    this.setSettings('isInserted', true);
    this.elements.$firstScript.before(jQuery('<script>', {
      src: this.getSettings('APISrc')
    }));
  },
  onYoutubeApiReady: function onYoutubeApiReady(callback) {
    var self = this;

    if (!self.getSettings('IsInserted')) {
      self.insertYTAPI();
    }

    if (window.YT && YT.loaded) {
      callback(YT);
    } else {
      // If not ready check again by timeout..
      setTimeout(function () {
        self.onYoutubeApiReady(callback);
      }, 350);
    }
  },
  getYoutubeIDFromURL: function getYoutubeIDFromURL(url) {
    var videoIDParts = url.match(/^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?vi?=|(?:embed|v|vi|user)\/))([^?&"'>]+)/);
    return videoIDParts && videoIDParts[1];
  }
});

/***/ }),
/* 402 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(47);

var ViewModule = __webpack_require__(40);

module.exports = ViewModule.extend({
  getDefaultSettings: function getDefaultSettings() {
    return {
      isInserted: false,
      APISrc: 'https://f.vimeocdn.com/js/froogaloop2.min.js',
      // using froogaloop2. New vimeo js api is dead buggy
      selectors: {
        firstScript: 'script:first'
      }
    };
  },
  getDefaultElements: function getDefaultElements() {
    return {
      $firstScript: jQuery(this.getSettings('selectors.firstScript'))
    };
  },
  insertVimeoAPI: function insertVimeoAPI() {
    this.setSettings('isInserted', true);
    this.elements.$firstScript.before(jQuery('<script>', {
      src: this.getSettings('APISrc')
    }));
  },
  onVimeoApiReady: function onVimeoApiReady(callback) {
    var self = this;

    if (!self.getSettings('IsInserted')) {
      self.insertVimeoAPI();
    }

    if (window.$f) {
      callback($f);
    } else {
      // If not ready check again by timeout..
      setTimeout(function () {
        self.onVimeoApiReady(callback);
      }, 350);
    }
  },
  getVimeoIDFromURL: function getVimeoIDFromURL(url) {
    var videoIDParts = url.match(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
    return videoIDParts && videoIDParts[1];
  }
});

/***/ }),
/* 403 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ViewModule = __webpack_require__(40);

module.exports = ViewModule.extend({
  getDefaultSettings: function getDefaultSettings() {
    return {
      scrollDuration: 500,
      selectors: {
        links: 'a[href*="#"]',
        targets: '.qazana-element, .qazana-menu-anchor',
        scrollable: 'html, body'
      }
    };
  },
  getDefaultElements: function getDefaultElements() {
    var $ = jQuery,
        selectors = this.getSettings('selectors');
    return {
      $scrollable: $(selectors.scrollable)
    };
  },
  bindEvents: function bindEvents() {
    qazanaFrontend.getElements('$document').on('click', this.getSettings('selectors.links'), this.handleAnchorLinks);
  },
  handleAnchorLinks: function handleAnchorLinks(event) {
    var clickedLink = event.currentTarget,
        isSamePathname = location.pathname === clickedLink.pathname,
        isSameHostname = location.hostname === clickedLink.hostname;

    if (!isSameHostname || !isSamePathname || clickedLink.hash.length < 2) {
      return;
    }

    var $anchor = jQuery(clickedLink.hash).filter(this.getSettings('selectors.targets'));

    if (!$anchor.length) {
      return;
    }

    var scrollTop = $anchor.offset().top,
        $wpAdminBar = qazanaFrontend.getElements('$wpAdminBar'),
        $activeStickies = jQuery('.qazana-sticky--active'),
        maxStickyHeight = 0;

    if ($wpAdminBar.length > 0) {
      scrollTop -= $wpAdminBar.height();
    } // Offset height of tallest sticky


    if ($activeStickies.length > 0) {
      maxStickyHeight = Math.max.apply(null, $activeStickies.map(function () {
        return jQuery(this).outerHeight();
      }).get());
      scrollTop -= maxStickyHeight;
    }

    event.preventDefault();
    scrollTop = qazanaFrontend.hooks.applyFilters('frontend/handlers/menu_anchor/scroll_top_distance', scrollTop);
    this.elements.$scrollable.animate({
      scrollTop: scrollTop
    }, this.getSettings('scrollDuration'), 'linear');
  },
  onInit: function onInit() {
    ViewModule.prototype.onInit.apply(this, arguments);
    this.bindEvents();
  }
});

/***/ }),
/* 404 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

__webpack_require__(27);

var ViewModule = __webpack_require__(40),
    LightboxModule;

LightboxModule = ViewModule.extend({
  oldAspectRatio: null,
  oldAnimation: null,
  swiper: null,
  getDefaultSettings: function getDefaultSettings() {
    return {
      classes: {
        aspectRatio: 'qazana-aspect-ratio-%s',
        item: 'qazana-lightbox-item',
        image: 'qazana-lightbox-image',
        videoContainer: 'qazana-video-container',
        videoWrapper: 'qazana-fit-aspect-ratio',
        playButton: 'qazana-custom-embed-play',
        playButtonIcon: 'fa',
        playing: 'qazana-playing',
        hidden: 'qazana-hidden',
        invisible: 'qazana-invisible',
        preventClose: 'qazana-lightbox-prevent-close',
        slideshow: {
          container: 'swiper-container',
          slidesWrapper: 'swiper-wrapper',
          prevButton: 'qazana-swiper-button qazana-swiper-button-prev',
          nextButton: 'qazana-swiper-button qazana-swiper-button-next',
          prevButtonIcon: 'eicon-chevron-left',
          nextButtonIcon: 'eicon-chevron-right',
          slide: 'swiper-slide'
        }
      },
      selectors: {
        links: 'a[data-qazana-lightbox]',
        slideshow: {
          activeSlide: '.swiper-slide-active',
          prevSlide: '.swiper-slide-prev',
          nextSlide: '.swiper-slide-next'
        }
      },
      modalOptions: {
        id: 'qazana-lightbox',
        entranceAnimation: 'zoomIn',
        videoAspectRatio: 169,
        position: {
          enable: false
        }
      }
    };
  },
  getModal: function getModal() {
    if (!LightboxModule.modal) {
      this.initModal();
    }

    return LightboxModule.modal;
  },
  initModal: function initModal() {
    var modal = LightboxModule.modal = qazanaFrontend.getDialogsManager().createWidget('lightbox', {
      className: 'qazana-lightbox',
      closeButton: true,
      closeButtonClass: 'eicon-close',
      selectors: {
        preventClose: '.' + this.getSettings('classes.preventClose')
      },
      hide: {
        onClick: true
      }
    });
    modal.on('hide', function () {
      modal.setMessage('');
    });
  },
  showModal: function showModal(options) {
    var self = this,
        defaultOptions = self.getDefaultSettings().modalOptions;
    self.setSettings('modalOptions', jQuery.extend(defaultOptions, options.modalOptions));
    var modal = self.getModal();
    modal.setID(self.getSettings('modalOptions.id'));

    modal.onShow = function () {
      DialogsManager.getWidgetType('lightbox').prototype.onShow.apply(modal, arguments);
      setTimeout(function () {
        self.setEntranceAnimation();
      }, 10);
    };

    modal.onHide = function () {
      DialogsManager.getWidgetType('lightbox').prototype.onHide.apply(modal, arguments);
      modal.getElements('widgetContent').removeClass('animated');
    };

    switch (options.type) {
      case 'image':
        self.setImageContent(options.url);
        break;

      case 'video':
        self.setVideoContent(options);
        break;

      case 'slideshow':
        self.setSlideshowContent(options.slideshow);
        break;

      default:
        self.setHTMLContent(options.html);
    }

    modal.show();
  },
  setHTMLContent: function setHTMLContent(html) {
    this.getModal().setMessage(html);
  },
  setImageContent: function setImageContent(imageURL) {
    var self = this,
        classes = self.getSettings('classes'),
        $item = jQuery('<div>', {
      class: classes.item
    }),
        $image = jQuery('<img>', {
      src: imageURL,
      class: classes.image + ' ' + classes.preventClose
    });
    $item.append($image);
    self.getModal().setMessage($item);
  },
  setVideoContent: function setVideoContent(options) {
    var classes = this.getSettings('classes'),
        $videoContainer = jQuery('<div>', {
      class: classes.videoContainer
    }),
        $videoWrapper = jQuery('<div>', {
      class: classes.videoWrapper
    }),
        $videoElement,
        modal = this.getModal();

    if ('hosted' === options.videoType) {
      var videoParams = {
        src: options.url,
        autoplay: ''
      };
      options.videoParams.forEach(function (param) {
        videoParams[param] = '';
      });
      $videoElement = jQuery('<video>', videoParams);
    } else {
      var videoURL = options.url.replace('&autoplay=0', '') + '&autoplay=1';
      $videoElement = jQuery('<iframe>', {
        src: videoURL,
        allowfullscreen: 1
      });
    }

    $videoContainer.append($videoWrapper);
    $videoWrapper.append($videoElement);
    modal.setMessage($videoContainer);
    this.setVideoAspectRatio();
    var onHideMethod = modal.onHide;

    modal.onHide = function () {
      onHideMethod();
      modal.getElements('message').removeClass('qazana-fit-aspect-ratio');
    };
  },
  setSlideshowContent: function setSlideshowContent(options) {
    var $ = jQuery,
        self = this,
        classes = self.getSettings('classes'),
        slideshowClasses = classes.slideshow,
        $container = $('<div>', {
      class: slideshowClasses.container
    }),
        $slidesWrapper = $('<div>', {
      class: slideshowClasses.slidesWrapper
    }),
        $prevButton = $('<div>', {
      class: slideshowClasses.prevButton + ' ' + classes.preventClose
    }).html($('<i>', {
      class: slideshowClasses.prevButtonIcon
    })),
        $nextButton = $('<div>', {
      class: slideshowClasses.nextButton + ' ' + classes.preventClose
    }).html($('<i>', {
      class: slideshowClasses.nextButtonIcon
    }));
    options.slides.forEach(function (slide) {
      var slideClass = slideshowClasses.slide + ' ' + classes.item;

      if (slide.video) {
        slideClass += ' ' + classes.video;
      }

      var $slide = $('<div>', {
        class: slideClass
      });

      if (slide.video) {
        $slide.attr('data-qazana-slideshow-video', slide.video);
        var $playIcon = $('<div>', {
          class: classes.playButton
        }).html($('<i>', {
          class: classes.playButtonIcon
        }));
        $slide.append($playIcon);
      } else {
        var $zoomContainer = $('<div>', {
          class: 'swiper-zoom-container'
        }),
            $slideImage = $('<img>', {
          class: classes.image + ' ' + classes.preventClose,
          src: slide.image
        });
        $zoomContainer.append($slideImage);
        $slide.append($zoomContainer);
      }

      $slidesWrapper.append($slide);
    });
    $container.append($slidesWrapper, $prevButton, $nextButton);
    var modal = self.getModal();
    modal.setMessage($container);
    var onShowMethod = modal.onShow;

    modal.onShow = function () {
      onShowMethod();
      var swiperOptions = {
        navigation: {
          prevEl: $prevButton,
          nextEl: $nextButton
        },
        pagination: {
          clickable: true
        },
        on: {
          slideChangeTransitionEnd: self.onSlideChange
        },
        grabCursor: true,
        runCallbacksOnInit: false,
        loop: true,
        keyboard: true
      };

      if (options.swiper) {
        $.extend(swiperOptions, options.swiper);
      }

      self.swiper = new Swiper($container, swiperOptions);
      self.setVideoAspectRatio();
      self.playSlideVideo();
    };
  },
  setVideoAspectRatio: function setVideoAspectRatio(aspectRatio) {
    aspectRatio = aspectRatio || this.getSettings('modalOptions.videoAspectRatio');
    var $widgetContent = this.getModal().getElements('widgetContent'),
        oldAspectRatio = this.oldAspectRatio,
        aspectRatioClass = this.getSettings('classes.aspectRatio');
    this.oldAspectRatio = aspectRatio;

    if (oldAspectRatio) {
      $widgetContent.removeClass(aspectRatioClass.replace('%s', oldAspectRatio));
    }

    if (aspectRatio) {
      $widgetContent.addClass(aspectRatioClass.replace('%s', aspectRatio));
    }
  },
  getSlide: function getSlide(slideState) {
    return jQuery(this.swiper.slides).filter(this.getSettings('selectors.slideshow.' + slideState + 'Slide'));
  },
  playSlideVideo: function playSlideVideo() {
    var $activeSlide = this.getSlide('active'),
        videoURL = $activeSlide.data('qazana-slideshow-video');

    if (!videoURL) {
      return;
    }

    var classes = this.getSettings('classes'),
        $videoContainer = jQuery('<div>', {
      class: classes.videoContainer + ' ' + classes.invisible
    }),
        $videoWrapper = jQuery('<div>', {
      class: classes.videoWrapper
    }),
        $videoFrame = jQuery('<iframe>', {
      src: videoURL
    }),
        $playIcon = $activeSlide.children('.' + classes.playButton);
    $videoContainer.append($videoWrapper);
    $videoWrapper.append($videoFrame);
    $activeSlide.append($videoContainer);
    $playIcon.addClass(classes.playing).removeClass(classes.hidden);
    $videoFrame.on('load', function () {
      $playIcon.addClass(classes.hidden);
      $videoContainer.removeClass(classes.invisible);
    });
  },
  setEntranceAnimation: function setEntranceAnimation(animation) {
    animation = animation || this.getSettings('modalOptions.entranceAnimation');
    var $widgetMessage = this.getModal().getElements('message');

    if (this.oldAnimation) {
      $widgetMessage.removeClass(this.oldAnimation);
    }

    this.oldAnimation = animation;

    if (animation) {
      $widgetMessage.addClass('animated ' + animation);
    }
  },
  isLightboxLink: function isLightboxLink(element) {
    if ('A' === element.tagName && !/\.(png|jpe?g|gif|svg)$/i.test(element.href)) {
      return false;
    }

    var generalOpenInLightbox = qazanaFrontend.getGeneralSettings('qazana_global_image_lightbox'),
        currentLinkOpenInLightbox = element.dataset.qazanaOpenLightbox;
    return 'yes' === currentLinkOpenInLightbox || generalOpenInLightbox && 'no' !== currentLinkOpenInLightbox;
  },
  openLink: function openLink(event) {
    var element = event.currentTarget,
        $target = jQuery(event.target),
        editMode = qazanaFrontend.isEditMode(),
        isClickInsideQazana = !!$target.closest('#qazana').length;

    if (!this.isLightboxLink(element)) {
      if (editMode && isClickInsideQazana) {
        event.preventDefault();
      }

      return;
    }

    event.preventDefault();

    if (editMode && !qazanaFrontend.getGeneralSettings('qazana_enable_lightbox_in_editor')) {
      return;
    }

    var lightboxData = {};

    if (element.dataset.qazanaLightbox) {
      lightboxData = JSON.parse(element.dataset.qazanaLightbox);
    }

    if (lightboxData.type && 'slideshow' !== lightboxData.type) {
      this.showModal(lightboxData);
      return;
    }

    if (!element.dataset.qazanaLightboxSlideshow) {
      this.showModal({
        type: 'image',
        url: element.href
      });
      return;
    }

    var slideshowID = element.dataset.qazanaLightboxSlideshow;
    var $allSlideshowLinks = jQuery(this.getSettings('selectors.links')).filter(function () {
      return slideshowID === this.dataset.qazanaLightboxSlideshow;
    });
    var slides = [],
        uniqueLinks = {};
    $allSlideshowLinks.each(function () {
      var slideVideo = this.dataset.qazanaLightboxVideo,
          uniqueID = slideVideo || this.href;

      if (uniqueLinks[uniqueID]) {
        return;
      }

      uniqueLinks[uniqueID] = true;
      var slideIndex = this.dataset.qazanaLightboxIndex;

      if (undefined === slideIndex) {
        slideIndex = $allSlideshowLinks.index(this);
      }

      var slideData = {
        image: this.href,
        index: slideIndex
      };

      if (slideVideo) {
        slideData.video = slideVideo;
      }

      slides.push(slideData);
    });
    slides.sort(function (a, b) {
      return a.index - b.index;
    });
    var initialSlide = element.dataset.qazanaLightboxIndex;

    if (undefined === initialSlide) {
      initialSlide = $allSlideshowLinks.index(element);
    }

    this.showModal({
      type: 'slideshow',
      modalOptions: {
        id: 'qazana-lightbox-slideshow-' + slideshowID
      },
      slideshow: {
        slides: slides,
        swiper: {
          initialSlide: +initialSlide
        }
      }
    });
  },
  bindEvents: function bindEvents() {
    qazanaFrontend.getElements('$document').on('click', this.getSettings('selectors.links'), this.openLink);
  },
  onInit: function onInit() {
    ViewModule.prototype.onInit.apply(this, arguments);

    if (qazanaFrontend.isEditMode()) {
      qazana.settings.general.model.on('change', this.onGeneralSettingsChange);
    }
  },
  onGeneralSettingsChange: function onGeneralSettingsChange(model) {
    if ('qazana_lightbox_content_animation' in model.changed) {
      this.setSettings('modalOptions.entranceAnimation', model.changed.qazana_lightbox_content_animation);
      this.setEntranceAnimation();
    }
  },
  onSlideChange: function onSlideChange() {
    this.getSlide('prev').add(this.getSlide('next')).add(this.getSlide('active')).find('.' + this.getSettings('classes.videoWrapper')).remove();
    this.playSlideVideo();
  }
});
module.exports = LightboxModule;

/***/ }),
/* 405 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

var ViewModule = __webpack_require__(40),
    CarouselModule;

CarouselModule = ViewModule.extend({
  slickGlobals: {
    dots: true,
    // Change the slider's direction to become right-to-left
    accessibility: false,
    // Enables tabbing and arrow key navigation
    asNavFor: null,
    // Set the slider to be the navigation of other slider (Class or ID Name)
    appendArrows: null,
    // Change where the navigation arrows are attached (Selector, htmlString, Array, Element, jQuery object)
    prevArrow: null,
    // Allows you to select a node or customize the HTML for the "Previous" arrow.
    nextArrow: null,
    // Allows you to select a node or customize the HTML for the "Next" arrow.
    centerMode: false,
    // Enables centered view with partial prev/next slides. Use with odd numbered slidesToShow counts.
    draggable: window.Modernizr && true === window.Modernizr.touch || function checkTouch() {
      return !!('ontouchstart' in window || window.DocumentTouch && doc instanceof window.DocumentTouch);
    }(),
    // Enable mouse dragging
    centerPadding: '50px',
    // Side padding when in center mode (px or %)
    cssEase: 'cubic-bezier(.29,1,.29,1)',
    // Custom easing. See http://cubic-bezier.com/#.29,1,.29,1 Mimicking Greenshock Power4.Ease-Out
    focusOnSelect: false,
    // Enable focus on selected element (click)
    easing: 'linear',
    // Add easing for jQuery animate. Use with easing libraries or default easing methods
    lazyLoad: 'ondemand',
    // Set lazy loading technique. Accepts 'ondemand' or 'progressive'.
    pauseOnDotsHover: true,
    // Pause Autoplay when a dot is hovered
    slide: 'div',
    // Element query to use as slide
    swipe: true,
    // Enable swiping
    touchMove: true,
    // Enable slide motion with touch
    touchThreshold: 5,
    // To advance slides, the user must swipe a length of (1/touchThreshold) * the width of the slider.
    useCSS: true,
    // Enable/Disable CSS Transitions
    vertical: false,
    // Vertical slide mode
    rtl: false // Change the slider's direction to become right-to-left

  },
  addNav: function addNav($scope, $slick, settings) {
    if ($scope.data('has-nav')) {
      return;
    }

    var $dots = $scope.find('.slick-dots'); // slick has already been initialized, so we know the dots are already in the DOM;

    if (settings.dots && $dots.length <= 0) {
      $dots = $scope.append("<ul class='slick-dots' />"); // slick has already been initialized, so we know the dots are already in the DOM;
    }

    if (settings.arrows) {
      // wrap the $dots so we can put our arrows next to them;
      $scope.append('<div class="slick-navigation" />');
      $scope.find('.slick-navigation').prepend('<a class="prev"><i class="ricon ricon-slider-arrow-left"></i></a>').append('<a class="next"><i class="ricon ricon-slider-arrow-right"></i></a>');

      if ($slick.length && settings.slidesToScroll) {
        // attach previous button events;
        $scope.find('a.prev').on('click', function () {
          $slick.slick('slickGoTo', $slick.slick('slickCurrentSlide') - settings.slidesToScroll);
        }).end() // attach next button events;
        .find('a.next').on('click', function () {
          $slick.slick('slickGoTo', $slick.slick('slickCurrentSlide') + settings.slidesToScroll);
        });
      }
    }

    $scope.data('has-nav', 'true');
  },
  Carousel: function Carousel() {
    HandlerModule.prototype.onInit.apply(this, arguments);
    var self = this,
        elementSettings = this.getElementSettings(),
        slidesToShow = +elementSettings.slidesToShow || 3,
        isSingleSlide = 1 === slidesToShow,
        defaultLGDevicesSlidesCount = isSingleSlide ? 1 : 2,
        breakpoints = qazanaFrontend.config.breakpoints;
    var slickOptions = {
      slidesToShow: slidesToShow,
      autoplay: 'yes' === elementSettings.autoplay,
      autoplaySpeed: elementSettings.autoplaySpeed,
      infinite: 'yes' === elementSettings.infinite,
      pauseOnHover: 'yes' === elementSettings.pauseOnHover,
      speed: elementSettings.speed,
      arrows: -1 !== ['arrows', 'both'].indexOf(elementSettings.navigation),
      dots: -1 !== ['dots', 'both'].indexOf(elementSettings.navigation),
      rtl: 'rtl' === elementSettings.direction,
      responsive: [{
        breakpoint: breakpoints.lg,
        settings: {
          slidesToShow: +elementSettings.slidesToShow_tablet || defaultLGDevicesSlidesCount,
          slidesToScroll: +elementSettings.slidesToScroll_tablet || defaultLGDevicesSlidesCount
        }
      }, {
        breakpoint: breakpoints.md,
        settings: {
          slidesToShow: +elementSettings.slidesToShow_mobile || 1,
          slidesToScroll: +elementSettings.slidesToScroll_mobile || 1
        }
      }]
    };

    if (isSingleSlide) {
      slickOptions.fade = 'fade' === elementSettings.effect;
    } else {
      slickOptions.slidesToScroll = +elementSettings.slidesToScroll || defaultLGDevicesSlidesCount;
    }

    var options = jQuery.extend({}, this.slickGlobals, slickOptions);
    this.elements.$carousel.slick(options); // after slick is initialized (these wouldn't work properly if done before init);

    this.elements.$carousel.on('init', function (event, slick) {
      // add the navigation.
      self.addNav(self.$element, slick.$slider, options);
    });
  }
});
module.exports = CarouselModule;

/***/ }),
/* 406 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ViewModule = __webpack_require__(40);

module.exports = ViewModule.extend({
  getDefaultSettings: function getDefaultSettings() {
    return {
      element: null,
      direction: qazanaFrontend.config.is_rtl ? 'right' : 'left',
      selectors: {
        container: window
      }
    };
  },
  getDefaultElements: function getDefaultElements() {
    return {
      $element: jQuery(this.getSettings('element'))
    };
  },
  stretch: function stretch() {
    var containerSelector = this.getSettings('selectors.container'),
        $container;

    try {
      $container = jQuery(containerSelector);
    } catch (e) {}

    if (!$container || !$container.length) {
      $container = jQuery(this.getDefaultSettings().selectors.container);
    }

    this.reset();
    var $element = this.elements.$element,
        containerWidth = $container.outerWidth(),
        elementOffset = $element.offset().left,
        isFixed = 'fixed' === $element.css('position'),
        correctOffset = isFixed ? 0 : elementOffset;

    if (window !== $container[0]) {
      var containerOffset = $container.offset().left;

      if (isFixed) {
        correctOffset = containerOffset;
      }

      if (elementOffset > containerOffset) {
        correctOffset = elementOffset - containerOffset;
      }
    }

    if (!isFixed) {
      if (qazanaFrontend.config.is_rtl) {
        correctOffset = containerWidth - ($element.outerWidth() + correctOffset);
      }

      correctOffset = -correctOffset;
    }

    var css = {};
    css.width = containerWidth + 'px';
    css[this.getSettings('direction')] = correctOffset + 'px';
    $element.css(css);
  },
  reset: function reset() {
    var css = {};
    css.width = '';
    css[this.getSettings('direction')] = '';
    this.elements.$element.css(css);
  }
});

/***/ })
/******/ ]);
//# sourceMappingURL=frontend.js.map
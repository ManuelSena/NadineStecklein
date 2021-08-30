webpackJsonp([3],{

/***/ 127:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ 128:
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(216);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ 216:
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ 808:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(809);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(128)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../node_modules/css-loader/index.js!./site.css", function() {
		var newContent = require("!!../../node_modules/css-loader/index.js!./site.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 809:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(127)(false);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Quicksand:400,500,700);", ""]);

// module
exports.push([module.i, "#root {\r\n    /*height: 100vh;*/\r\n    margin: 0;\r\n    background-image: linear-gradient(45deg, #FF7400 30%,#0E2FEB 90%);\r\n}\r\n\r\nbody > container {\r\n    padding-left:200px;\r\n    padding-bottom: 100px;\r\n}\r\n\r\nhtml,\r\nbody {\r\n    padding: 0;\r\n    box-sizing: border-box;\r\n    font-family: \"Quicksand\", sans-serif;\r\n    font-size: 62.5%;\r\n    font-size: 15px;\r\n    background-position: center;\r\n    background-size: cover;\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n/*-- Inspiration taken from abdo steif -->\r\n/* --> https://codepen.io/abdosteif/pen/bRoyMb?editors=1100*/\r\n.container {\r\n    padding: 0px;\r\n    /*margin-left: 0px;*/\r\n    padding-bottom: 80px\r\n}\r\n\r\n.private {\r\n    color: white;\r\n}\r\n.contact {\r\n    display: block;\r\n    text-align: center;\r\n    padding: 0 40px 0 40px;\r\n}\r\n.podcast {\r\n    padding-bottom: 70px;\r\n    color: white;\r\n    text-align: center;\r\n}\r\n.positionfour {\r\n    font-style: italic;\r\n}\r\n.podcast h2 {\r\n    margin-bottom: 20px;\r\n}\r\n.tg-section-title {\r\n    text-align: center;\r\n}\r\n.tg-section-heading {\r\n    text-align: center;\r\n}\r\n.glow {\r\n    padding-left: 10px;\r\n    font-size: 40px;\r\n    color: #ffffff;\r\n    text-align: center;\r\n    -webkit-animation: glow 1s ease-in-out infinite alternate;\r\n    -moz-animation: glow 1s ease-in-out infinite alternate;\r\n    animation: glow 1s ease-in-out infinite alternate;\r\n}\r\n\r\n@-webkit-keyframes glow {\r\n    from {\r\n        text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #f2f2f2, 0 0 40px #ff0000, 0 0 50px #ff0000, 0 0 60px #ff0000, 0 0 70px #ff0000;\r\n    }\r\n\r\n    to {\r\n        text-shadow: 0 0 20px #ff0000, 0 0 30px #ff0000, 0 0 40px #ff0000, 0 0 50px #ff0000, 0 0 60px #ff0000, 0 0 70px #ff0000, 0 0 80px #ff0000;\r\n    }\r\n}\r\n\r\n/* Navbar section */\r\n\r\n.tg-main-section {\r\n    background: url('https://s3-us-west-1.amazonaws.com/elicit.us/App+Images/chalkboard.jpg');\r\n}\r\n\r\n.hero-image {\r\n    background-image: url(\"https://nadinestecklein.s3.us-west-2.amazonaws.com/NadineHomeSplashTop.png\");\r\n    background-position: center;\r\n    background-repeat: no-repeat;\r\n    background-size: cover;\r\n    \r\n    /*position: relative;*/\r\n}\r\n\r\n    .hero-image a {\r\n        background-image: linear-gradient(to right, #29323c, #485563, #2b5876, #4e4376);\r\n        box-shadow: 0 4px 15px 0 rgba(45, 54, 65, 0.75);\r\n    }\r\n\r\n.nav {\r\n    width: 100%;\r\n    height: 85px;\r\n    position: fixed;\r\n    line-height: 35px;\r\n    text-align: right;\r\n    top: 0;\r\n    left: 0;\r\n    bottom: auto;\r\n}\r\n\r\n    .nav div.logo {\r\n        float: left;\r\n        width: auto;\r\n        height: auto;\r\n        padding-left: 1rem;\r\n    }\r\n\r\n        .nav div.logo a {\r\n            text-decoration: none;\r\n            color: #fff;\r\n            font-size: 2.5rem;\r\n        }\r\n\r\n            .nav div.logo a:hover {\r\n                color: black;\r\n            }\r\n\r\n    .nav div.main_list {\r\n        height: 65px;\r\n        float: right;\r\n    }\r\n\r\n        .nav div.main_list ul {\r\n            width: 100%;\r\n            height: 65px;\r\n            display: flex;\r\n            list-style: none;\r\n            margin: 0;\r\n            padding: 0;\r\n        }\r\n\r\n            .nav div.main_list ul li {\r\n                width: auto;\r\n                height: 65px;\r\n                padding: 0;\r\n                padding-right: 3rem;\r\n            }\r\n\r\n                .nav div.main_list ul li a {\r\n                    text-decoration: none;\r\n                    color: #fff;\r\n                    line-height: 65px;\r\n                    font-size: 2.4rem;\r\n                }\r\n\r\n                    .nav div.main_list ul li a:hover {\r\n                        color: #00E676;\r\n                    }\r\n\r\n.mainListDiv a .btn:active {\r\n}\r\n\r\n.eheader {\r\n}\r\n\r\n.social-media a {\r\n    margin-left: 5px;\r\n}\r\n\r\n.meetthesegents {\r\n    margin-top: 30px;\r\n}\r\n/* Home section */\r\n.btn {\r\n    color: white;\r\n}\r\n\r\n.contactus {\r\n    color: white;\r\n    margin-top: 50px;\r\n    -webkit-animation: glow 1s ease-in-out infinite alternate;\r\n    -moz-animation: glow 1s ease-in-out infinite alternate;\r\n    animation: glow 1s ease-in-out infinite alternate;\r\n}\r\n\r\n.navTrigger {\r\n    display: none;\r\n}\r\n\r\n.nav {\r\n    -webkit-transition: all 0.4s ease;\r\n    transition: all 0.4s ease;\r\n}\r\n\r\n.fa {\r\n    padding: 20px;\r\n    font-size: 30px;\r\n    width: 30px;\r\n    text-align: center;\r\n    text-decoration: none;\r\n    border-radius: 50%;\r\n}\r\n\r\n.fa-linkedin {\r\n    background-color: #0e76a8;\r\n    color: white;\r\n    height: 40px;\r\n    width: 40px;\r\n    padding-top: 4px;\r\n    padding-left: 8px;\r\n}\r\n\r\n.fa-facebook {\r\n    background-color: #4267b2;\r\n    color: white;\r\n    padding-top: 4.5px;\r\n    padding-left: 10.5px;\r\n    height: 40px;\r\n    width: 40px;\r\n}\r\n\r\n.fa-instagram {\r\n    color: white;\r\n    padding-top: 4.5px;\r\n    padding-left: 7.5px;\r\n    height: 40px;\r\n    width: 40px;\r\n    background: radial-gradient(circle farthest-corner at 35% 90%, #fec564, transparent 50%), radial-gradient(circle farthest-corner at 0 140%, #fec564, transparent 50%), radial-gradient(ellipse farthest-corner at 0 -25%, #5258cf, transparent 50%), radial-gradient(ellipse farthest-corner at 20% -50%, #5258cf, transparent 50%), radial-gradient(ellipse farthest-corner at 100% 0, #893dc2, transparent 50%), radial-gradient(ellipse farthest-corner at 60% -20%, #893dc2, transparent 50%), radial-gradient(ellipse farthest-corner at 100% 100%, #d9317a, transparent), linear-gradient(#6559ca, #bc318f 30%, #e33f5f 50%, #f77638 70%, #fec66d 100%);\r\n}\r\n\r\na:hover {\r\n    text-decoration: none;\r\n}\r\n\r\n.logo {\r\n    opacity: 0.2;\r\n    height: 10px;\r\n    width: 10px;\r\n}\r\n\r\n.logoimage {\r\n    height: 100px;\r\n    width: 100px;\r\n}\r\n\r\n.tg-commentform {\r\n    color: white;\r\n    padding-bottom: 20px;\r\n}\r\n\r\n.home {\r\n    background-color: black;\r\n    padding-top: 100px;\r\n    text-align: center;\r\n    color: white;\r\n    font-size: 30px;\r\n}\r\n/*footer*/\r\n.fixed-bottom {\r\n    position: fixed;\r\n    width: 100%;\r\n    left: 0px;\r\n    bottom: 0px;\r\n    /*height: 70px;*/\r\n    background-color: transparent !Important;\r\n}\r\n\r\n.ep-footer {\r\n}\r\n\r\n.ep-footerbar {\r\n    width: 100%;\r\n    float: left;\r\n    background-color: transparent !Important;\r\n}\r\n\r\n.ep-copyright {\r\n    color: #fff;\r\n    float: left;\r\n    padding: 20px 10px;\r\n    font-size: 15px;\r\n    line-height: 20px;\r\n}\r\n\r\n.footer-nav ul {\r\n    list-style-type: none;\r\n    margin: 0;\r\n    padding: 35px;\r\n    padding-top: 13px;\r\n    \r\n}\r\n\r\n.privacy {\r\n    padding-top: 20px;\r\n    padding-right: 15px;\r\n    color: #fff;\r\n    display: block;\r\n    line-height: 20px;\r\n    background: transparent;\r\n    text-decoration: underline;\r\n    border: none;\r\n}\r\n\r\n.tep-footernav ul {\r\n    width: 100%;\r\n    line-height: 20px;\r\n    list-style: none;\r\n}\r\n\r\n\r\n\r\n/* Media qurey section */\r\n\r\n@media screen and (min-width: 789px) and (max-width: 1024px) {\r\n    .container {\r\n        margin: 0;\r\n        padding-bottom: 30px\r\n    }\r\n}\r\n\r\n@media screen and (max-width:789px) {\r\n    .navTrigger {\r\n        display: block;\r\n    }\r\n\r\n    .nav div.logo {\r\n        margin-left: 15px;\r\n    }\r\n\r\n    .nav div.main_list {\r\n        width: 100%;\r\n        height: 0;\r\n        overflow: hidden;\r\n    }\r\n\r\n    .nav div.show_list {\r\n        height: auto;\r\n        display: none;\r\n    }\r\n\r\n    .nav div.main_list ul {\r\n        flex-direction: column;\r\n        width: 100%;\r\n        height: 100vh;\r\n        right: 0;\r\n        left: 0;\r\n        bottom: 0;\r\n        background-color: #111;\r\n        background-position: center top;\r\n    }\r\n\r\n        .nav div.main_list ul li {\r\n            width: 100%;\r\n            text-align: right;\r\n        }\r\n\r\n            .nav div.main_list ul li a {\r\n                text-align: center;\r\n                width: 100%;\r\n                font-size: 3rem;\r\n                padding: 20px;\r\n            }\r\n\r\n    .nav div.media_button {\r\n        display: block;\r\n    }\r\n}\r\n\r\n\r\n/* Animation */\r\n/* Inspiration taken from Dicson https://codemyui.com/simple-hamburger-menu-x-mark-animation/ */\r\n\r\n.navTrigger {\r\n    cursor: pointer;\r\n    width: 30px;\r\n    height: 25px;\r\n    margin: auto;\r\n    position: absolute;\r\n    right: 30px;\r\n    top: 0;\r\n    bottom: 0;\r\n}\r\n\r\n    .navTrigger i {\r\n        background-color: #fff;\r\n        border-radius: 2px;\r\n        content: '';\r\n        display: block;\r\n        width: 100%;\r\n        height: 4px;\r\n    }\r\n\r\n        .navTrigger i:nth-child(1) {\r\n            -webkit-animation: outT 0.8s backwards;\r\n            animation: outT 0.8s backwards;\r\n            -webkit-animation-direction: reverse;\r\n            animation-direction: reverse;\r\n        }\r\n\r\n        .navTrigger i:nth-child(2) {\r\n            margin: 5px 0;\r\n            -webkit-animation: outM 0.8s backwards;\r\n            animation: outM 0.8s backwards;\r\n            -webkit-animation-direction: reverse;\r\n            animation-direction: reverse;\r\n        }\r\n\r\n        .navTrigger i:nth-child(3) {\r\n            -webkit-animation: outBtm 0.8s backwards;\r\n            animation: outBtm 0.8s backwards;\r\n            -webkit-animation-direction: reverse;\r\n            animation-direction: reverse;\r\n        }\r\n\r\n    .navTrigger.active i:nth-child(1) {\r\n        -webkit-animation: inT 0.8s forwards;\r\n        animation: inT 0.8s forwards;\r\n    }\r\n\r\n    .navTrigger.active i:nth-child(2) {\r\n        -webkit-animation: inM 0.8s forwards;\r\n        animation: inM 0.8s forwards;\r\n    }\r\n\r\n    .navTrigger.active i:nth-child(3) {\r\n        -webkit-animation: inBtm 0.8s forwards;\r\n        animation: inBtm 0.8s forwards;\r\n    }\r\n\r\n@-webkit-keyframes inM {\r\n    50% {\r\n        -webkit-transform: rotate(0deg);\r\n    }\r\n\r\n    100% {\r\n        -webkit-transform: rotate(45deg);\r\n    }\r\n}\r\n\r\n@keyframes inM {\r\n    50% {\r\n        transform: rotate(0deg);\r\n    }\r\n\r\n    100% {\r\n        transform: rotate(45deg);\r\n    }\r\n}\r\n\r\n@-webkit-keyframes outM {\r\n    50% {\r\n        -webkit-transform: rotate(0deg);\r\n    }\r\n\r\n    100% {\r\n        -webkit-transform: rotate(45deg);\r\n    }\r\n}\r\n\r\n@keyframes outM {\r\n    50% {\r\n        transform: rotate(0deg);\r\n    }\r\n\r\n    100% {\r\n        transform: rotate(45deg);\r\n    }\r\n}\r\n\r\n@-webkit-keyframes inT {\r\n    0% {\r\n        -webkit-transform: translateY(0px) rotate(0deg);\r\n    }\r\n\r\n    50% {\r\n        -webkit-transform: translateY(9px) rotate(0deg);\r\n    }\r\n\r\n    100% {\r\n        -webkit-transform: translateY(9px) rotate(135deg);\r\n    }\r\n}\r\n\r\n@keyframes inT {\r\n    0% {\r\n        transform: translateY(0px) rotate(0deg);\r\n    }\r\n\r\n    50% {\r\n        transform: translateY(9px) rotate(0deg);\r\n    }\r\n\r\n    100% {\r\n        transform: translateY(9px) rotate(135deg);\r\n    }\r\n}\r\n\r\n@-webkit-keyframes outT {\r\n    0% {\r\n        -webkit-transform: translateY(0px) rotate(0deg);\r\n    }\r\n\r\n    50% {\r\n        -webkit-transform: translateY(9px) rotate(0deg);\r\n    }\r\n\r\n    100% {\r\n        -webkit-transform: translateY(9px) rotate(135deg);\r\n    }\r\n}\r\n\r\n@keyframes outT {\r\n    0% {\r\n        transform: translateY(0px) rotate(0deg);\r\n    }\r\n\r\n    50% {\r\n        transform: translateY(9px) rotate(0deg);\r\n    }\r\n\r\n    100% {\r\n        transform: translateY(9px) rotate(135deg);\r\n    }\r\n}\r\n\r\n@-webkit-keyframes inBtm {\r\n    0% {\r\n        -webkit-transform: translateY(0px) rotate(0deg);\r\n    }\r\n\r\n    50% {\r\n        -webkit-transform: translateY(-9px) rotate(0deg);\r\n    }\r\n\r\n    100% {\r\n        -webkit-transform: translateY(-9px) rotate(135deg);\r\n    }\r\n}\r\n\r\n@keyframes inBtm {\r\n    0% {\r\n        transform: translateY(0px) rotate(0deg);\r\n    }\r\n\r\n    50% {\r\n        transform: translateY(-9px) rotate(0deg);\r\n    }\r\n\r\n    100% {\r\n        transform: translateY(-9px) rotate(135deg);\r\n    }\r\n}\r\n\r\n@-webkit-keyframes outBtm {\r\n    0% {\r\n        -webkit-transform: translateY(0px) rotate(0deg);\r\n    }\r\n\r\n    50% {\r\n        -webkit-transform: translateY(-9px) rotate(0deg);\r\n    }\r\n\r\n    100% {\r\n        -webkit-transform: translateY(-9px) rotate(135deg);\r\n    }\r\n}\r\n\r\n@keyframes outBtm {\r\n    0% {\r\n        transform: translateY(0px) rotate(0deg);\r\n    }\r\n\r\n    50% {\r\n        transform: translateY(-9px) rotate(0deg);\r\n    }\r\n\r\n    100% {\r\n        transform: translateY(-9px) rotate(135deg);\r\n    }\r\n}\r\n\r\n.affix {\r\n    padding: 0;\r\n    background-color: #111;\r\n}\r\n\r\n\r\n\r\n\r\n\r\n\r\n.myH2 {\r\n    text-align: center;\r\n    font-size: 4rem;\r\n}\r\n\r\n.myP {\r\n    text-align: justify;\r\n    padding-left: 15%;\r\n    padding-right: 15%;\r\n    font-size: 20px;\r\n}\r\n\r\n@media all and (max-width:700px) {\r\n    .myP {\r\n        padding: 2%;\r\n    }\r\n}\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n/**\r\n.container {\r\n    padding-top: 50px;\r\n    margin-bottom: 50px;\r\n}\r\n.fixed-bottom {\r\n    position: fixed;\r\n    top: auto;\r\n    left: 0;\r\n    bottom: 0;\r\n    width: 100%;\r\n    background-color: #000000;\r\n    text-align: center;\r\n}\r\n.navbar .nav .active, .navbar-default .navbar-nav > .active > a, .navbar-default .navbar-nav > .active > a:hover, .navbar-default .navbar-nav > .active > a:focus {\r\n    background: #e7e7e7 !important;\r\n    color: #333 !important;\r\n}\r\nbody > #root {\r\n    height: 100vh;\r\n    margin: 0;\r\n}\r\n/*.nav {\r\n    width: 100%;\r\n    height: 65px;\r\n    position: fixed;\r\n    line-height: 65px;\r\n    text-align: center;\r\n}\r\n    .nav div.logo {\r\n        float: left;\r\n        width: auto;\r\n        height: auto;\r\n        padding-left: 3rem;\r\n    }\r\n        .nav div.logo a {\r\n            text-decoration: none;\r\n            color: #fff;\r\n            font-size: 2.5rem;\r\n        }\r\n            .nav div.logo a:hover {\r\n                color: #00E676;\r\n            }\r\n    .nav div.main_list {\r\n        height: 65px;\r\n        float: right;\r\n    }\r\n        .nav div.main_list ul {\r\n            width: 100%;\r\n            height: 65px;\r\n            display: flex;\r\n            list-style: none;\r\n            margin: 0;\r\n            padding: 0;\r\n        }\r\n            .nav div.main_list ul li {\r\n                width: auto;\r\n                height: 65px;\r\n                padding: 0;\r\n                padding-right: 3rem;\r\n            }\r\n                .nav div.main_list ul li a {\r\n                    text-decoration: none;\r\n                    color: #fff;\r\n                    line-height: 65px;\r\n                    font-size: 2.4rem;\r\n                }\r\n                    .nav div.main_list ul li a:hover {\r\n                        color: #00E676;\r\n                    }\r\n.home {\r\n    width: 100%;\r\n    height: 100vh;\r\n    background-image: url(https://s3-us-west-1.amazonaws.com/elicit.us/elicitLogo.jpg);\r\n    background-position: center top;\r\n    background-size: cover;\r\n}\r\n.navTrigger {\r\n    display: none;\r\n}\r\n.nav {\r\n    padding-top: 20px;\r\n    padding-bottom: 20px;\r\n    -webkit-transition: all 0.4s ease;\r\n    transition: all 0.4s ease;\r\n}*/\r\n\r\n\r\n\r\n/*html, body {\r\n    width: 100%;\r\n    height: 100%;\r\n    margin: 0;\r\n    padding: 0;\r\n    background: black;\r\n    color: black;*/\r\n/* The image used */\r\n/*background-image: url(\"img_parallax.jpg\");*/\r\n/* Set a specific height */\r\n/*min-height: 500px;*/\r\n/* Create the parallax scrolling effect */\r\n/*background-attachment: fixed;\r\n    background-position: center;\r\n    background-repeat: no-repeat;\r\n    background-size: cover;\r\n}/*\r\n.glow {\r\n    font-size: 80px;\r\n    color: #ffffff;\r\n    text-align: center;\r\n    -webkit-animation: glow 1s ease-in-out infinite alternate;\r\n    -moz-animation: glow 1s ease-in-out infinite alternate;\r\n    animation: glow 1s ease-in-out infinite alternate;\r\n}\r\n@-webkit-keyframes glow {\r\n    from {\r\n        text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #f2f2f2, 0 0 40px #ff0000, 0 0 50px #ff0000, 0 0 60px #ff0000, 0 0 70px #ff0000;\r\n    }\r\n    to {\r\n        text-shadow: 0 0 20px #ff0000, 0 0 30px #ff0000, 0 0 40px #ff0000, 0 0 50px #ff0000, 0 0 60px #ff0000, 0 0 70px #ff0000, 0 0 80px #ff0000;\r\n    }\r\n}\r\n/*HEADER*/\r\n/**\r\n.fixed-top {\r\n    position: fixed;\r\n    top: 0;\r\n    right: 0;\r\n    left: 0;\r\n    z-index: 1030;\r\n}\r\n/*BODY*/\r\n/**\r\n.ep-haslayout {\r\n    width: 100%;\r\n    float: left;\r\n}\r\n.ep-main-section {\r\n    padding: 80px 0;\r\n    overflow: hidden;\r\n}\r\n    .ep-main-section > div {\r\n        position: relative;\r\n    }\r\n/*FOOTER*/\r\n\r\n/**\r\n.ep-footer {\r\n    background: #000000;\r\n}\r\n.ep-footerbar {\r\n    width: 100%;\r\n    float: left;\r\n    background: #000000;\r\n}\r\n.ep-copyright {\r\n    color: #fff;\r\n    float: left;\r\n    padding: 20px 0;\r\n    font-size: 12px;\r\n    line-height: 20px;\r\n}\r\n.ep-footernav {\r\n    float: right;\r\n    font-size: 14px;\r\n    line-height: 20px;\r\n    font-weight: 300;\r\n    padding: 20px 0;\r\n    font-family: 'Oswald', Arial, Helvetica, sans-serif;\r\n}\r\n.tep-footernav ul {\r\n    width: 100%;\r\n    float: left;\r\n    line-height: 20px;\r\n    list-style: none;\r\n}\r\n.ep-footernav ul li {\r\n    float: left;\r\n    line-height: 20px;\r\n    padding: 0 0 0 20px;\r\n    list-style-type: none;\r\n}\r\n    .ep-footernav ul li a {\r\n        color: #fff;\r\n        display: block;\r\n        line-height: 20px;\r\n    }\r\n  **/\r\n", ""]);

// exports


/***/ })

},[808]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL3VybHMuanMiLCJ3ZWJwYWNrOi8vLy4vY3NzL3NpdGUuY3NzPzBlNDMiLCJ3ZWJwYWNrOi8vLy4vY3NzL3NpdGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxnQkFBZ0I7QUFDbkQsSUFBSTtBQUNKO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLG9CQUFvQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsY0FBYzs7QUFFbEU7QUFDQTs7Ozs7Ozs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQSxjQUFjLG1CQUFPLENBQUMsR0FBUTs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQixtQkFBbUI7QUFDcEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLHNCQUFzQjtBQUN2Qzs7QUFFQTtBQUNBLG1CQUFtQiwyQkFBMkI7O0FBRTlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0IsbUJBQW1CO0FBQ25DO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsMkJBQTJCO0FBQzVDO0FBQ0E7O0FBRUEsUUFBUSx1QkFBdUI7QUFDL0I7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQSxpQkFBaUIsdUJBQXVCO0FBQ3hDO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZCxrREFBa0Qsc0JBQXNCO0FBQ3hFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEOztBQUVBLDZCQUE2QixtQkFBbUI7O0FBRWhEOztBQUVBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ3RYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNB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YSx3QkFBd0IsdUJBQXVCLDJCQUEyQixrRUFBa0UsK0RBQStELDBEQUEwRCxLQUFLLDZCQUE2QixjQUFjLGdKQUFnSixTQUFTLFlBQVksc0pBQXNKLFNBQVMsS0FBSyxxQ0FBcUMsd0JBQXdCLGVBQWUsaUJBQWlCLGdCQUFnQixzQkFBc0IsS0FBSyxzQ0FBc0Msb0JBQW9CLG9CQUFvQixLQUFLLHNCQUFzQix3QkFBd0IseUJBQXlCLEtBQUssZ0NBQWdDLCtCQUErQixTQUFTLHlDQUF5Qyw0QkFBNEIsS0FBSyxtQkFBbUIsb0JBQW9CLG9CQUFvQiw0QkFBNEIsS0FBSyxtQkFBbUIsb0JBQW9CLG9CQUFvQix3QkFBd0Isd0JBQXdCLDBCQUEwQixLQUFLLG1CQUFtQixxQkFBcUIsd0JBQXdCLDBCQUEwQix5QkFBeUIsd0JBQXdCLDREQUE0RCxLQUFLLHVCQUF1QixvQkFBb0Isb0JBQW9CLDBCQUEwQix5QkFBeUIsS0FBSyx5QkFBeUIsb0JBQW9CLDBCQUEwQiw0QkFBNEIsOEJBQThCLEtBQUssK0JBQStCLHdCQUF3QiwyQkFBMkIsOEJBQThCLFNBQVM7O0FBRTM4akIiLCJmaWxlIjoiYXBwU3R5bGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGNvbnRlbnQgKyBcIn1cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG5cdHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcblx0dmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXHRpZiAoIWNzc01hcHBpbmcpIHtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxuXG5cdGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcblx0XHR2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuXHRcdFx0cmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHR2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcblx0dmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcblxuXHRyZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAxMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAyIDMiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuXG52YXIgc3R5bGVzSW5Eb20gPSB7fTtcblxudmFyXHRtZW1vaXplID0gZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRyZXR1cm4gbWVtbztcblx0fTtcbn07XG5cbnZhciBpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XG5cdC8vIFRlc3QgZm9yIElFIDw9IDkgYXMgcHJvcG9zZWQgYnkgQnJvd3NlcmhhY2tzXG5cdC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcblx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlclxuXHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0Ly8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG5cdHJldHVybiB3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYjtcbn0pO1xuXG52YXIgZ2V0VGFyZ2V0ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xufTtcblxudmFyIGdldEVsZW1lbnQgPSAoZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vID0ge307XG5cblx0cmV0dXJuIGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgICAgICAgICAgIC8vIElmIHBhc3NpbmcgZnVuY3Rpb24gaW4gb3B0aW9ucywgdGhlbiB1c2UgaXQgZm9yIHJlc29sdmUgXCJoZWFkXCIgZWxlbWVudC5cbiAgICAgICAgICAgICAgICAvLyBVc2VmdWwgZm9yIFNoYWRvdyBSb290IHN0eWxlIGkuZVxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgIGluc2VydEludG86IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZm9vXCIpLnNoYWRvd1Jvb3QgfVxuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0dmFyIHN0eWxlVGFyZ2V0ID0gZ2V0VGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcblx0XHRcdC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG5cdFx0XHRpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Ly8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcblx0XHRcdFx0XHQvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuXHRcdFx0XHRcdHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG5cdFx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHRcdHN0eWxlVGFyZ2V0ID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG5cdFx0fVxuXHRcdHJldHVybiBtZW1vW3RhcmdldF1cblx0fTtcbn0pKCk7XG5cbnZhciBzaW5nbGV0b24gPSBudWxsO1xudmFyXHRzaW5nbGV0b25Db3VudGVyID0gMDtcbnZhclx0c3R5bGVzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xuXG52YXJcdGZpeFVybHMgPSByZXF1aXJlKFwiLi91cmxzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcblx0aWYgKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xuXHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcblx0fVxuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdG9wdGlvbnMuYXR0cnMgPSB0eXBlb2Ygb3B0aW9ucy5hdHRycyA9PT0gXCJvYmplY3RcIiA/IG9wdGlvbnMuYXR0cnMgOiB7fTtcblxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAoIW9wdGlvbnMuc2luZ2xldG9uICYmIHR5cGVvZiBvcHRpb25zLnNpbmdsZXRvbiAhPT0gXCJib29sZWFuXCIpIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG4gICAgICAgIGlmICghb3B0aW9ucy5pbnNlcnRJbnRvKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0QXQpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucyk7XG5cblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlIChuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcblx0XHR9XG5cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIGRvbVN0eWxlLnBhcnRzW2pdKCk7XG5cblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbSAoc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMgKGxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pIHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZSBuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQgKG9wdGlvbnMsIHN0eWxlKSB7XG5cdHZhciB0YXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblxuXHRpZiAoIXRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcFtzdHlsZXNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYgKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgdGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZiAobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0XHR9XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlKTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0fSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJvYmplY3RcIiAmJiBvcHRpb25zLmluc2VydEF0LmJlZm9yZSkge1xuXHRcdHZhciBuZXh0U2libGluZyA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvICsgXCIgXCIgKyBvcHRpb25zLmluc2VydEF0LmJlZm9yZSk7XG5cdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbmV4dFNpYmxpbmcpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIltTdHlsZSBMb2FkZXJdXFxuXFxuIEludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnICgnb3B0aW9ucy5pbnNlcnRBdCcpIGZvdW5kLlxcbiBNdXN0IGJlICd0b3AnLCAnYm90dG9tJywgb3IgT2JqZWN0LlxcbiAoaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIjaW5zZXJ0YXQpXFxuXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudCAoc3R5bGUpIHtcblx0aWYgKHN0eWxlLnBhcmVudE5vZGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblx0c3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZSk7XG5cblx0dmFyIGlkeCA9IHN0eWxlc0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZSk7XG5cdGlmKGlkeCA+PSAwKSB7XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblxuXHRhZGRBdHRycyhzdHlsZSwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZSk7XG5cblx0cmV0dXJuIHN0eWxlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuXG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0b3B0aW9ucy5hdHRycy5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblxuXHRhZGRBdHRycyhsaW5rLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmspO1xuXG5cdHJldHVybiBsaW5rO1xufVxuXG5mdW5jdGlvbiBhZGRBdHRycyAoZWwsIGF0dHJzKSB7XG5cdE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRlbC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlIChvYmosIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlLCB1cGRhdGUsIHJlbW92ZSwgcmVzdWx0O1xuXG5cdC8vIElmIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIHdhcyBkZWZpbmVkLCBydW4gaXQgb24gdGhlIGNzc1xuXHRpZiAob3B0aW9ucy50cmFuc2Zvcm0gJiYgb2JqLmNzcykge1xuXHQgICAgcmVzdWx0ID0gb3B0aW9ucy50cmFuc2Zvcm0ob2JqLmNzcyk7XG5cblx0ICAgIGlmIChyZXN1bHQpIHtcblx0ICAgIFx0Ly8gSWYgdHJhbnNmb3JtIHJldHVybnMgYSB2YWx1ZSwgdXNlIHRoYXQgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBydW5uaW5nIHJ1bnRpbWUgdHJhbnNmb3JtYXRpb25zIG9uIHRoZSBjc3MuXG5cdCAgICBcdG9iai5jc3MgPSByZXN1bHQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgXHQvLyBJZiB0aGUgdHJhbnNmb3JtIGZ1bmN0aW9uIHJldHVybnMgYSBmYWxzeSB2YWx1ZSwgZG9uJ3QgYWRkIHRoaXMgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBjb25kaXRpb25hbCBsb2FkaW5nIG9mIGNzc1xuXHQgICAgXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICBcdFx0Ly8gbm9vcFxuXHQgICAgXHR9O1xuXHQgICAgfVxuXHR9XG5cblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG5cblx0XHRzdHlsZSA9IHNpbmdsZXRvbiB8fCAoc2luZ2xldG9uID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcblxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgZmFsc2UpO1xuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgdHJ1ZSk7XG5cblx0fSBlbHNlIGlmIChcblx0XHRvYmouc291cmNlTWFwICYmXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIlxuXHQpIHtcblx0XHRzdHlsZSA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZSwgb3B0aW9ucyk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblxuXHRcdFx0aWYoc3R5bGUuaHJlZikgVVJMLnJldm9rZU9iamVjdFVSTChzdHlsZS5ocmVmKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHN0eWxlID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZSk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblx0XHR9O1xuXHR9XG5cblx0dXBkYXRlKG9iaik7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlIChuZXdPYmopIHtcblx0XHRpZiAobmV3T2JqKSB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdG5ld09iai5jc3MgPT09IG9iai5jc3MgJiZcblx0XHRcdFx0bmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiZcblx0XHRcdFx0bmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcFxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZSgpO1xuXHRcdH1cblx0fTtcbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuXG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG5cdH07XG59KSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnIChzdHlsZSwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcblxuXHRpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlLmNoaWxkTm9kZXM7XG5cblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlLnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcblxuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0c3R5bGUuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGUuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcgKHN0eWxlLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcblxuXHRpZihtZWRpYSkge1xuXHRcdHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxuXHR9XG5cblx0aWYoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcblx0fSBlbHNlIHtcblx0XHR3aGlsZShzdHlsZS5maXJzdENoaWxkKSB7XG5cdFx0XHRzdHlsZS5yZW1vdmVDaGlsZChzdHlsZS5maXJzdENoaWxkKTtcblx0XHR9XG5cblx0XHRzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMaW5rIChsaW5rLCBvcHRpb25zLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG5cdC8qXG5cdFx0SWYgY29udmVydFRvQWJzb2x1dGVVcmxzIGlzbid0IGRlZmluZWQsIGJ1dCBzb3VyY2VtYXBzIGFyZSBlbmFibGVkXG5cdFx0YW5kIHRoZXJlIGlzIG5vIHB1YmxpY1BhdGggZGVmaW5lZCB0aGVuIGxldHMgdHVybiBjb252ZXJ0VG9BYnNvbHV0ZVVybHNcblx0XHRvbiBieSBkZWZhdWx0LiAgT3RoZXJ3aXNlIGRlZmF1bHQgdG8gdGhlIGNvbnZlcnRUb0Fic29sdXRlVXJscyBvcHRpb25cblx0XHRkaXJlY3RseVxuXHQqL1xuXHR2YXIgYXV0b0ZpeFVybHMgPSBvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyA9PT0gdW5kZWZpbmVkICYmIHNvdXJjZU1hcDtcblxuXHRpZiAob3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgfHwgYXV0b0ZpeFVybHMpIHtcblx0XHRjc3MgPSBmaXhVcmxzKGNzcyk7XG5cdH1cblxuXHRpZiAoc291cmNlTWFwKSB7XG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XG5cdH1cblxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcblxuXHR2YXIgb2xkU3JjID0gbGluay5ocmVmO1xuXG5cdGxpbmsuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKSBVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBpZCA9IDEyOFxuLy8gbW9kdWxlIGNodW5rcyA9IDIgMyIsIlxuLyoqXG4gKiBXaGVuIHNvdXJjZSBtYXBzIGFyZSBlbmFibGVkLCBgc3R5bGUtbG9hZGVyYCB1c2VzIGEgbGluayBlbGVtZW50IHdpdGggYSBkYXRhLXVyaSB0b1xuICogZW1iZWQgdGhlIGNzcyBvbiB0aGUgcGFnZS4gVGhpcyBicmVha3MgYWxsIHJlbGF0aXZlIHVybHMgYmVjYXVzZSBub3cgdGhleSBhcmUgcmVsYXRpdmUgdG8gYVxuICogYnVuZGxlIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiBPbmUgc29sdXRpb24gaXMgdG8gb25seSB1c2UgZnVsbCB1cmxzLCBidXQgdGhhdCBtYXkgYmUgaW1wb3NzaWJsZS5cbiAqXG4gKiBJbnN0ZWFkLCB0aGlzIGZ1bmN0aW9uIFwiZml4ZXNcIiB0aGUgcmVsYXRpdmUgdXJscyB0byBiZSBhYnNvbHV0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgcGFnZSBsb2NhdGlvbi5cbiAqXG4gKiBBIHJ1ZGltZW50YXJ5IHRlc3Qgc3VpdGUgaXMgbG9jYXRlZCBhdCBgdGVzdC9maXhVcmxzLmpzYCBhbmQgY2FuIGJlIHJ1biB2aWEgdGhlIGBucG0gdGVzdGAgY29tbWFuZC5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gIC8vIGdldCBjdXJyZW50IGxvY2F0aW9uXG4gIHZhciBsb2NhdGlvbiA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmxvY2F0aW9uO1xuXG4gIGlmICghbG9jYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaXhVcmxzIHJlcXVpcmVzIHdpbmRvdy5sb2NhdGlvblwiKTtcbiAgfVxuXG5cdC8vIGJsYW5rIG9yIG51bGw/XG5cdGlmICghY3NzIHx8IHR5cGVvZiBjc3MgIT09IFwic3RyaW5nXCIpIHtcblx0ICByZXR1cm4gY3NzO1xuICB9XG5cbiAgdmFyIGJhc2VVcmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIGxvY2F0aW9uLmhvc3Q7XG4gIHZhciBjdXJyZW50RGlyID0gYmFzZVVybCArIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL1teXFwvXSokLywgXCIvXCIpO1xuXG5cdC8vIGNvbnZlcnQgZWFjaCB1cmwoLi4uKVxuXHQvKlxuXHRUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBqdXN0IGEgd2F5IHRvIHJlY3Vyc2l2ZWx5IG1hdGNoIGJyYWNrZXRzIHdpdGhpblxuXHRhIHN0cmluZy5cblxuXHQgL3VybFxccypcXCggID0gTWF0Y2ggb24gdGhlIHdvcmQgXCJ1cmxcIiB3aXRoIGFueSB3aGl0ZXNwYWNlIGFmdGVyIGl0IGFuZCB0aGVuIGEgcGFyZW5zXG5cdCAgICggID0gU3RhcnQgYSBjYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAoPzogID0gU3RhcnQgYSBub24tY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgICAgIFteKShdICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAoPzogID0gU3RhcnQgYW5vdGhlciBub24tY2FwdHVyaW5nIGdyb3Vwc1xuXHQgICAgICAgICAgICAgICAgIFteKShdKyAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICAgICAgW14pKF0qICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIFxcKSAgPSBNYXRjaCBhIGVuZCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKSAgPSBFbmQgR3JvdXBcbiAgICAgICAgICAgICAgKlxcKSA9IE1hdGNoIGFueXRoaW5nIGFuZCB0aGVuIGEgY2xvc2UgcGFyZW5zXG4gICAgICAgICAgKSAgPSBDbG9zZSBub24tY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgKiAgPSBNYXRjaCBhbnl0aGluZ1xuICAgICAgICkgID0gQ2xvc2UgY2FwdHVyaW5nIGdyb3VwXG5cdCBcXCkgID0gTWF0Y2ggYSBjbG9zZSBwYXJlbnNcblxuXHQgL2dpICA9IEdldCBhbGwgbWF0Y2hlcywgbm90IHRoZSBmaXJzdC4gIEJlIGNhc2UgaW5zZW5zaXRpdmUuXG5cdCAqL1xuXHR2YXIgZml4ZWRDc3MgPSBjc3MucmVwbGFjZSgvdXJsXFxzKlxcKCgoPzpbXikoXXxcXCgoPzpbXikoXSt8XFwoW14pKF0qXFwpKSpcXCkpKilcXCkvZ2ksIGZ1bmN0aW9uKGZ1bGxNYXRjaCwgb3JpZ1VybCkge1xuXHRcdC8vIHN0cmlwIHF1b3RlcyAoaWYgdGhleSBleGlzdClcblx0XHR2YXIgdW5xdW90ZWRPcmlnVXJsID0gb3JpZ1VybFxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL15cIiguKilcIiQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSlcblx0XHRcdC5yZXBsYWNlKC9eJyguKiknJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KTtcblxuXHRcdC8vIGFscmVhZHkgYSBmdWxsIHVybD8gbm8gY2hhbmdlXG5cdFx0aWYgKC9eKCN8ZGF0YTp8aHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvfGZpbGU6XFwvXFwvXFwvfFxccyokKS9pLnRlc3QodW5xdW90ZWRPcmlnVXJsKSkge1xuXHRcdCAgcmV0dXJuIGZ1bGxNYXRjaDtcblx0XHR9XG5cblx0XHQvLyBjb252ZXJ0IHRoZSB1cmwgdG8gYSBmdWxsIHVybFxuXHRcdHZhciBuZXdVcmw7XG5cblx0XHRpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvL1wiKSA9PT0gMCkge1xuXHRcdCAgXHQvL1RPRE86IHNob3VsZCB3ZSBhZGQgcHJvdG9jb2w/XG5cdFx0XHRuZXdVcmwgPSB1bnF1b3RlZE9yaWdVcmw7XG5cdFx0fSBlbHNlIGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHVybFxuXHRcdFx0bmV3VXJsID0gYmFzZVVybCArIHVucXVvdGVkT3JpZ1VybDsgLy8gYWxyZWFkeSBzdGFydHMgd2l0aCAnLydcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gY3VycmVudCBkaXJlY3Rvcnlcblx0XHRcdG5ld1VybCA9IGN1cnJlbnREaXIgKyB1bnF1b3RlZE9yaWdVcmwucmVwbGFjZSgvXlxcLlxcLy8sIFwiXCIpOyAvLyBTdHJpcCBsZWFkaW5nICcuLydcblx0XHR9XG5cblx0XHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIHVybCguLi4pXG5cdFx0cmV0dXJuIFwidXJsKFwiICsgSlNPTi5zdHJpbmdpZnkobmV3VXJsKSArIFwiKVwiO1xuXHR9KTtcblxuXHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIGNzc1xuXHRyZXR1cm4gZml4ZWRDc3M7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGlkID0gMjE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMiAzIiwiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vc2l0ZS5jc3NcIik7XG5cbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuXG52YXIgdHJhbnNmb3JtO1xudmFyIGluc2VydEludG87XG5cblxuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG5vcHRpb25zLmluc2VydEludG8gPSB1bmRlZmluZWQ7XG5cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcblxuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG5cbmlmKG1vZHVsZS5ob3QpIHtcblx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vc2l0ZS5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL3NpdGUuY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jc3Mvc2l0ZS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDgwOFxuLy8gbW9kdWxlIGNodW5rcyA9IDMiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKGZhbHNlKTtcbi8vIGltcG9ydHNcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIkBpbXBvcnQgdXJsKGh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzP2ZhbWlseT1RdWlja3NhbmQ6NDAwLDUwMCw3MDApO1wiLCBcIlwiXSk7XG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiI3Jvb3Qge1xcclxcbiAgICAvKmhlaWdodDogMTAwdmg7Ki9cXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoNDVkZWcsICNGRjc0MDAgMzAlLCMwRTJGRUIgOTAlKTtcXHJcXG59XFxyXFxuXFxyXFxuYm9keSA+IGNvbnRhaW5lciB7XFxyXFxuICAgIHBhZGRpbmctbGVmdDoyMDBweDtcXHJcXG4gICAgcGFkZGluZy1ib3R0b206IDEwMHB4O1xcclxcbn1cXHJcXG5cXHJcXG5odG1sLFxcclxcbmJvZHkge1xcclxcbiAgICBwYWRkaW5nOiAwO1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbiAgICBmb250LWZhbWlseTogXFxcIlF1aWNrc2FuZFxcXCIsIHNhbnMtc2VyaWY7XFxyXFxuICAgIGZvbnQtc2l6ZTogNjIuNSU7XFxyXFxuICAgIGZvbnQtc2l6ZTogMTVweDtcXHJcXG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xcclxcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbn1cXHJcXG4vKi0tIEluc3BpcmF0aW9uIHRha2VuIGZyb20gYWJkbyBzdGVpZiAtLT5cXHJcXG4vKiAtLT4gaHR0cHM6Ly9jb2RlcGVuLmlvL2FiZG9zdGVpZi9wZW4vYlJveU1iP2VkaXRvcnM9MTEwMCovXFxyXFxuLmNvbnRhaW5lciB7XFxyXFxuICAgIHBhZGRpbmc6IDBweDtcXHJcXG4gICAgLyptYXJnaW4tbGVmdDogMHB4OyovXFxyXFxuICAgIHBhZGRpbmctYm90dG9tOiA4MHB4XFxyXFxufVxcclxcblxcclxcbi5wcml2YXRlIHtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbn1cXHJcXG4uY29udGFjdCB7XFxyXFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxuICAgIHBhZGRpbmc6IDAgNDBweCAwIDQwcHg7XFxyXFxufVxcclxcbi5wb2RjYXN0IHtcXHJcXG4gICAgcGFkZGluZy1ib3R0b206IDcwcHg7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcclxcbn1cXHJcXG4ucG9zaXRpb25mb3VyIHtcXHJcXG4gICAgZm9udC1zdHlsZTogaXRhbGljO1xcclxcbn1cXHJcXG4ucG9kY2FzdCBoMiB7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XFxyXFxufVxcclxcbi50Zy1zZWN0aW9uLXRpdGxlIHtcXHJcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcclxcbn1cXHJcXG4udGctc2VjdGlvbi1oZWFkaW5nIHtcXHJcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcclxcbn1cXHJcXG4uZ2xvdyB7XFxyXFxuICAgIHBhZGRpbmctbGVmdDogMTBweDtcXHJcXG4gICAgZm9udC1zaXplOiA0MHB4O1xcclxcbiAgICBjb2xvcjogI2ZmZmZmZjtcXHJcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcclxcbiAgICAtd2Via2l0LWFuaW1hdGlvbjogZ2xvdyAxcyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGU7XFxyXFxuICAgIC1tb3otYW5pbWF0aW9uOiBnbG93IDFzIGVhc2UtaW4tb3V0IGluZmluaXRlIGFsdGVybmF0ZTtcXHJcXG4gICAgYW5pbWF0aW9uOiBnbG93IDFzIGVhc2UtaW4tb3V0IGluZmluaXRlIGFsdGVybmF0ZTtcXHJcXG59XFxyXFxuXFxyXFxuQC13ZWJraXQta2V5ZnJhbWVzIGdsb3cge1xcclxcbiAgICBmcm9tIHtcXHJcXG4gICAgICAgIHRleHQtc2hhZG93OiAwIDAgMTBweCAjZmZmLCAwIDAgMjBweCAjZmZmLCAwIDAgMzBweCAjZjJmMmYyLCAwIDAgNDBweCAjZmYwMDAwLCAwIDAgNTBweCAjZmYwMDAwLCAwIDAgNjBweCAjZmYwMDAwLCAwIDAgNzBweCAjZmYwMDAwO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIHRvIHtcXHJcXG4gICAgICAgIHRleHQtc2hhZG93OiAwIDAgMjBweCAjZmYwMDAwLCAwIDAgMzBweCAjZmYwMDAwLCAwIDAgNDBweCAjZmYwMDAwLCAwIDAgNTBweCAjZmYwMDAwLCAwIDAgNjBweCAjZmYwMDAwLCAwIDAgNzBweCAjZmYwMDAwLCAwIDAgODBweCAjZmYwMDAwO1xcclxcbiAgICB9XFxyXFxufVxcclxcblxcclxcbi8qIE5hdmJhciBzZWN0aW9uICovXFxyXFxuXFxyXFxuLnRnLW1haW4tc2VjdGlvbiB7XFxyXFxuICAgIGJhY2tncm91bmQ6IHVybCgnaHR0cHM6Ly9zMy11cy13ZXN0LTEuYW1hem9uYXdzLmNvbS9lbGljaXQudXMvQXBwK0ltYWdlcy9jaGFsa2JvYXJkLmpwZycpO1xcclxcbn1cXHJcXG5cXHJcXG4uaGVyby1pbWFnZSB7XFxyXFxuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcXFwiaHR0cHM6Ly9uYWRpbmVzdGVja2xlaW4uczMudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vTmFkaW5lSG9tZVNwbGFzaFRvcC5wbmdcXFwiKTtcXHJcXG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xcclxcbiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcclxcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcclxcbiAgICBcXHJcXG4gICAgLypwb3NpdGlvbjogcmVsYXRpdmU7Ki9cXHJcXG59XFxyXFxuXFxyXFxuICAgIC5oZXJvLWltYWdlIGEge1xcclxcbiAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCAjMjkzMjNjLCAjNDg1NTYzLCAjMmI1ODc2LCAjNGU0Mzc2KTtcXHJcXG4gICAgICAgIGJveC1zaGFkb3c6IDAgNHB4IDE1cHggMCByZ2JhKDQ1LCA1NCwgNjUsIDAuNzUpO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuLm5hdiB7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBoZWlnaHQ6IDg1cHg7XFxyXFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXHJcXG4gICAgbGluZS1oZWlnaHQ6IDM1cHg7XFxyXFxuICAgIHRleHQtYWxpZ246IHJpZ2h0O1xcclxcbiAgICB0b3A6IDA7XFxyXFxuICAgIGxlZnQ6IDA7XFxyXFxuICAgIGJvdHRvbTogYXV0bztcXHJcXG59XFxyXFxuXFxyXFxuICAgIC5uYXYgZGl2LmxvZ28ge1xcclxcbiAgICAgICAgZmxvYXQ6IGxlZnQ7XFxyXFxuICAgICAgICB3aWR0aDogYXV0bztcXHJcXG4gICAgICAgIGhlaWdodDogYXV0bztcXHJcXG4gICAgICAgIHBhZGRpbmctbGVmdDogMXJlbTtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAgICAgLm5hdiBkaXYubG9nbyBhIHtcXHJcXG4gICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxuICAgICAgICAgICAgY29sb3I6ICNmZmY7XFxyXFxuICAgICAgICAgICAgZm9udC1zaXplOiAyLjVyZW07XFxyXFxuICAgICAgICB9XFxyXFxuXFxyXFxuICAgICAgICAgICAgLm5hdiBkaXYubG9nbyBhOmhvdmVyIHtcXHJcXG4gICAgICAgICAgICAgICAgY29sb3I6IGJsYWNrO1xcclxcbiAgICAgICAgICAgIH1cXHJcXG5cXHJcXG4gICAgLm5hdiBkaXYubWFpbl9saXN0IHtcXHJcXG4gICAgICAgIGhlaWdodDogNjVweDtcXHJcXG4gICAgICAgIGZsb2F0OiByaWdodDtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAgICAgLm5hdiBkaXYubWFpbl9saXN0IHVsIHtcXHJcXG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgICAgICAgICBoZWlnaHQ6IDY1cHg7XFxyXFxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgICAgICAgICBsaXN0LXN0eWxlOiBub25lO1xcclxcbiAgICAgICAgICAgIG1hcmdpbjogMDtcXHJcXG4gICAgICAgICAgICBwYWRkaW5nOiAwO1xcclxcbiAgICAgICAgfVxcclxcblxcclxcbiAgICAgICAgICAgIC5uYXYgZGl2Lm1haW5fbGlzdCB1bCBsaSB7XFxyXFxuICAgICAgICAgICAgICAgIHdpZHRoOiBhdXRvO1xcclxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDY1cHg7XFxyXFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDA7XFxyXFxuICAgICAgICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDNyZW07XFxyXFxuICAgICAgICAgICAgfVxcclxcblxcclxcbiAgICAgICAgICAgICAgICAubmF2IGRpdi5tYWluX2xpc3QgdWwgbGkgYSB7XFxyXFxuICAgICAgICAgICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogI2ZmZjtcXHJcXG4gICAgICAgICAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiA2NXB4O1xcclxcbiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAyLjRyZW07XFxyXFxuICAgICAgICAgICAgICAgIH1cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgICAgIC5uYXYgZGl2Lm1haW5fbGlzdCB1bCBsaSBhOmhvdmVyIHtcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogIzAwRTY3NjtcXHJcXG4gICAgICAgICAgICAgICAgICAgIH1cXHJcXG5cXHJcXG4ubWFpbkxpc3REaXYgYSAuYnRuOmFjdGl2ZSB7XFxyXFxufVxcclxcblxcclxcbi5laGVhZGVyIHtcXHJcXG59XFxyXFxuXFxyXFxuLnNvY2lhbC1tZWRpYSBhIHtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDVweDtcXHJcXG59XFxyXFxuXFxyXFxuLm1lZXR0aGVzZWdlbnRzIHtcXHJcXG4gICAgbWFyZ2luLXRvcDogMzBweDtcXHJcXG59XFxyXFxuLyogSG9tZSBzZWN0aW9uICovXFxyXFxuLmJ0biB7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG59XFxyXFxuXFxyXFxuLmNvbnRhY3R1cyB7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgbWFyZ2luLXRvcDogNTBweDtcXHJcXG4gICAgLXdlYmtpdC1hbmltYXRpb246IGdsb3cgMXMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYWx0ZXJuYXRlO1xcclxcbiAgICAtbW96LWFuaW1hdGlvbjogZ2xvdyAxcyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGU7XFxyXFxuICAgIGFuaW1hdGlvbjogZ2xvdyAxcyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGU7XFxyXFxufVxcclxcblxcclxcbi5uYXZUcmlnZ2VyIHtcXHJcXG4gICAgZGlzcGxheTogbm9uZTtcXHJcXG59XFxyXFxuXFxyXFxuLm5hdiB7XFxyXFxuICAgIC13ZWJraXQtdHJhbnNpdGlvbjogYWxsIDAuNHMgZWFzZTtcXHJcXG4gICAgdHJhbnNpdGlvbjogYWxsIDAuNHMgZWFzZTtcXHJcXG59XFxyXFxuXFxyXFxuLmZhIHtcXHJcXG4gICAgcGFkZGluZzogMjBweDtcXHJcXG4gICAgZm9udC1zaXplOiAzMHB4O1xcclxcbiAgICB3aWR0aDogMzBweDtcXHJcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcclxcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcXHJcXG59XFxyXFxuXFxyXFxuLmZhLWxpbmtlZGluIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzBlNzZhODtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBoZWlnaHQ6IDQwcHg7XFxyXFxuICAgIHdpZHRoOiA0MHB4O1xcclxcbiAgICBwYWRkaW5nLXRvcDogNHB4O1xcclxcbiAgICBwYWRkaW5nLWxlZnQ6IDhweDtcXHJcXG59XFxyXFxuXFxyXFxuLmZhLWZhY2Vib29rIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzQyNjdiMjtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBwYWRkaW5nLXRvcDogNC41cHg7XFxyXFxuICAgIHBhZGRpbmctbGVmdDogMTAuNXB4O1xcclxcbiAgICBoZWlnaHQ6IDQwcHg7XFxyXFxuICAgIHdpZHRoOiA0MHB4O1xcclxcbn1cXHJcXG5cXHJcXG4uZmEtaW5zdGFncmFtIHtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBwYWRkaW5nLXRvcDogNC41cHg7XFxyXFxuICAgIHBhZGRpbmctbGVmdDogNy41cHg7XFxyXFxuICAgIGhlaWdodDogNDBweDtcXHJcXG4gICAgd2lkdGg6IDQwcHg7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJhZGlhbC1ncmFkaWVudChjaXJjbGUgZmFydGhlc3QtY29ybmVyIGF0IDM1JSA5MCUsICNmZWM1NjQsIHRyYW5zcGFyZW50IDUwJSksIHJhZGlhbC1ncmFkaWVudChjaXJjbGUgZmFydGhlc3QtY29ybmVyIGF0IDAgMTQwJSwgI2ZlYzU2NCwgdHJhbnNwYXJlbnQgNTAlKSwgcmFkaWFsLWdyYWRpZW50KGVsbGlwc2UgZmFydGhlc3QtY29ybmVyIGF0IDAgLTI1JSwgIzUyNThjZiwgdHJhbnNwYXJlbnQgNTAlKSwgcmFkaWFsLWdyYWRpZW50KGVsbGlwc2UgZmFydGhlc3QtY29ybmVyIGF0IDIwJSAtNTAlLCAjNTI1OGNmLCB0cmFuc3BhcmVudCA1MCUpLCByYWRpYWwtZ3JhZGllbnQoZWxsaXBzZSBmYXJ0aGVzdC1jb3JuZXIgYXQgMTAwJSAwLCAjODkzZGMyLCB0cmFuc3BhcmVudCA1MCUpLCByYWRpYWwtZ3JhZGllbnQoZWxsaXBzZSBmYXJ0aGVzdC1jb3JuZXIgYXQgNjAlIC0yMCUsICM4OTNkYzIsIHRyYW5zcGFyZW50IDUwJSksIHJhZGlhbC1ncmFkaWVudChlbGxpcHNlIGZhcnRoZXN0LWNvcm5lciBhdCAxMDAlIDEwMCUsICNkOTMxN2EsIHRyYW5zcGFyZW50KSwgbGluZWFyLWdyYWRpZW50KCM2NTU5Y2EsICNiYzMxOGYgMzAlLCAjZTMzZjVmIDUwJSwgI2Y3NzYzOCA3MCUsICNmZWM2NmQgMTAwJSk7XFxyXFxufVxcclxcblxcclxcbmE6aG92ZXIge1xcclxcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxufVxcclxcblxcclxcbi5sb2dvIHtcXHJcXG4gICAgb3BhY2l0eTogMC4yO1xcclxcbiAgICBoZWlnaHQ6IDEwcHg7XFxyXFxuICAgIHdpZHRoOiAxMHB4O1xcclxcbn1cXHJcXG5cXHJcXG4ubG9nb2ltYWdlIHtcXHJcXG4gICAgaGVpZ2h0OiAxMDBweDtcXHJcXG4gICAgd2lkdGg6IDEwMHB4O1xcclxcbn1cXHJcXG5cXHJcXG4udGctY29tbWVudGZvcm0ge1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIHBhZGRpbmctYm90dG9tOiAyMHB4O1xcclxcbn1cXHJcXG5cXHJcXG4uaG9tZSB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xcclxcbiAgICBwYWRkaW5nLXRvcDogMTAwcHg7XFxyXFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBmb250LXNpemU6IDMwcHg7XFxyXFxufVxcclxcbi8qZm9vdGVyKi9cXHJcXG4uZml4ZWQtYm90dG9tIHtcXHJcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgbGVmdDogMHB4O1xcclxcbiAgICBib3R0b206IDBweDtcXHJcXG4gICAgLypoZWlnaHQ6IDcwcHg7Ki9cXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIUltcG9ydGFudDtcXHJcXG59XFxyXFxuXFxyXFxuLmVwLWZvb3RlciB7XFxyXFxufVxcclxcblxcclxcbi5lcC1mb290ZXJiYXIge1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgZmxvYXQ6IGxlZnQ7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50ICFJbXBvcnRhbnQ7XFxyXFxufVxcclxcblxcclxcbi5lcC1jb3B5cmlnaHQge1xcclxcbiAgICBjb2xvcjogI2ZmZjtcXHJcXG4gICAgZmxvYXQ6IGxlZnQ7XFxyXFxuICAgIHBhZGRpbmc6IDIwcHggMTBweDtcXHJcXG4gICAgZm9udC1zaXplOiAxNXB4O1xcclxcbiAgICBsaW5lLWhlaWdodDogMjBweDtcXHJcXG59XFxyXFxuXFxyXFxuLmZvb3Rlci1uYXYgdWwge1xcclxcbiAgICBsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgcGFkZGluZzogMzVweDtcXHJcXG4gICAgcGFkZGluZy10b3A6IDEzcHg7XFxyXFxuICAgIFxcclxcbn1cXHJcXG5cXHJcXG4ucHJpdmFjeSB7XFxyXFxuICAgIHBhZGRpbmctdG9wOiAyMHB4O1xcclxcbiAgICBwYWRkaW5nLXJpZ2h0OiAxNXB4O1xcclxcbiAgICBjb2xvcjogI2ZmZjtcXHJcXG4gICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgIGxpbmUtaGVpZ2h0OiAyMHB4O1xcclxcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcXHJcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XFxyXFxuICAgIGJvcmRlcjogbm9uZTtcXHJcXG59XFxyXFxuXFxyXFxuLnRlcC1mb290ZXJuYXYgdWwge1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgbGluZS1oZWlnaHQ6IDIwcHg7XFxyXFxuICAgIGxpc3Qtc3R5bGU6IG5vbmU7XFxyXFxufVxcclxcblxcclxcblxcclxcblxcclxcbi8qIE1lZGlhIHF1cmV5IHNlY3Rpb24gKi9cXHJcXG5cXHJcXG5AbWVkaWEgc2NyZWVuIGFuZCAobWluLXdpZHRoOiA3ODlweCkgYW5kIChtYXgtd2lkdGg6IDEwMjRweCkge1xcclxcbiAgICAuY29udGFpbmVyIHtcXHJcXG4gICAgICAgIG1hcmdpbjogMDtcXHJcXG4gICAgICAgIHBhZGRpbmctYm90dG9tOiAzMHB4XFxyXFxuICAgIH1cXHJcXG59XFxyXFxuXFxyXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDo3ODlweCkge1xcclxcbiAgICAubmF2VHJpZ2dlciB7XFxyXFxuICAgICAgICBkaXNwbGF5OiBibG9jaztcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAubmF2IGRpdi5sb2dvIHtcXHJcXG4gICAgICAgIG1hcmdpbi1sZWZ0OiAxNXB4O1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIC5uYXYgZGl2Lm1haW5fbGlzdCB7XFxyXFxuICAgICAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgICAgIGhlaWdodDogMDtcXHJcXG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgLm5hdiBkaXYuc2hvd19saXN0IHtcXHJcXG4gICAgICAgIGhlaWdodDogYXV0bztcXHJcXG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgLm5hdiBkaXYubWFpbl9saXN0IHVsIHtcXHJcXG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgICAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgICAgIGhlaWdodDogMTAwdmg7XFxyXFxuICAgICAgICByaWdodDogMDtcXHJcXG4gICAgICAgIGxlZnQ6IDA7XFxyXFxuICAgICAgICBib3R0b206IDA7XFxyXFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTExO1xcclxcbiAgICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyIHRvcDtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAgICAgLm5hdiBkaXYubWFpbl9saXN0IHVsIGxpIHtcXHJcXG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgICAgICAgICB0ZXh0LWFsaWduOiByaWdodDtcXHJcXG4gICAgICAgIH1cXHJcXG5cXHJcXG4gICAgICAgICAgICAubmF2IGRpdi5tYWluX2xpc3QgdWwgbGkgYSB7XFxyXFxuICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogM3JlbTtcXHJcXG4gICAgICAgICAgICAgICAgcGFkZGluZzogMjBweDtcXHJcXG4gICAgICAgICAgICB9XFxyXFxuXFxyXFxuICAgIC5uYXYgZGl2Lm1lZGlhX2J1dHRvbiB7XFxyXFxuICAgICAgICBkaXNwbGF5OiBibG9jaztcXHJcXG4gICAgfVxcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4vKiBBbmltYXRpb24gKi9cXHJcXG4vKiBJbnNwaXJhdGlvbiB0YWtlbiBmcm9tIERpY3NvbiBodHRwczovL2NvZGVteXVpLmNvbS9zaW1wbGUtaGFtYnVyZ2VyLW1lbnUteC1tYXJrLWFuaW1hdGlvbi8gKi9cXHJcXG5cXHJcXG4ubmF2VHJpZ2dlciB7XFxyXFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXHJcXG4gICAgd2lkdGg6IDMwcHg7XFxyXFxuICAgIGhlaWdodDogMjVweDtcXHJcXG4gICAgbWFyZ2luOiBhdXRvO1xcclxcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgIHJpZ2h0OiAzMHB4O1xcclxcbiAgICB0b3A6IDA7XFxyXFxuICAgIGJvdHRvbTogMDtcXHJcXG59XFxyXFxuXFxyXFxuICAgIC5uYXZUcmlnZ2VyIGkge1xcclxcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXHJcXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDJweDtcXHJcXG4gICAgICAgIGNvbnRlbnQ6ICcnO1xcclxcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgICAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgICAgIGhlaWdodDogNHB4O1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgICAgICAubmF2VHJpZ2dlciBpOm50aC1jaGlsZCgxKSB7XFxyXFxuICAgICAgICAgICAgLXdlYmtpdC1hbmltYXRpb246IG91dFQgMC44cyBiYWNrd2FyZHM7XFxyXFxuICAgICAgICAgICAgYW5pbWF0aW9uOiBvdXRUIDAuOHMgYmFja3dhcmRzO1xcclxcbiAgICAgICAgICAgIC13ZWJraXQtYW5pbWF0aW9uLWRpcmVjdGlvbjogcmV2ZXJzZTtcXHJcXG4gICAgICAgICAgICBhbmltYXRpb24tZGlyZWN0aW9uOiByZXZlcnNlO1xcclxcbiAgICAgICAgfVxcclxcblxcclxcbiAgICAgICAgLm5hdlRyaWdnZXIgaTpudGgtY2hpbGQoMikge1xcclxcbiAgICAgICAgICAgIG1hcmdpbjogNXB4IDA7XFxyXFxuICAgICAgICAgICAgLXdlYmtpdC1hbmltYXRpb246IG91dE0gMC44cyBiYWNrd2FyZHM7XFxyXFxuICAgICAgICAgICAgYW5pbWF0aW9uOiBvdXRNIDAuOHMgYmFja3dhcmRzO1xcclxcbiAgICAgICAgICAgIC13ZWJraXQtYW5pbWF0aW9uLWRpcmVjdGlvbjogcmV2ZXJzZTtcXHJcXG4gICAgICAgICAgICBhbmltYXRpb24tZGlyZWN0aW9uOiByZXZlcnNlO1xcclxcbiAgICAgICAgfVxcclxcblxcclxcbiAgICAgICAgLm5hdlRyaWdnZXIgaTpudGgtY2hpbGQoMykge1xcclxcbiAgICAgICAgICAgIC13ZWJraXQtYW5pbWF0aW9uOiBvdXRCdG0gMC44cyBiYWNrd2FyZHM7XFxyXFxuICAgICAgICAgICAgYW5pbWF0aW9uOiBvdXRCdG0gMC44cyBiYWNrd2FyZHM7XFxyXFxuICAgICAgICAgICAgLXdlYmtpdC1hbmltYXRpb24tZGlyZWN0aW9uOiByZXZlcnNlO1xcclxcbiAgICAgICAgICAgIGFuaW1hdGlvbi1kaXJlY3Rpb246IHJldmVyc2U7XFxyXFxuICAgICAgICB9XFxyXFxuXFxyXFxuICAgIC5uYXZUcmlnZ2VyLmFjdGl2ZSBpOm50aC1jaGlsZCgxKSB7XFxyXFxuICAgICAgICAtd2Via2l0LWFuaW1hdGlvbjogaW5UIDAuOHMgZm9yd2FyZHM7XFxyXFxuICAgICAgICBhbmltYXRpb246IGluVCAwLjhzIGZvcndhcmRzO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIC5uYXZUcmlnZ2VyLmFjdGl2ZSBpOm50aC1jaGlsZCgyKSB7XFxyXFxuICAgICAgICAtd2Via2l0LWFuaW1hdGlvbjogaW5NIDAuOHMgZm9yd2FyZHM7XFxyXFxuICAgICAgICBhbmltYXRpb246IGluTSAwLjhzIGZvcndhcmRzO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIC5uYXZUcmlnZ2VyLmFjdGl2ZSBpOm50aC1jaGlsZCgzKSB7XFxyXFxuICAgICAgICAtd2Via2l0LWFuaW1hdGlvbjogaW5CdG0gMC44cyBmb3J3YXJkcztcXHJcXG4gICAgICAgIGFuaW1hdGlvbjogaW5CdG0gMC44cyBmb3J3YXJkcztcXHJcXG4gICAgfVxcclxcblxcclxcbkAtd2Via2l0LWtleWZyYW1lcyBpbk0ge1xcclxcbiAgICA1MCUge1xcclxcbiAgICAgICAgLXdlYmtpdC10cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAxMDAlIHtcXHJcXG4gICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoNDVkZWcpO1xcclxcbiAgICB9XFxyXFxufVxcclxcblxcclxcbkBrZXlmcmFtZXMgaW5NIHtcXHJcXG4gICAgNTAlIHtcXHJcXG4gICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIDEwMCUge1xcclxcbiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoNDVkZWcpO1xcclxcbiAgICB9XFxyXFxufVxcclxcblxcclxcbkAtd2Via2l0LWtleWZyYW1lcyBvdXRNIHtcXHJcXG4gICAgNTAlIHtcXHJcXG4gICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgMTAwJSB7XFxyXFxuICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDQ1ZGVnKTtcXHJcXG4gICAgfVxcclxcbn1cXHJcXG5cXHJcXG5Aa2V5ZnJhbWVzIG91dE0ge1xcclxcbiAgICA1MCUge1xcclxcbiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgMTAwJSB7XFxyXFxuICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSg0NWRlZyk7XFxyXFxuICAgIH1cXHJcXG59XFxyXFxuXFxyXFxuQC13ZWJraXQta2V5ZnJhbWVzIGluVCB7XFxyXFxuICAgIDAlIHtcXHJcXG4gICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDBweCkgcm90YXRlKDBkZWcpO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIDUwJSB7XFxyXFxuICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWSg5cHgpIHJvdGF0ZSgwZGVnKTtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAxMDAlIHtcXHJcXG4gICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDlweCkgcm90YXRlKDEzNWRlZyk7XFxyXFxuICAgIH1cXHJcXG59XFxyXFxuXFxyXFxuQGtleWZyYW1lcyBpblQge1xcclxcbiAgICAwJSB7XFxyXFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMHB4KSByb3RhdGUoMGRlZyk7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgNTAlIHtcXHJcXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg5cHgpIHJvdGF0ZSgwZGVnKTtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAxMDAlIHtcXHJcXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg5cHgpIHJvdGF0ZSgxMzVkZWcpO1xcclxcbiAgICB9XFxyXFxufVxcclxcblxcclxcbkAtd2Via2l0LWtleWZyYW1lcyBvdXRUIHtcXHJcXG4gICAgMCUge1xcclxcbiAgICAgICAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMHB4KSByb3RhdGUoMGRlZyk7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgNTAlIHtcXHJcXG4gICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDlweCkgcm90YXRlKDBkZWcpO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIDEwMCUge1xcclxcbiAgICAgICAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVkoOXB4KSByb3RhdGUoMTM1ZGVnKTtcXHJcXG4gICAgfVxcclxcbn1cXHJcXG5cXHJcXG5Aa2V5ZnJhbWVzIG91dFQge1xcclxcbiAgICAwJSB7XFxyXFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMHB4KSByb3RhdGUoMGRlZyk7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgNTAlIHtcXHJcXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg5cHgpIHJvdGF0ZSgwZGVnKTtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAxMDAlIHtcXHJcXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg5cHgpIHJvdGF0ZSgxMzVkZWcpO1xcclxcbiAgICB9XFxyXFxufVxcclxcblxcclxcbkAtd2Via2l0LWtleWZyYW1lcyBpbkJ0bSB7XFxyXFxuICAgIDAlIHtcXHJcXG4gICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDBweCkgcm90YXRlKDBkZWcpO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIDUwJSB7XFxyXFxuICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOXB4KSByb3RhdGUoMGRlZyk7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgMTAwJSB7XFxyXFxuICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOXB4KSByb3RhdGUoMTM1ZGVnKTtcXHJcXG4gICAgfVxcclxcbn1cXHJcXG5cXHJcXG5Aa2V5ZnJhbWVzIGluQnRtIHtcXHJcXG4gICAgMCUge1xcclxcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDBweCkgcm90YXRlKDBkZWcpO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIDUwJSB7XFxyXFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTlweCkgcm90YXRlKDBkZWcpO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIDEwMCUge1xcclxcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC05cHgpIHJvdGF0ZSgxMzVkZWcpO1xcclxcbiAgICB9XFxyXFxufVxcclxcblxcclxcbkAtd2Via2l0LWtleWZyYW1lcyBvdXRCdG0ge1xcclxcbiAgICAwJSB7XFxyXFxuICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWSgwcHgpIHJvdGF0ZSgwZGVnKTtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICA1MCUge1xcclxcbiAgICAgICAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTlweCkgcm90YXRlKDBkZWcpO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIDEwMCUge1xcclxcbiAgICAgICAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTlweCkgcm90YXRlKDEzNWRlZyk7XFxyXFxuICAgIH1cXHJcXG59XFxyXFxuXFxyXFxuQGtleWZyYW1lcyBvdXRCdG0ge1xcclxcbiAgICAwJSB7XFxyXFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMHB4KSByb3RhdGUoMGRlZyk7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgNTAlIHtcXHJcXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOXB4KSByb3RhdGUoMGRlZyk7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgMTAwJSB7XFxyXFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTlweCkgcm90YXRlKDEzNWRlZyk7XFxyXFxuICAgIH1cXHJcXG59XFxyXFxuXFxyXFxuLmFmZml4IHtcXHJcXG4gICAgcGFkZGluZzogMDtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzExMTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuXFxyXFxuXFxyXFxuXFxyXFxuXFxyXFxuLm15SDIge1xcclxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxuICAgIGZvbnQtc2l6ZTogNHJlbTtcXHJcXG59XFxyXFxuXFxyXFxuLm15UCB7XFxyXFxuICAgIHRleHQtYWxpZ246IGp1c3RpZnk7XFxyXFxuICAgIHBhZGRpbmctbGVmdDogMTUlO1xcclxcbiAgICBwYWRkaW5nLXJpZ2h0OiAxNSU7XFxyXFxuICAgIGZvbnQtc2l6ZTogMjBweDtcXHJcXG59XFxyXFxuXFxyXFxuQG1lZGlhIGFsbCBhbmQgKG1heC13aWR0aDo3MDBweCkge1xcclxcbiAgICAubXlQIHtcXHJcXG4gICAgICAgIHBhZGRpbmc6IDIlO1xcclxcbiAgICB9XFxyXFxufVxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcbi8qKlxcclxcbi5jb250YWluZXIge1xcclxcbiAgICBwYWRkaW5nLXRvcDogNTBweDtcXHJcXG4gICAgbWFyZ2luLWJvdHRvbTogNTBweDtcXHJcXG59XFxyXFxuLmZpeGVkLWJvdHRvbSB7XFxyXFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXHJcXG4gICAgdG9wOiBhdXRvO1xcclxcbiAgICBsZWZ0OiAwO1xcclxcbiAgICBib3R0b206IDA7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xcclxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxufVxcclxcbi5uYXZiYXIgLm5hdiAuYWN0aXZlLCAubmF2YmFyLWRlZmF1bHQgLm5hdmJhci1uYXYgPiAuYWN0aXZlID4gYSwgLm5hdmJhci1kZWZhdWx0IC5uYXZiYXItbmF2ID4gLmFjdGl2ZSA+IGE6aG92ZXIsIC5uYXZiYXItZGVmYXVsdCAubmF2YmFyLW5hdiA+IC5hY3RpdmUgPiBhOmZvY3VzIHtcXHJcXG4gICAgYmFja2dyb3VuZDogI2U3ZTdlNyAhaW1wb3J0YW50O1xcclxcbiAgICBjb2xvcjogIzMzMyAhaW1wb3J0YW50O1xcclxcbn1cXHJcXG5ib2R5ID4gI3Jvb3Qge1xcclxcbiAgICBoZWlnaHQ6IDEwMHZoO1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxufVxcclxcbi8qLm5hdiB7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBoZWlnaHQ6IDY1cHg7XFxyXFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXHJcXG4gICAgbGluZS1oZWlnaHQ6IDY1cHg7XFxyXFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG59XFxyXFxuICAgIC5uYXYgZGl2LmxvZ28ge1xcclxcbiAgICAgICAgZmxvYXQ6IGxlZnQ7XFxyXFxuICAgICAgICB3aWR0aDogYXV0bztcXHJcXG4gICAgICAgIGhlaWdodDogYXV0bztcXHJcXG4gICAgICAgIHBhZGRpbmctbGVmdDogM3JlbTtcXHJcXG4gICAgfVxcclxcbiAgICAgICAgLm5hdiBkaXYubG9nbyBhIHtcXHJcXG4gICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxuICAgICAgICAgICAgY29sb3I6ICNmZmY7XFxyXFxuICAgICAgICAgICAgZm9udC1zaXplOiAyLjVyZW07XFxyXFxuICAgICAgICB9XFxyXFxuICAgICAgICAgICAgLm5hdiBkaXYubG9nbyBhOmhvdmVyIHtcXHJcXG4gICAgICAgICAgICAgICAgY29sb3I6ICMwMEU2NzY7XFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAubmF2IGRpdi5tYWluX2xpc3Qge1xcclxcbiAgICAgICAgaGVpZ2h0OiA2NXB4O1xcclxcbiAgICAgICAgZmxvYXQ6IHJpZ2h0O1xcclxcbiAgICB9XFxyXFxuICAgICAgICAubmF2IGRpdi5tYWluX2xpc3QgdWwge1xcclxcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICAgICAgICAgIGhlaWdodDogNjVweDtcXHJcXG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICAgICAgICAgIGxpc3Qtc3R5bGU6IG5vbmU7XFxyXFxuICAgICAgICAgICAgbWFyZ2luOiAwO1xcclxcbiAgICAgICAgICAgIHBhZGRpbmc6IDA7XFxyXFxuICAgICAgICB9XFxyXFxuICAgICAgICAgICAgLm5hdiBkaXYubWFpbl9saXN0IHVsIGxpIHtcXHJcXG4gICAgICAgICAgICAgICAgd2lkdGg6IGF1dG87XFxyXFxuICAgICAgICAgICAgICAgIGhlaWdodDogNjVweDtcXHJcXG4gICAgICAgICAgICAgICAgcGFkZGluZzogMDtcXHJcXG4gICAgICAgICAgICAgICAgcGFkZGluZy1yaWdodDogM3JlbTtcXHJcXG4gICAgICAgICAgICB9XFxyXFxuICAgICAgICAgICAgICAgIC5uYXYgZGl2Lm1haW5fbGlzdCB1bCBsaSBhIHtcXHJcXG4gICAgICAgICAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXHJcXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAjZmZmO1xcclxcbiAgICAgICAgICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDY1cHg7XFxyXFxuICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDIuNHJlbTtcXHJcXG4gICAgICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgICAgICAgICAgLm5hdiBkaXYubWFpbl9saXN0IHVsIGxpIGE6aG92ZXIge1xcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAjMDBFNjc2O1xcclxcbiAgICAgICAgICAgICAgICAgICAgfVxcclxcbi5ob21lIHtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGhlaWdodDogMTAwdmg7XFxyXFxuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChodHRwczovL3MzLXVzLXdlc3QtMS5hbWF6b25hd3MuY29tL2VsaWNpdC51cy9lbGljaXRMb2dvLmpwZyk7XFxyXFxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciB0b3A7XFxyXFxuICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XFxyXFxufVxcclxcbi5uYXZUcmlnZ2VyIHtcXHJcXG4gICAgZGlzcGxheTogbm9uZTtcXHJcXG59XFxyXFxuLm5hdiB7XFxyXFxuICAgIHBhZGRpbmctdG9wOiAyMHB4O1xcclxcbiAgICBwYWRkaW5nLWJvdHRvbTogMjBweDtcXHJcXG4gICAgLXdlYmtpdC10cmFuc2l0aW9uOiBhbGwgMC40cyBlYXNlO1xcclxcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC40cyBlYXNlO1xcclxcbn0qL1xcclxcblxcclxcblxcclxcblxcclxcbi8qaHRtbCwgYm9keSB7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBoZWlnaHQ6IDEwMCU7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgcGFkZGluZzogMDtcXHJcXG4gICAgYmFja2dyb3VuZDogYmxhY2s7XFxyXFxuICAgIGNvbG9yOiBibGFjazsqL1xcclxcbi8qIFRoZSBpbWFnZSB1c2VkICovXFxyXFxuLypiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXFxcImltZ19wYXJhbGxheC5qcGdcXFwiKTsqL1xcclxcbi8qIFNldCBhIHNwZWNpZmljIGhlaWdodCAqL1xcclxcbi8qbWluLWhlaWdodDogNTAwcHg7Ki9cXHJcXG4vKiBDcmVhdGUgdGhlIHBhcmFsbGF4IHNjcm9sbGluZyBlZmZlY3QgKi9cXHJcXG4vKmJhY2tncm91bmQtYXR0YWNobWVudDogZml4ZWQ7XFxyXFxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcXHJcXG4gICAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXHJcXG4gICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcXHJcXG59LypcXHJcXG4uZ2xvdyB7XFxyXFxuICAgIGZvbnQtc2l6ZTogODBweDtcXHJcXG4gICAgY29sb3I6ICNmZmZmZmY7XFxyXFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG4gICAgLXdlYmtpdC1hbmltYXRpb246IGdsb3cgMXMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYWx0ZXJuYXRlO1xcclxcbiAgICAtbW96LWFuaW1hdGlvbjogZ2xvdyAxcyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGU7XFxyXFxuICAgIGFuaW1hdGlvbjogZ2xvdyAxcyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGU7XFxyXFxufVxcclxcbkAtd2Via2l0LWtleWZyYW1lcyBnbG93IHtcXHJcXG4gICAgZnJvbSB7XFxyXFxuICAgICAgICB0ZXh0LXNoYWRvdzogMCAwIDEwcHggI2ZmZiwgMCAwIDIwcHggI2ZmZiwgMCAwIDMwcHggI2YyZjJmMiwgMCAwIDQwcHggI2ZmMDAwMCwgMCAwIDUwcHggI2ZmMDAwMCwgMCAwIDYwcHggI2ZmMDAwMCwgMCAwIDcwcHggI2ZmMDAwMDtcXHJcXG4gICAgfVxcclxcbiAgICB0byB7XFxyXFxuICAgICAgICB0ZXh0LXNoYWRvdzogMCAwIDIwcHggI2ZmMDAwMCwgMCAwIDMwcHggI2ZmMDAwMCwgMCAwIDQwcHggI2ZmMDAwMCwgMCAwIDUwcHggI2ZmMDAwMCwgMCAwIDYwcHggI2ZmMDAwMCwgMCAwIDcwcHggI2ZmMDAwMCwgMCAwIDgwcHggI2ZmMDAwMDtcXHJcXG4gICAgfVxcclxcbn1cXHJcXG4vKkhFQURFUiovXFxyXFxuLyoqXFxyXFxuLmZpeGVkLXRvcCB7XFxyXFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXHJcXG4gICAgdG9wOiAwO1xcclxcbiAgICByaWdodDogMDtcXHJcXG4gICAgbGVmdDogMDtcXHJcXG4gICAgei1pbmRleDogMTAzMDtcXHJcXG59XFxyXFxuLypCT0RZKi9cXHJcXG4vKipcXHJcXG4uZXAtaGFzbGF5b3V0IHtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGZsb2F0OiBsZWZ0O1xcclxcbn1cXHJcXG4uZXAtbWFpbi1zZWN0aW9uIHtcXHJcXG4gICAgcGFkZGluZzogODBweCAwO1xcclxcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xcclxcbn1cXHJcXG4gICAgLmVwLW1haW4tc2VjdGlvbiA+IGRpdiB7XFxyXFxuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxyXFxuICAgIH1cXHJcXG4vKkZPT1RFUiovXFxyXFxuXFxyXFxuLyoqXFxyXFxuLmVwLWZvb3RlciB7XFxyXFxuICAgIGJhY2tncm91bmQ6ICMwMDAwMDA7XFxyXFxufVxcclxcbi5lcC1mb290ZXJiYXIge1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgZmxvYXQ6IGxlZnQ7XFxyXFxuICAgIGJhY2tncm91bmQ6ICMwMDAwMDA7XFxyXFxufVxcclxcbi5lcC1jb3B5cmlnaHQge1xcclxcbiAgICBjb2xvcjogI2ZmZjtcXHJcXG4gICAgZmxvYXQ6IGxlZnQ7XFxyXFxuICAgIHBhZGRpbmc6IDIwcHggMDtcXHJcXG4gICAgZm9udC1zaXplOiAxMnB4O1xcclxcbiAgICBsaW5lLWhlaWdodDogMjBweDtcXHJcXG59XFxyXFxuLmVwLWZvb3Rlcm5hdiB7XFxyXFxuICAgIGZsb2F0OiByaWdodDtcXHJcXG4gICAgZm9udC1zaXplOiAxNHB4O1xcclxcbiAgICBsaW5lLWhlaWdodDogMjBweDtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IDMwMDtcXHJcXG4gICAgcGFkZGluZzogMjBweCAwO1xcclxcbiAgICBmb250LWZhbWlseTogJ09zd2FsZCcsIEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxyXFxufVxcclxcbi50ZXAtZm9vdGVybmF2IHVsIHtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGZsb2F0OiBsZWZ0O1xcclxcbiAgICBsaW5lLWhlaWdodDogMjBweDtcXHJcXG4gICAgbGlzdC1zdHlsZTogbm9uZTtcXHJcXG59XFxyXFxuLmVwLWZvb3Rlcm5hdiB1bCBsaSB7XFxyXFxuICAgIGZsb2F0OiBsZWZ0O1xcclxcbiAgICBsaW5lLWhlaWdodDogMjBweDtcXHJcXG4gICAgcGFkZGluZzogMCAwIDAgMjBweDtcXHJcXG4gICAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xcclxcbn1cXHJcXG4gICAgLmVwLWZvb3Rlcm5hdiB1bCBsaSBhIHtcXHJcXG4gICAgICAgIGNvbG9yOiAjZmZmO1xcclxcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgICAgICBsaW5lLWhlaWdodDogMjBweDtcXHJcXG4gICAgfVxcclxcbiAgKiovXFxyXFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIhLi9jc3Mvc2l0ZS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDgwOVxuLy8gbW9kdWxlIGNodW5rcyA9IDMiXSwic291cmNlUm9vdCI6IiJ9
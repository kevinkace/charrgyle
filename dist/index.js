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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mithril__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mithril___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mithril__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index_css__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_minireset_css__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__col_jpg__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__col_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__col_jpg__);






// import foreground from "./foreground.jpg";


const SIZE = 100;

const X_SCALE = SIZE * 0.7;
const Y_SCALE = SIZE * 1.42;

const COUNT_X = Math.floor(window.innerWidth / X_SCALE) + 1;
const COUNT_Y = Math.floor(window.innerHeight / Y_SCALE) + 1;

const MAX_OPACITY = 0.7;

function transform(obj) {
    return `rotate(45deg) translate(${obj.mod ? 50.2 : 0}px, ${obj.mod ? 50.2 : 0}px)`;
}

function opacity(obj, state, max = 1) {
    if (!state.hover) {
        return 1 * max;
    }

    let offset = {
        x: obj.x - state.hover.x,
        y: obj.y - state.hover.y
    },
        nw = offset.x === -1 && offset.y === (obj.mod ? -1 : 0),
        sw = offset.x === -1 && offset.y === (obj.mod ? 0 : 1),
        ne = offset.x === 1 && offset.y === (obj.mod ? -1 : 0),
        se = offset.x === 1 && offset.y === (obj.mod ? 0 : 1);

    // currently hovered
    if (!offset.x && !offset.y) {
        return 0;
    }

    if (nw || sw || ne || se) {
        return 0.5 * max;
    }

    return max;
}

function opacityToHex(obj, state) {
    const hex = ["a", "b", "c", "d", "e", "f"];
    const op = 1 - opacity(obj, state);
    const base16 = Math.floor(op * 16);

    return base16 < 15 ? "#fff" : "#000";

    // if(base16 < 16) {
    //     return `#${base16}${base16}${base16}`;
    // }

    // let letter = hex[base16 - 10];

    // return `#${letter}${letter}${letter}`;
}

// return distance in px between event and dom node
function getDist(e, rect) {
    if (!rect.dom) {
        return 1000;
    }

    if (!rect.bc) {
        rect.bc = rect.dom.getBoundingClientRect();
    }

    let y = e.pageY - rect.bc.top,
        x = e.pageX - rect.bc.left,
        dist = Math.sqrt(x ** 2 + y ** 2);
    // console.log(dist);
    return dist;

    // e.page
}

__WEBPACK_IMPORTED_MODULE_0_mithril___default.a.mount(document.getElementById("mount"), {
    oninit: vnode => {
        vnode.state.grid = [];

        for (let y = 0; y < COUNT_Y; y++) {
            for (let x = 0; x < COUNT_X; x++) {
                vnode.state.grid[y] = vnode.state.grid[y] || [];
                vnode.state.grid[y][x] = { x, y, mod: x % 2, fill: "#fff", delay: Math.random() * 8 };
            }
        }

        window.addEventListener("mousemove", e => {
            vnode.state.grid.forEach(y => y.forEach(rect => {

                // get distance from center to mouse
                rect.dist = getDist(e, rect);
                // match thresholds

                // convert distance to hex
                rect.fill = "#fff";

                if (rect.dist > 400) {
                    return;
                }
                if (rect.dist < 120) {
                    rect.fill = "#000";
                    return;
                }
                if (rect.dist < 200) {
                    rect.fill = "#999";
                    return;
                }
                if (rect.dist < 300) {
                    rect.fill = "#bbb";
                    return;
                }
                //  save to rect.fill

                // console.log(e);
                // debugger;
            }));

            __WEBPACK_IMPORTED_MODULE_0_mithril___default.a.redraw();
        });

        // vnode.state.squares = 40;
    },
    view: vnode => __WEBPACK_IMPORTED_MODULE_0_mithril___default()("div", { class: __WEBPACK_IMPORTED_MODULE_1__index_css__["a" /* default */].charrgyle }, __WEBPACK_IMPORTED_MODULE_0_mithril___default()("video", {
        class: __WEBPACK_IMPORTED_MODULE_1__index_css__["a" /* default */].video,
        autoplay: "autoplay",
        loop: "loop",
        playsinline: "",

        oncreate: videoVnode => videoVnode.dom.play()
    }, __WEBPACK_IMPORTED_MODULE_0_mithril___default()("source", {
        src: "https://guildwars2.staticwars.com/img/pof/hero/bg.44deb054.mp4",
        type: "video/mp4"
    })), __WEBPACK_IMPORTED_MODULE_0_mithril___default()("svg", {
        width: 1920,
        height: 1080,

        viewBox: "0 0 1920 1080",
        xmlns: "http://www.w3.org/2000/svg"
    },

    // DEFS
    __WEBPACK_IMPORTED_MODULE_0_mithril___default()("defs", __WEBPACK_IMPORTED_MODULE_0_mithril___default()("mask", {
        id: "mask",

        x: 0,
        y: 0,

        width: 1920,
        height: 1080
    }, vnode.state.grid.map(y => y.map(rect => __WEBPACK_IMPORTED_MODULE_0_mithril___default()("rect", {
        oncreate: rectVnode => {
            rect.dom = rectVnode.dom;
        },

        x: rect.x * X_SCALE,
        y: rect.y * Y_SCALE,

        width: SIZE,
        height: SIZE,

        style: {
            // fill            : opacityToHex(obj, vnode.state),
            // fill            : Math.random() > 0.5 ? "#fff" : "#000",
            animationDelay: `${rect.fill === "#fff" ? 100 : rect.delay}s`,
            // animation       : rect.delay < 0.3 ? "inherit" : "none",
            fill: rect.fill,
            transform: transform(rect),
            transformOrigin: `${rect.x * X_SCALE + 50}px ${rect.y * Y_SCALE + 50}px`
        }
    }))))),

    // IMAGE
    __WEBPACK_IMPORTED_MODULE_0_mithril___default()("image", {
        "xlink:href": __WEBPACK_IMPORTED_MODULE_3__col_jpg___default.a,
        x: 0,
        y: 0,
        width: 1920,
        height: 1080,
        mask: "url(#mask)"
    }), __WEBPACK_IMPORTED_MODULE_0_mithril___default()("g", {
        mask: "url(#mask)",
        id: "fill"
    }, vnode.state.grid.map(y => y.map(obj => __WEBPACK_IMPORTED_MODULE_0_mithril___default()("g", __WEBPACK_IMPORTED_MODULE_0_mithril___default()("rect", {
        class: __WEBPACK_IMPORTED_MODULE_1__index_css__["a" /* default */].fill,
        x: obj.x * X_SCALE,
        y: obj.y * Y_SCALE,

        width: SIZE,
        height: SIZE,

        style: {
            // fill : obj.delay < 0.3 ? "#6669" : "transparent",
            animationDelay: `${obj.delay * 2}s`,
            opacity: opacity(obj, vnode.state, MAX_OPACITY),
            transform: transform(obj),
            transformOrigin: `${obj.x * X_SCALE + 50}px ${obj.y * Y_SCALE + 50}px`
            // ,
            // onmousemove : () => {
            //     vnode.state.hover = { x : obj.x, y : obj.y };
            //     m.redraw();
            // }
        } })
    // ,
    // m("text", {
    //     x : obj.x * X_SCALE + 40,
    //     y : obj.y * Y_SCALE + (obj.mod ? 120 : 40),
    //     transformOrigin : `${obj.x * X_SCALE + 50}px ${obj.y * Y_SCALE + 50}`

    // }, obj.x + "-" + obj.y)
    ))))))
});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = m;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export charrgyle */
/* unused harmony export video */
/* unused harmony export fill */
/* harmony default export */ __webpack_exports__["a"] = ({
    "charrgyle": "mc70832d4a_charrgyle",
    "video": "mc70832d4a_video",
    "fill": "mc70832d4a_fill"
});
var charrgyle = "mc70832d4a_charrgyle";
var video = "mc70832d4a_video";
var fill = "mc70832d4a_fill";

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = ({});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "94610245c9e3514f915ee1312a815be0.jpg";

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map
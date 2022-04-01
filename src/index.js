import m from "mithril";

import css from "./index.css";

import "minireset.css";

// import foreground from "./foreground.jpg";
import foreground from "./col.jpg";
import video from "./bg.mp4";

const SIZE = 100;

const X_SCALE = (SIZE * 0.7);
const Y_SCALE = (SIZE * 1.42);

const COUNT_X = Math.floor(window.innerWidth / X_SCALE) + 1;
const COUNT_Y = Math.floor(window.innerHeight / Y_SCALE) + 1;


const MAX_OPACITY = 0.7;

function transform(obj) {
    return `rotate(45deg) translate(${obj.mod ? 50.2 : 0}px, ${obj.mod ? 50.2 : 0}px)`;
}

function opacity(obj, state, max = 1) {
    if(!state.hover) {
        return 1 * max;
    }

    let offset = {
            x : obj.x - state.hover.x,
            y : obj.y - state.hover.y
        },

        nw = offset.x === -1 && offset.y === (obj.mod ? -1 : 0),
        sw = offset.x === -1 && offset.y === (obj.mod ? 0 : 1),
        ne = offset.x === 1  && offset.y === (obj.mod ? -1 : 0),
        se = offset.x === 1  && offset.y === (obj.mod ? 0 : 1);

    // currently hovered
    if(!offset.x && !offset.y) {
        return 0;
    }

    if(nw || sw || ne || se) {
        return 0.5 * max;
    }

    return max;
}

function opacityToHex(obj, state) {
    const hex = [ "a", "b", "c", "d", "e", "f" ];
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
    if(!rect.dom) {
        return 1000;
    }

    if(!rect.bc) {
        rect.bc = rect.dom.getBoundingClientRect();
    }

    let y = e.pageY - rect.bc.top,
        x = e.pageX - rect.bc.left,
        dist = Math.sqrt(x ** 2 + y ** 2);
        // console.log(dist);
    return dist;

    // e.page
}

m.mount(document.getElementById("mount"), {
    oninit : (vnode) => {
        vnode.state.grid = [];

        for(let y = 0; y < COUNT_Y; y++) {
            for (let x = 0; x < COUNT_X; x++) {
                vnode.state.grid[y] = vnode.state.grid[y] || [];
                vnode.state.grid[y][x] = { x, y, mod : x % 2, fill : "#fff", delay : Math.random() * 8 };
            }
        }

        window.addEventListener("mousemove", (e) => {
            vnode.state.grid.forEach((y) => y.forEach((rect) => {

                // get distance from center to mouse
                rect.dist = getDist(e, rect);
                // match thresholds

                // convert distance to hex
                rect.fill = "#fff";

                if(rect.dist > 400) {
                    return;
                }
                if(rect.dist < 120) {
                    rect.fill = "#000";
                    return;
                }
                if(rect.dist < 200) {
                    rect.fill = "#999";
                    return;
                }
                if(rect.dist < 300) {
                    rect.fill = "#bbb";
                    return;
                }
                //  save to rect.fill

                // console.log(e);
                // debugger;
            }));

            m.redraw();
        });

        // vnode.state.squares = 40;
    },
    view : (vnode) =>
        m("div", { class : css.charrgyle },
            m("video", {
                    class       : css.video,
                    autoplay    : "autoplay",
                    loop        : "loop",
                    playsinline : "",

                    oncreate : (videoVnode) => videoVnode.dom.play()
                },
                m("source", {
                    src  : video,
                    type : "video/mp4"
                })
            ),

            m("svg", {
                    width  : 1920,
                    height : 1080,

                    viewBox : "0 0 1920 1080",
                    xmlns   : "http://www.w3.org/2000/svg"
                },

                // DEFS
                m("defs",
                    m("mask", {
                            id : "mask",

                            x : 0,
                            y : 0,

                            width: 1920,
                            height: 1080
                        },

                        vnode.state.grid.map((y) =>
                            y.map((rect) =>
                                m("rect", {
                                    oncreate : (rectVnode) => {
                                        rect.dom = rectVnode.dom;
                                    },

                                    x : rect.x * X_SCALE,
                                    y : rect.y * Y_SCALE,

                                    width  : SIZE,
                                    height : SIZE,

                                    style : {
                                        // fill            : opacityToHex(obj, vnode.state),
                                        // fill            : Math.random() > 0.5 ? "#fff" : "#000",
                                        animationDelay  : `${rect.fill === "#fff" ? 100 : rect.delay}s`,
                                        // animation       : rect.delay < 0.3 ? "inherit" : "none",
                                        fill            : rect.fill,
                                        transform       : transform(rect),
                                        transformOrigin : `${rect.x * X_SCALE + 50}px ${rect.y * Y_SCALE + 50}px`
                                    }
                                })
                            )
                        )
                    )
                ),

                // IMAGE
                m("image", {
                    "xlink:href" : foreground,
                    x    : 0,
                    y    : 0,
                    width  : 1920,
                    height : 1080,
                    mask : "url(#mask)"
                })
                ,

                m("g", {
                        mask : "url(#mask)",
                        id   : "fill"
                    },
                    vnode.state.grid.map((y) =>
                        y.map((obj) =>
                            m("g",
                                m("rect", {
                                    class : css.fill,
                                    x : obj.x * X_SCALE,
                                    y : obj.y * Y_SCALE,

                                    width  : SIZE,
                                    height : SIZE,

                                    style : {
                                        // fill : obj.delay < 0.3 ? "#6669" : "transparent",
                                        animationDelay  : `${obj.delay * 2}s`,
                                        opacity         : opacity(obj, vnode.state, MAX_OPACITY),
                                        transform       : transform(obj),
                                        transformOrigin : `${obj.x * X_SCALE + 50}px ${obj.y * Y_SCALE + 50}px`
                                    }
                                    // ,
                                    // onmousemove : () => {
                                    //     vnode.state.hover = { x : obj.x, y : obj.y };
                                    //     m.redraw();
                                    // }
                                })
                                // ,
                                // m("text", {
                                //     x : obj.x * X_SCALE + 40,
                                //     y : obj.y * Y_SCALE + (obj.mod ? 120 : 40),
                                //     transformOrigin : `${obj.x * X_SCALE + 50}px ${obj.y * Y_SCALE + 50}`

                                // }, obj.x + "-" + obj.y)
                            )
                        )
                    )
                )
            )
        )
});

import m from "mithril";

import css from "./index.css";

import "minireset.css";

const COUNT_X = Math.floor(window.innerWidth / 70) + 1;
const COUNT_Y = Math.floor(window.innerHeight / 142) + 1;

const X_SCALE = 70;
const Y_SCALE = 142;

function transform(obj) {
    return `rotate(45deg) translate(${obj.mod ? 50 : 0}px, ${obj.mod ? 50 : 0}px)`;
}

function opacity(obj, state) {
    if(!state.hover) {
        return 1;
    }

    let offset = {
            x : obj.x - state.hover.x,
            y : obj.y - state.hover.y
        },

        nw = offset.x === -1 && offset.y === (obj.mod ? -1 : 0),
        sw = offset.x === -1 && offset.y === (obj.mod ? 0 : 1),
        ne = offset.x === 1  && offset.y === (obj.mod ? -1 : 0),
        se = offset.x === 1  && offset.y === (obj.mod ? 0 : 1);
        // nw = offset.x === -1 && offset.y === 0,
        // sw = offset.x === -1 && offset.y === 1,
        // ne = offset.x === 1  && offset.y === 0,
        // se = offset.x === 1  && offset.y === 1;


    // currently hovered
    if(!offset.x && !offset.y) {
        return 0;
    }

    if(nw || sw || ne || se) {
        return 0.5;
    }

    return 1;
}

m.mount(document.getElementById("mount"), {
    oninit : (vnode) => {
        vnode.state.grid = [];

        for(let y = 0; y < COUNT_Y; y++) {
            for (let x = 0; x < COUNT_X; x++) {
                vnode.state.grid[y] = vnode.state.grid[y] || [];
                vnode.state.grid[y][x] = { x, y, mod : x % 2 };
            }
        }

        vnode.state.squares = 40;
    },
    view : (vnode) =>
        m("div", { class : css.charrgyl },
            m("svg", {
                    width  : 1920,
                    height : 1080,

                    viewBox : "0 0 1920 1080",
                    xmlns   : "http://www.w3.org/2000/svg"
                },
                vnode.state.grid.map((y) =>
                    y.map((obj) => m("g",
                        m("rect", {
                            x : obj.x * X_SCALE,
                            y : obj.y * Y_SCALE,

                            width  : 100,
                            height : 100,

                            style : {
                                opacity         : opacity(obj, vnode.state),
                                transform       : transform(obj),
                                transformOrigin : `${obj.x * X_SCALE + 50}px ${obj.y * Y_SCALE + 50}px`
                            },
                            onmousemove : () => {
                                vnode.state.hover = { x : obj.x, y : obj.y };
                                m.redraw();
                                // console.log(vnode.state.hover);
                            }
                        }),
                        m("text", {
                            x : obj.x * X_SCALE + 40,
                            y : obj.y * Y_SCALE + (obj.mod ? 120 : 40),
                            // transform       : transform(obj),
                            transformOrigin : `${obj.x * X_SCALE + 50}px ${obj.y * Y_SCALE + 50}`

                        }, obj.x + "-" + obj.y)

                    )

    // <text x="0" y="50" font-family="Verdana" font-size="35" fill="blue">Hello</text>
                    )
                )
            )
        )
});

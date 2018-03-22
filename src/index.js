import m from "mithril";

import css from "./index.css";

import "minireset.css";

const COUNT_X = Math.floor(window.innerWidth / 70) + 1;
const COUNT_Y = Math.floor(window.innerHeight / 142) + 1;

const X_SCALE = 70;
const Y_SCALE = 142;

function transform(obj) {
    return `rotate(45deg) translate(${obj.x % 2 ? 50 : 0}px, ${obj.x % 2 ? 50 : 0}px`;
}

function opacity(obj, state) {
    if(!state.hover) {
        return 1;
    }

    let offset = {
        x : Math.abs(obj.x - state.hover.x),
        y : Math.abs(obj.y - state.hover.y)
    }

    // currently hovered
    if(!offset.x && !offset.y) {
        return 0;
    }

    if(offset.x + offset.y < 2) {
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
                vnode.state.grid[y][x] = { x, y };
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
                            x : obj.x * X_SCALE,
                            y : obj.y * Y_SCALE,
                            transform       : transform(obj),
                            transformOrigin : `${obj.x * X_SCALE + 50}px ${obj.y * Y_SCALE + 50}`

                        }, obj.x + "-" + obj.y)

                    )

    // <text x="0" y="50" font-family="Verdana" font-size="35" fill="blue">Hello</text>
                    )
                )
            )
        )
});

const canvas = document.querySelector("#glcanvas");
let gl = canvas.getContext('webgl');

let renderElems = {
    bgImage: null,
    buttons: [],
    text: ""
};

function clearButtons() {
    document.getElementById("buttonL").innerHTML = "";
    document.getElementById("buttonLL").innerHTML = "";
    document.getElementById("buttonLC").innerHTML = "";
    document.getElementById("buttonLR").innerHTML = "";
    document.getElementById("buttonR").innerHTML = "";
}

let buttonClassToID = {
    "left":             "buttonL",
    "right":            "buttonR",
    "centerBottom":     "buttonLC",
    "leftBottom":       "buttonLL",
    "rightBottom":      "buttonLR"
}

if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
}
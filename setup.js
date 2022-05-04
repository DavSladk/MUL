let canvas = document.querySelector('#glcanvas');
let gl = canvas.getContext('webgl');

let renderElems = {
    bgImage: null,
    buttons: [],
    text: ""
};

if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
}
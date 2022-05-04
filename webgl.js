renderElems.bgImage = "bed.jpg";
renderElems.buttons = [
  {
    text: "Left",
    class: "leftBottom",
    to: 2
  },
  {
    text: "Right",
    class: "rightBottom",
    to: 1
  }
];
renderElems.text = "Hello world!"

buttonPositions = {
  "left":             {x: 100, y: 240},
  "right":            {x: 560, y: 240},
  "centerBottom":     {x:   0, y:  40},
  "leftBottom":       {x: 100, y:  40},
  "rightBottom":      {x: 540, y:  40}
};

const buttonW = 160;
const buttonH = 40;

let imgLoaded = false;
let end = false;

let programInfo = {};
let buffers = {};
let texture = null;

let canvas_mouseX = 320;
let canvas_mouseY = 240;

main();


// EVENT LISTENERS
function canvasClick(e) {
  var hitButton = false;

  // check for buttons clicked
  for (let i = 0; i < renderElems.buttons.length; i++) {
    const button = renderElems.buttons[i];
    const left   = buttonPositions[button.class].x - buttonW/2;
    const right  = buttonPositions[button.class].x + buttonW/2;
    const bottom = buttonPositions[button.class].y - buttonH/2;
    const top    = buttonPositions[button.class].y + buttonH/2;

    if (canvas_mouseX > left && canvas_mouseX < right &&
      canvas_mouseY > bottom && canvas_mouseY < top) {
        alert(`Going to slide ${button.to}`);
        loadSlide(button.to);
    }
  }


  if (!hitButton) {
    drawScene(gl, programInfo, buffers, texture);
  }
}

function canvasHover(e) {
  canvas_mouseX = e.clientX-10;
  canvas_mouseY = 480-(e.clientY-10);
  drawScene(gl, programInfo, buffers, texture);
}


// MAIN
function main() {
  const canvas = document.querySelector('#glcanvas');
  canvas.addEventListener("click", canvasClick);
  canvas.addEventListener("mousemove", canvasHover);

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTexCoord;

    varying vec2 v_texcoord;

    void main() {
      gl_Position = aVertexPosition;
      v_texcoord = aTexCoord;
    }
  `;

  // Fragment shader program

  const fsSource = `
    precision lowp float;

    varying vec2 v_texcoord;

    uniform int u_hl;
    uniform int useTexture;
    uniform vec4 u_color;
    uniform sampler2D u_texture;

    void main() {
      vec4 color = u_color;
      if (useTexture > 0) {
        color = texture2D(u_texture, v_texcoord);
      }
      if (u_hl > 0) {
        vec4 highlight = vec4(1.0) - color;
        float increment =
          5.0*clamp(abs(v_texcoord.x-0.5)-0.4, 0.0, 0.1) +
          5.0*clamp(abs(v_texcoord.y-0.5)-0.4, 0.0, 0.1);
        color += increment*highlight;
      }
      gl_FragColor = color;
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      texCoords: gl.getAttribLocation(shaderProgram, "aTexCoord"),
    },
    uniformLocations: {
      useTexture: gl.getUniformLocation(shaderProgram, "useTexture"),
      highlight: gl.getUniformLocation(shaderProgram, "u_hl"),
      uColor: gl.getUniformLocation(shaderProgram, "u_color"),
      uTexture: gl.getUniformLocation(shaderProgram, "u_texture")
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  buffers = initBuffers(gl);

  // Texture buffer
  texture = loadTexture(gl, renderElems.bgImage);

  // Draw the scene
  drawScene(gl, programInfo, buffers, texture);
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple two-dimensional square.
//
function initBuffers(gl) {

  // Create a buffer for the square's positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


  const textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);

  const texCoords = [
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    1.0, 1.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    textures: textureBuffer
  };
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, texture) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // ==========
  // BACKGROUND
  // ==========
  if (renderElems.bgImage != "") {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    const oX = -(canvas_mouseX - 320)/1280;
    const oY = -(canvas_mouseY - 240)/960;
    const positions = [
      1.5+oX,  1.5+oY,
     -1.5+oX,  1.5+oY,
      1.5+oX, -1.5+oY,
     -1.5+oX, -1.5+oY,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);

    // set texture coords
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textures);
    gl.vertexAttribPointer(
        programInfo.attribLocations.texCoords, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.texCoords);
      
    gl.useProgram(programInfo.program);

    {
      const offset = 0;
      const vertexCount = 4;

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(programInfo.uniformLocations.uTexture, 0);
      gl.uniform1i(programInfo.uniformLocations.highlight, 0);
      gl.uniform1i(programInfo.uniformLocations.useTexture, 1);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
  }


  // =======
  // BUTTONS
  // =======
  for (let i = 0; i < renderElems.buttons.length; i++) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    const button = renderElems.buttons[i];
    const left   = buttonPositions[button.class].x - buttonW/2;
    const right  = buttonPositions[button.class].x + buttonW/2;
    const bottom = buttonPositions[button.class].y - buttonH/2;
    const top    = buttonPositions[button.class].y + buttonH/2;
    const cY = buttonPositions[button.class].y;
    const positions = [
      left,  bottom,
      right, bottom,
      left,  top,
      right, top,
    ];

    // check for highlighting
    var useHighlight = false;
    if (canvas_mouseX > left && canvas_mouseX < right &&
      canvas_mouseY > bottom && canvas_mouseY < top) {
      useHighlight = true;
    }

    // normalize
    for (let p = 0; p < positions.length; p+=2) {
      positions[p] = (2*positions[p]/640)-1;
      positions[p+1] = (2*positions[p+1]/480)-1;
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexPosition);

    gl.useProgram(programInfo.program);

    {
      const offset = 0;
      const vertexCount = 4;

      gl.uniform1i(programInfo.uniformLocations.highlight, useHighlight ? 1 : 0);
      gl.uniform1i(programInfo.uniformLocations.useTexture, 0);
      gl.uniform4fv(programInfo.uniformLocations.uColor, new Float32Array([0.7, 0.5, 0.05, 1.0]))
      
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
  }

  // ====
  // TEXT
  // ====
  if (renderElems.text != "") {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    const positions = [
      -0.95, 0.8,
       0.95, 0.8,
      -0.95, 0.95,
       0.95, 0.95,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexPosition);

    gl.useProgram(programInfo.program);

    {
      const offset = 0;
      const vertexCount = 4;

      gl.uniform1i(programInfo.uniformLocations.highlight, 0);
      gl.uniform1i(programInfo.uniformLocations.useTexture, 0);
      gl.uniform4fv(programInfo.uniformLocations.uColor, new Float32Array([0.0, 0.0, 0.0, 1.0]))
      
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
  }
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

// load textures (called with every new slide)
function loadTexture(gl, src) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // enter placeholder
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255,0,0,255])
  );

  // load image
  const image = new Image();
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    drawScene(gl, programInfo, buffers, texture);
  };
  image.crossOrigin = "";
  if (src == "bed.jpg") {
    image.src = "https://i.imgur.com/zdio00e.jpeg";
  } else {
    image.src = "https://i.imgur.com/xn7lVCw.jpeg";
  }

  return texture;
}
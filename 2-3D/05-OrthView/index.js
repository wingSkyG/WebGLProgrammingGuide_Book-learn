import vertexSource from "./shader/vertex_shader.vert";
import fragmentSource from "./shader/fragment_shader.frag";
import "../../lib/cuon-matrix";
import { initShader, initWebGL } from "../../lib/utils";

let g_near = 0.;
let g_far = .5;

const LEFT = 37;
const RIGHT = 39;
const UP = 38;
const DOWN = 40;

let dislayElement = document.getElementById("nearFar");
if (!dislayElement) {
  console.log("Failed to find nearFarElement element");
}

render();

function render() {
  const gl = initWebGL("canvas");
  if (!gl) {
    console.log("Failed to intialize WebGL");
    return;
  }

  let isShaderInitialized = initShader(gl, vertexSource, fragmentSource);
  if (!isShaderInitialized) {
    console.log("Failed to intialize shaders");
    return;
  }

  let vertexCnt = initVertexBuffers(gl);
  if (vertexCnt < 0) {
    console.log("Failed to intialize vertex buffers");
    return;
  }

  let u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");
  if (!u_ProjMatrix) {
    console.log('Failed to get the storage locations of u_ProjMatrix');
    return;
  }

  /** @type {Matrix4} */
  let projMatrix = new Matrix4();
  draw(gl, vertexCnt, u_ProjMatrix, projMatrix, displayInfo);

  document.onkeydown = function (ev) {
    keydown(ev, gl, vertexCnt, u_ProjMatrix, projMatrix);
  };
}

/**
 * @param {number} near 
 * @param {number} far 
 */
function displayInfo(near, far) {
  dislayElement.innerHTML = 'near: ' + Math.round(g_near * 100) / 100 + ', ' +
    'far: ' + Math.round(g_far * 100) / 100;
  return;
}

/**
 * 
 * @param {KeyboardEvent} ev 
 * @param {WebGLRenderingContext} gl 
 * @param {number} vertexCnt 
 * @param {WebGLUniformLocation} u_ProjMatrix 
 * @param {Matrix4} projMatrix
 * @returns 
 */
function keydown(ev, gl, vertexCnt, u_ProjMatrix, projMatrix) {
  switch (ev.keyCode) {
    case RIGHT: g_near += .01; break;
    case LEFT: g_near -= .01; break;
    case UP: g_far += .01; break;
    case DOWN: g_far -= .01; break;
    default: return;
  }

  draw(gl, vertexCnt, u_ProjMatrix, projMatrix, displayInfo);
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {number} vertexCnt
 * @param {WebGLUniformLocation} u_ProjMatrix
 * @param {Matrix4} projMatrix
 * @param {number} nearFar
 */
function draw(gl, vertexCnt, u_ProjMatrix, projMatrix, callback) {
  projMatrix.setOrtho(-1, 1, -1, 1, g_near, g_far);

  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, vertexCnt);

  if (callback && typeof callback === 'function') {
    callback({
      near: g_near,
      far: g_far
    });
  }
}

/**
 * @param {WebGLRenderingContext} gl 
 * @returns 
 */
function initVertexBuffers(gl) {
  let verticesColors = new Float32Array([
     0.,  .5, -.4, .4, 1., .4,
    -.5, -.5, -.4, .4, 1., .4,
     .5, -.5, -.4, 1., .4, .4,
     
     .5,  .4, -.2, 1., .4, .4,
    -.5,  .4, -.2, 1., 1., .4,
     0., -.6, -.2, 1., 1., .4,
     
     0.,  .5,  0., .4, .4, 1.,
    -.5, -.5,  0., .4, .4, 1.,
     .5, -.5,  0., 1., .4, .4
  ]);
  let vertexCnt = 9;

  let vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  let FSIZE = verticesColors.BYTES_PER_ELEMENT;
  let a_Position = gl.getAttribLocation(gl.program, "a_Position");
  let a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }
  if (a_Color < 0) {
    console.log("Failed to get the storage location of a_Color");
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * FSIZE, 0);
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE);

  gl.enableVertexAttribArray(a_Position);
  gl.enableVertexAttribArray(a_Color);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return vertexCnt;
}
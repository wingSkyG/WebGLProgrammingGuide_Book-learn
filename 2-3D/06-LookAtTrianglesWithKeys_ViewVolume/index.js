import vertexSource from "./shader/vertex_shader.vert";
import fragmentSource from "./shader/fragment_shader.frag";
import "../../lib/cuon-matrix";
import { initShader, initWebGL } from "../../lib/utils";

let g_EyeX = .2;
let g_EyeY = .25;
let g_EyeZ = .25;

const LEFT = 37;
const RIGHT = 39;

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

  let u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  let u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage locations of u_ViewMatrix');
    return;
  }
  if (!u_ProjMatrix) {
    console.log('Failed to get the storage locations of u_ProjMatrix');
    return;
  }

  let viewMatrix = new Matrix4();
  
  let projMatrix = new Matrix4();
  projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 0.0, 2.0);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  draw(gl, vertexCnt, u_ViewMatrix, viewMatrix);

  document.onkeydown = function (ev) {
    keydown(ev, gl, vertexCnt, u_ViewMatrix, viewMatrix);
  };
}

/**
 * 
 * @param {KeyboardEvent} ev 
 * @param {WebGLRenderingContext} gl 
 * @param {number} vertexCnt 
 * @param {WebGLUniformLocation} u_ViewMatrix 
 * @param {Matrix4} viewMatrix
 * @returns 
 */
function keydown(ev, gl, vertexCnt, u_ViewMatrix, viewMatrix) {
  switch (ev.keyCode) {
    case RIGHT: g_EyeX += 0.01; break;
    case LEFT: g_EyeX -= 0.01; break;
    default: return;
  }

  draw(gl, vertexCnt, u_ViewMatrix, viewMatrix);
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {number} vertexCnt
 * @param {WebGLUniformLocation} u_ViewMatrix
 * @param {Matrix4} viewMatrix
 */
function draw(gl, vertexCnt, u_ViewMatrix, viewMatrix) {
  viewMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ, 0, 0, 0, 0, 1, 0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, vertexCnt);
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
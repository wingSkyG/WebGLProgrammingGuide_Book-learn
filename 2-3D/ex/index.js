import vertexSource from "./shader/vertex_shader.vert";
import fragmentSource from "./shader/fragment_shader.frag";
import "../lib/cuon-matrix";
import { initShader, initWebGL } from "../lib/utils";

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

  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage locations of u_MvpMatrix');
    return;
  }

  let mvpMatrix = new Matrix4();
  mvpMatrix.setPerspective(30, 1, 1, 100);
  mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.drawElements(gl.TRIANGLES, vertexCnt, gl.UNSIGNED_BYTE, 0);
}

/**
 * @param {WebGLRenderingContext} gl 
 * @returns 
 */
function initVertexBuffers(gl) {
  let vertices = new Float32Array([
     1.,  1.,  1.,   -1.,  1.,  1.,    -1., -1.,  1.,    1., -1.,  1., // front
     1.,  1.,  1.,    1., -1.,  1.,     1., -1., -1.,    1.,  1., -1., // right
     1.,  1.,  1.,    1.,  1., -1.,    -1.,  1., -1.,   -1.,  1.,  1., // up
    -1.,  1.,  1.,   -1.,  1., -1.,    -1., -1., -1.,   -1., -1.,  1., // left
    -1., -1., -1.,    1., -1., -1.,     1., -1.,  1.,   -1., -1.,  1., // down
     1., -1., -1.,   -1., -1., -1.,    -1.,  1., -1.,    1.,  1., -1.  // back
  ]);

  let colors = new Float32Array([
    .4, .4, 1.,     .4, .4, 1.,     .4, .4, 1.,     .4, .4, 1., // front-blue
    .4, 1., .4,     .4, 1., .4,     .4, 1., .4,     .4, 1., .4, // right-green
    1., .4, .4,     1., .4, .4,     1., .4, .4,     1., .4, .4, // up-red
    1., 1., .4,     1., 1., .4,     1., 1., .4,     1., 1., .4, // left
    1., 1., 1.,     1., 1., 1.,     1., 1., 1.,     1., 1., 1., // down
    .4, 1., 1.,     .4, 1., 1.,     .4, 1., 1.,     .4, 1., 1.  // back
  ]);
  // let colors = new Float32Array([
  //   1., 1., 1.,     1., 1., 1.,     1., 1., 1.,     1., 1., 1., // front-blue
  //   1., 1., 1.,     1., 1., 1.,     1., 1., 1.,     1., 1., 1., // right-green
  //   1., 1., 1.,     1., 1., 1.,     1., 1., 1.,     1., 1., 1., // up-red
  //   1., 1., 1.,     1., 1., 1.,     1., 1., 1.,     1., 1., 1., // left
  //   1., 1., 1.,     1., 1., 1.,     1., 1., 1.,     1., 1., 1., // down
  //   1., 1., 1.,     1., 1., 1.,     1., 1., 1.,     1., 1., 1.  // back
  // ]);

  let indices = new Uint8Array([
     0,  1,  2,   0,  2,  3, // front
     4,  5,  6,   4,  6,  7, // right
     8,  9, 10,   8, 10, 11, // up
    12, 13, 14,  12, 14, 15, // left
    16, 17, 18,  16, 18, 19, // down
    20, 21, 22,  20, 22, 23  // back
  ])
  let drawnVertexCnt = indices.length;

  if (!initArrayBuffer(gl, vertices, 'a_Position')) {
    return -1;
  }

  if (!initArrayBuffer(gl, colors, 'a_Color')) {
    return -1;
  }

  if (!initElementArrayBuffer(gl, indices)) {
    return -1;
  }

  return drawnVertexCnt;
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {Float32Array<ArrayBuffer>} data
 */
function initElementArrayBuffer(gl, data) {
  let buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

  return true;
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {Float32Array<ArrayBuffer>} data 
 * @param {number} size 
 * @param {number} type 
 * @param {number} attribute 
 */
function initArrayBuffer(gl, data, attribute) {
  let buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  let a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }

  gl.vertexAttribPointer(a_attribute, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_attribute);

  return true;
}
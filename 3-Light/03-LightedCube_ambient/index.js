import vertexSource from "./shader/vertex_shader.vert";
import fragmentSource from "./shader/fragment_shader.frag";
import "../../lib/cuon-matrix";
import { initShader, initWebGL } from "../../lib/utils";

let lightColor = new Vector3([1., 1., 1.]);
let ambientLight = new Vector3([.2, .2, .2]);

const ANGLE_STEP = 30.0;
let g_last = Date.now();

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
  let u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  let u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  let u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
  var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage locations of u_MvpMatrix');
    return;
  }
  if (!u_NormalMatrix) { 
    console.log('Failed to get the storage locations of u_NormalMatrix');
    return;
  }
  if (!u_LightColor) { 
    console.log('Failed to get the storage locations of u_LightColor');
    return;
  }
  if (!u_LightDirection) { 
    console.log('Failed to get the storage locations of u_LightDirection');
    return;
  }
  if (!u_AmbientLight) { 
    console.log('Failed to get the storage locations of u_AmbientLight');
    return;
  }

  let vpMatrix = new Matrix4();
  vpMatrix.setPerspective(30, 1, 1, 100);
  vpMatrix.lookAt(3, 3, 15, 0, 0, 0, 0, 1, 0);
  gl.uniformMatrix4fv(u_MvpMatrix, false, vpMatrix.elements);

  let lightDirection = new Vector3([.5, 3., 4.]);
  lightDirection.normalize();
  gl.uniform3fv(u_LightColor, lightColor.elements);
  lightDirection.normalize();
  gl.uniform3fv(u_LightDirection, lightDirection.elements);
  gl.uniform3fv(u_AmbientLight, ambientLight.elements);

  let currentAngle = 0.0;
  let modelMatrix = new Matrix4();
  let mvpMatrix = new Matrix4();
  let normalMatrix = new Matrix4();
  let tick = function() {
    currentAngle = rotate(currentAngle);

    modelMatrix.setRotate(currentAngle, 0, 1, 0);
    mvpMatrix.set(vpMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, vertexCnt, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(tick);
  };
  tick();
}

function rotate(angle) {
  let now = Date.now();
  let elapsed = now - g_last;
  g_last = now;

  let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  let minAngle = newAngle %= 360;
  return minAngle;
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

  let normals = new Float32Array([
     0.,  0.,  1.,      0.,  0.,  1.,      0.,  0.,  1.,      0.,  0.,  1.,
     1.,  0.,  0.,      1.,  0.,  0.,      1.,  0.,  0.,      1.,  0.,  0.,
     0.,  1.,  0.,      0.,  1.,  0.,      0.,  1.,  0.,      0.,  1.,  0.,
    -1.,  0.,  0.,     -1.,  0.,  0.,     -1.,  0.,  0.,     -1.,  0.,  0., 
     0., -1.,  0.,      0., -1.,  0.,      0., -1.,  0.,      0., -1.,  0.,
     0.,  0., -1.,      0.,  0., -1.,      0.,  0., -1.,      0.,  0., -1.
  ]);

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

  if (!initArrayBuffer(gl, normals, 'a_Normal')) {
    return -1;
  }

  if (!initElementArrayBuffer(gl, indices)) {
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

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
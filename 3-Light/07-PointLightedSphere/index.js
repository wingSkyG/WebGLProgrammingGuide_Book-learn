import vertexSource from "./shader/vertex_shader.vert";
import fragmentSource from "./shader/fragment_shader.frag";
import "../../lib/cuon-matrix";
import { initShader, initWebGL } from "../../lib/utils";

let LightPosition = new Vector3([5., 8., 7.]);
let lightColor = new Vector3([.8, .8, .8]);
let ambientLight = new Vector3([.2, .2, .2]);

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

  let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  let u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  let u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
  let u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage locations of u_ModelMatrix');
    return;
  }
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage locations of u_MvpMatrix');
    return;
  }
  if (!u_NormalMatrix) { 
    console.log('Failed to get the storage locations of u_NormalMatrix');
    return;
  }
  if (!u_LightPosition) { 
    console.log('Failed to get the storage locations of u_LightPosition');
    return;
  }
  if (!u_LightColor) { 
    console.log('Failed to get the storage locations of u_LightColor');
    return;
  }
  if (!u_AmbientLight) { 
    console.log('Failed to get the storage locations of u_AmbientLight');
    return;
  }

  let modelMatrix = new Matrix4();
  let mvpMatrix = new Matrix4();
  let normalMatrix = new Matrix4();

  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  mvpMatrix.setPerspective(30, 1, 1, 100);
  mvpMatrix.lookAt(0, 0, 9, 0, 0, 0, 0, 1, 0);
  mvpMatrix.multiply(modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.uniform3fv(u_LightPosition, LightPosition.elements);
  gl.uniform3fv(u_LightColor, lightColor.elements);
  gl.uniform3fv(u_AmbientLight, ambientLight.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, vertexCnt, gl.UNSIGNED_SHORT, 0);
}

/**
 * @param {WebGLRenderingContext} gl 
 * @returns 
 */
function initVertexBuffers(gl) {
  let SPHERE_DIV = 13;

  let i, ai, si, ci;
  let j, aj, sj, cj;
  let p1, p2;

  let positions = [];
  let indices = [];

  // Generate coordinates
  for (j = 0; j <= SPHERE_DIV; j++) {
    aj = j * Math.PI / SPHERE_DIV;
    sj = Math.sin(aj);
    cj = Math.cos(aj);
    for (i = 0; i <= SPHERE_DIV; i++) {
      ai = i * 2 * Math.PI / SPHERE_DIV;
      si = Math.sin(ai);
      ci = Math.cos(ai);

      positions.push(si * sj);  // X
      positions.push(cj);       // Y
      positions.push(ci * sj);  // Z
    }
  }

  // Generate indices
  for (j = 0; j < SPHERE_DIV; j++) {
    for (i = 0; i < SPHERE_DIV; i++) {
      p1 = j * (SPHERE_DIV+1) + i;
      p2 = p1 + (SPHERE_DIV+1);

      indices.push(p1);
      indices.push(p2);
      indices.push(p1 + 1);

      indices.push(p1 + 1);
      indices.push(p2);
      indices.push(p2 + 1);
    }
  }

  let drawnVertexCnt = indices.length;

  if (!initArrayBuffer(gl, new Float32Array(positions), 'a_Position')) {
    return -1;
  }

  if (!initArrayBuffer(gl, new Float32Array(positions), 'a_Normal')) {
    return -1;
  }

  if (!initElementArrayBuffer(gl, new Uint16Array(indices))) {
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return drawnVertexCnt;
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {Uint16Array<ArrayBuffer>} data
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
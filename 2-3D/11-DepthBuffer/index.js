import vertexSource from "./shader/vertex_shader.vert";
import fragmentSource from "./shader/fragment_shader.frag";
import "../../lib/cuon-matrix";
import { initShader, initWebGL } from "../../lib/utils";

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
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }

  let modelMatrix = new Matrix4();
  let viewMatrix = new Matrix4();
  let projMatrix = new Matrix4();
  let mvpMatrix = new Matrix4();

  modelMatrix.setTranslate(.75, 0., 0.);
  viewMatrix.setLookAt(0., 0., 5., 0., 0., -100., 0., 1., 0.);
  projMatrix.setPerspective(30., 1., 1., 100.);
  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  draw(gl, vertexCnt);

  modelMatrix.setTranslate(-.75, 0., 0.);
  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  draw(gl, vertexCnt);
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {number} vertexCnt
 */
function draw(gl, vertexCnt) {
  gl.drawArrays(gl.TRIANGLES, 0, vertexCnt);
}

/**
 * @param {WebGLRenderingContext} gl 
 * @returns 
 */
function initVertexBuffers(gl) {
  let verticesColors = new Float32Array([
     0.,  1., 0., .4, .4, 1.,
    -.5, -1., 0., .4, .4, 1.,
     .5, -1., 0., 1., .4, .4, 

     0.,  1., -2., 1., 1., .4,
    -.5, -1., -2., 1., 1., .4,
     .5, -1., -2., 1., .4, .4,
     
     0.,  1., -4., .4, 1., .4,
    -.5, -1., -4., .4, 1., .4,
     .5, -1., -4., 1., .4, .4,
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
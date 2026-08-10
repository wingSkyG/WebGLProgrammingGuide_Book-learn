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
  let verticesColors = new Float32Array([
     1.,  1.,  1., 1., 1., 1.,
    -1.,  1.,  1., 1., 0., 1.,
    -1., -1.,  1., 1., 0., 0., 
     1., -1.,  1., 1., 1., 0.,
     1., -1., -1., 0., 1., 1.,
     1.,  1., -1., 0., 1., 1.,
    -1.,  1., -1., 0., 0., 1.,
    -1., -1., -1., 0., 0., 0.
  ]);

  let indices = new Uint8Array([
    0, 1, 2, 0, 2, 3,
    0, 3, 4, 0, 4, 5,
    0, 5, 6, 0, 6, 1,
    1, 6, 7, 1, 7, 2,
    7, 4, 3, 7, 3, 2,
    4, 7, 6, 4, 6, 5
  ])
  let drawnVertexCnt = indices.length;

  let vertexColorBuffer = gl.createBuffer();
  let indexBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log("Failed to create the buffer object vertexColorBuffer");
    return -1;
  }
  if (!indexBuffer) {
    console.log("Failed to create the buffer object indexBuffer");
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

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return drawnVertexCnt;
}
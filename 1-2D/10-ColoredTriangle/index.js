import vertexSource from "./shader/vertex_shader.vert";
import fragmentSource from "./shader/fragment_shader.frag";
import { initShader, initWebGL } from "../../lib/utils";

render();

function render() {
  const gl = initWebGL("canvas");
  initShader(gl, vertexSource, fragmentSource);
  let vertexCnt = initVertexBuffers(gl);
  draw(gl, vertexCnt);
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {number} vertexCnt
 */
function draw(gl, vertexCnt) {
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
     0.,  .5, 1., 0., 0.,
    -.5, -.5, 0., 1., 0.,
     .5, -.5, 0., 0., 1.
  ]);
  let vertexCnt = 3;

  let vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  let FSIZE = verticesColors.BYTES_PER_ELEMENT;

  let a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 5 * FSIZE, 0);
  gl.enableVertexAttribArray(a_Position);

  let a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    console.log("Failed to get the storage location of a_Color");
    return;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 5 * FSIZE, 2 * FSIZE);
  gl.enableVertexAttribArray(a_Color);

  return vertexCnt;
}
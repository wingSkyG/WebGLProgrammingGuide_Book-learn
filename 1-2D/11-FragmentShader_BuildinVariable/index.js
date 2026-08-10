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
  let vertices = new Float32Array([
     0.,  .5,
    -.5, -.5,
     .5, -.5
  ]);
  let vertexCnt = 3;

  let vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  let a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  let u_Width = gl.getUniformLocation(gl.program, "u_Width");
  if (u_Width < 0) {
    console.log("Failed to get the storage location of u_Width");
    return;
  }
  let u_Height = gl.getUniformLocation(gl.program, "u_Height");
  if (u_Height < 0) {
    console.log("Failed to get the storage location of u_Height");
    return;
  }
  gl.uniform1f(u_Width, gl.drawingBufferWidth);
  gl.uniform1f(u_Height, gl.drawingBufferHeight);

  return vertexCnt;
}
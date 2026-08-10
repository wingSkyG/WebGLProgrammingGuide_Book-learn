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

  let u_ViewProjMatrix = gl.getUniformLocation(gl.program, 'u_ViewProjMatrix');
  if (!u_ViewProjMatrix) { 
    console.log('Failed to get the storage locations of u_ViewProjMatrix');
    return;
  }

  let viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(30, 1, 1, 100);
  viewProjMatrix.lookAt(3.06, 2.5, 10.0, 0, 0, -2, 0, 1, 0);
  gl.uniformMatrix4fv(u_ViewProjMatrix, false, viewProjMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.enable(gl.POLYGON_OFFSET_FILL);

  gl.drawArrays(gl.TRIANGLES, 0., vertexCnt / 2);
  gl.polygonOffset(1., 1.);
  gl.drawArrays(gl.TRIANGLES, vertexCnt / 2, vertexCnt / 2);

  console.log(gl.getParameter(gl.POLYGON_OFFSET_FACTOR));
  console.log(gl.getParameter(gl.POLYGON_OFFSET_UNITS));
}

/**
 * @param {WebGLRenderingContext} gl 
 * @returns 
 */
function initVertexBuffers(gl) {
  let verticesColors = new Float32Array([
      0.,  2.5, -5., .4, 1., .4,
    -2.5, -2.5, -5., .4, 1., .4,
     2.5, -2.5, -5., 1., .4, .4, 

      0.,  3., -5., 1., .4, .4,
     -3., -3., -5., 1., 1., .4,
      3., -3., -5., 1., 1., .4,
  ]);
  let vertexCnt = 6;

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
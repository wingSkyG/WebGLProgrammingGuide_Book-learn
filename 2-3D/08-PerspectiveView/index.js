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

  viewMatrix.setLookAt(0., 0., 5., 0., 0., -100., 0., 1., 0.);
  projMatrix.setPerspective(30., 1., 1., 100.); // aspect默认为1：1

  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

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
    // Three triangles on the right side
    0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
    0.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
    1.25, -1.0,  -4.0,  1.0,  0.4,  0.4, 

    0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
    0.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
    1.25, -1.0,  -2.0,  1.0,  0.4,  0.4, 

    0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
    0.25, -1.0,   0.0,  0.4,  0.4,  1.0,
    1.25, -1.0,   0.0,  1.0,  0.4,  0.4, 

    // Three triangles on the left side
   -0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
   -1.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
   -0.25, -1.0,  -4.0,  1.0,  0.4,  0.4, 

   -0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
   -1.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
   -0.25, -1.0,  -2.0,  1.0,  0.4,  0.4, 

   -0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
   -1.25, -1.0,   0.0,  0.4,  0.4,  1.0,
   -0.25, -1.0,   0.0,  1.0,  0.4,  0.4, 
  ]);
  let vertexCnt = 18;

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
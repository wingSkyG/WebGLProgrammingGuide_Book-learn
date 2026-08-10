import vertexSource from "./shader/vertex_shader.vert";
import fragmentSource from "./shader/fragment_shader.frag";
import { initShader, initWebGL } from "../../lib/utils";

render();

function render() {
  const gl = initWebGL("canvas");
  if (!gl) {
    console.log("Failed to intialize WebGL");
  }

  let isInitialized = initShader(gl, vertexSource, fragmentSource);
  if (!isInitialized) {
    console.log("Failed to intialize shaders");
    return;
  }
  let vertexCnt = initVertexBuffers(gl);
  if (vertexCnt < 0) {
    console.log("Failed to intialize vertex buffers");
    return;
  }

  if (!initTextures(gl, vertexCnt)) {
    console.log('Failed to intialize the texture.');
    return;
  }
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
  // let verticesTexCoords = new Float32Array([
  //   -.5,  .5, 0., 1.,
  //   -.5, -.5, 0., 0.,
  //    .5,  .5, 1., 1.,
  //    .5, -.5, 1., 0.
  // ]);
  let verticesTexCoords = new Float32Array([
    -.5,  .5, -.3, 1.7,
    -.5, -.5, -.3, -.2,
     .5,  .5, 1.7, 1.7,
     .5, -.5, 1.7, -.2
  ]);
  let vertexCnt = 4;

  let vertexTexCoordBuffer = gl.createBuffer();
  if (!vertexTexCoordBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  let FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
  let a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }
  let a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
  if (a_TexCoord < 0) {
    console.log("Failed to get the storage location of a_TexCoord");
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * FSIZE, 0);
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 4 * FSIZE, 2 * FSIZE);

  gl.enableVertexAttribArray(a_Position);
  gl.enableVertexAttribArray(a_TexCoord);

  return vertexCnt;
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {number} vertexCnt
 * @returns {number} 
 */
function initTextures(gl, vertexCnt) {
  let texture = gl.createTexture();
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }

  let u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
  if (!u_Sampler) {
    console.log("Failed to get the storage location of u_Sampler");
    return false;
  }

  let image = new Image();
  if (!image) {
    console.log("Failed to create the image object");
    return false;
  }
  image.onload = function () {
    loadTexture(gl, vertexCnt, texture, u_Sampler, image);
  }
  image.src = "../resources/sky.jpg";

  return true;
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {number} vertexCnt 
 * @param {WebGLTexture} texture 
 * @param {number} u_sampler 
 * @param {Image} image 
 */
function loadTexture(gl, vertexCnt, texture, u_sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_sampler, 0);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCnt);
}
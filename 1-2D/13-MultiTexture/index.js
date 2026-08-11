import vertexSource from "./shader/vertex_shader.vert";
import fragmentSource from "./shader/fragment_shader.frag";
import { initShader, initWebGL } from "../../lib/utils";

render();

function render() {
  const gl = initWebGL("canvas");
  if (!gl) {
    console.log("Failed to intialize WebGL");
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

  let isTextureInitialized = initTextures(gl, vertexCnt);
  if (!isTextureInitialized) {
    console.log('Failed to intialize the texture.');
    return;
  }
}

/**
 * @param {WebGLRenderingContext} gl 
 * @returns 
 */
function initVertexBuffers(gl) {
  let verticesTexCoords = new Float32Array([
    -.5,  .5, 0., 1.,
    -.5, -.5, 0., 0.,
     .5,  .5, 1., 1.,
     .5, -.5, 1., 0.
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
  let texture0 = gl.createTexture();
  let texture1 = gl.createTexture();
  if (!texture0) {
    console.log("Failed to create the texture object");
    return false;
  }
  if (!texture1) {
    console.log("Failed to create the texture object");
    return false;
  }

  let u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
  let u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
  if (!u_Sampler0) {
    console.log("Failed to get the storage location of u_Sampler0");
    return false;
  }
  if (!u_Sampler1) {
    console.log("Failed to get the storage location of u_Sampler1");
    return false;
  }

  let image0 = new Image();
  let image1 = new Image();
  if (!image0) {
    console.log("Failed to create the image object");
    return false;
  }
  if (!image1) {
    console.log("Failed to create the image object");
    return false;
  }
  image0.onload = function () {
    loadTexture(gl, vertexCnt, texture0, u_Sampler0, image0, 0);
  }
  image1.onload = function () {
    loadTexture(gl, vertexCnt, texture1, u_Sampler1, image1, 1);
  }
  image0.src = "../../resources/image/sky.JPG";
  image1.src = "../../resources/image/circle.gif";

  return true;
}

let g_texUnit0 = false;
let g_texUnit1 = false;
/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {number} vertexCnt 
 * @param {WebGLTexture} texture 
 * @param {number} u_sampler 
 * @param {Image} image
 * @param {number} texUnit
 */
function loadTexture(gl, vertexCnt, texture, u_sampler, image, texUnit) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  if (texUnit == 0) {
    gl.activeTexture(gl.TEXTURE0);
    g_texUnit0 = true;
  }
  if (texUnit == 1) {
    gl.activeTexture(gl.TEXTURE1);
    g_texUnit1 = true;
  }
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_sampler, texUnit);

  gl.clear(gl.COLOR_BUFFER_BIT);
  if (g_texUnit0 && g_texUnit1) {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCnt);
  }
}
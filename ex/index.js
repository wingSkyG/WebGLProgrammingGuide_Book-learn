import { initShader, initWebGL } from "../lib/utils";
import vertexSource from "./shader/vertex_shader.vert";
import fragmentSource from "./shader/fragment_shader.frag";
import "../lib/cuon-matrix";
import "../lib/webgl-obj-loader.js";

const modelPath = "../resources/model/sphere.obj";
const angle = 0;
const eyePos = new Float32Array([0., 0, 100.]);
const lightColor = new Float32Array([1., 0.5, 0.3]);
const lightDirection = new Float32Array([-.5, .5, .8]);

render();

function render() {
  /**
   * @type {WebGLRenderingContext}
   */
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

  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  /**@type {WebGLProgram} */
  let program = gl.program;

  getLocations(gl, program);
  let bufferObject = initEmptyVertexBuffers(gl, program);
  if (!bufferObject) {
    console.log('Failed to get the storage locations');
    return;
  }
  configShader(gl, program);

  readOBJFile(modelPath, gl, bufferObject, 1, true);
  setTimeout(() => {
    draw(gl, bufferObject);
  }, 1000);
}

function draw(gl, bufferObject) {
  if (g_objDoc != null && g_objDoc.isMTLComplete()){ // OBJ and all MTLs are available
    g_drawingInfo = onReadComplete(gl, bufferObject, g_objDoc);
    g_objDoc = null;
  }

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 */
function configShader(gl, program) {
  let modelMatrix = new Matrix4();
  modelMatrix.setRotate(angle, 1.0, 0.0, 0.0);
  modelMatrix.rotate(angle, 0.0, 1.0, 0.0);
  modelMatrix.rotate(angle, 0.0, 0.0, 1.0);

  let mvpMatrix = new Matrix4();
  mvpMatrix.setPerspective(30, 1, 1, 5000);
  mvpMatrix.lookAt(eyePos[0], eyePos[1], eyePos[2], 0, 0, 0, 0, 1, 0);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, mvpMatrix.elements);

  let normalMatrix = new Matrix4();
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(program.u_NormalMatrix, false, normalMatrix.elements);

  gl.uniform3fv(program.u_LightColor, lightColor);
  gl.uniform3fv(program.u_LightDirection, lightDirection);
}


function getLocations(gl, program) {
  program.a_Position = gl.getAttribLocation(program, 'a_Position');
  program.a_Color = gl.getAttribLocation(program, 'a_Color');
  program.a_Normal = gl.getAttribLocation(program, 'a_Normal');
  program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
  program.u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');
  program.u_LightColor = gl.getUniformLocation(program, 'u_LightColor');
  program.u_LightDirection = gl.getUniformLocation(program, 'u_LightDirection');

  if (program.a_Position < 0 ||  program.a_Normal < 0 || program.a_Color < 0 ||
      !program.u_MvpMatrix || !program.u_NormalMatrix || !program.u_LightColor || !program.u_LightDirection) {
    console.log('Failed to create the buffer object'); 
    return;
  }
}

/**
 * Create an buffer object and perform an initial configuration
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLProgram} program 
 * @returns Object
 */
function initEmptyVertexBuffers(gl, program) {
  var bufferObject = new Object(); // Utilize Object object to return multiple buffer objects

  bufferObject.vertexBuffer = createEmptyArrayBuffer(gl, program.a_Position, 3, gl.FLOAT); 
  bufferObject.normalBuffer = createEmptyArrayBuffer(gl, program.a_Normal, 3, gl.FLOAT);
  bufferObject.colorBuffer = createEmptyArrayBuffer(gl, program.a_Color, 4, gl.FLOAT);
  bufferObject.indexBuffer = gl.createBuffer();
  if (!bufferObject.vertexBuffer || !bufferObject.normalBuffer || !bufferObject.colorBuffer || !bufferObject.indexBuffer) {
    return null;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return bufferObject;
}

/**
 * Create a buffer object, assign it to attribute variables, and enable the assignment
 * @param {WebGLRenderingContext} gl 
 * @param {number} attribute 
 * @param {number} size 
 * @param {number} type 
 * @returns {WebGLBuffer}
 */
function createEmptyArrayBuffer(gl, attribute, size, type) {
  var buffer =  gl.createBuffer();  // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(attribute, size, type, false, 0, 0);  // Assign the buffer object to the attribute variable
  gl.enableVertexAttribArray(attribute);  // Enable the assignment

  return buffer;
}
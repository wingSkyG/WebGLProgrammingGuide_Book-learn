import vertexSource from "./shader/vertex_shader.vert";
import fragmentSource from "./shader/fragment_shader.frag";
import initShader from "../initShader";

render();

function render() {
  const canvas = document.getElementById("canvas");
  if (!canvas) {
    console.log("Failed to retrieve the <canvas> element");
    return;
  }

  /** @type {WebGLRenderingContext} */
  const gl = canvas.getContext("webgl");
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  if (!initShader(gl, vertexSource, fragmentSource)) {
    console.log("Failed to intialize shaders");
    return;
  }

  let vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);

  let vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return;
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
  
  let u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("Failed to get the storage location of u_ModelMatrix");
    return;
  }

  let u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!u_FragColor) {
    console.log("Failed to get the storage location of u_FragColor");
    return;
  }
  let pointColor = "#38bbdb";
  gl.uniform4f(
    u_FragColor,
    pointColor[0],
    pointColor[1],
    pointColor[2],
    pointColor[3],
  );

  gl.clearColor(0, 0, 0, 1);

  let angle = 0.;
  let modelMatrix = new Matrix4();
  function tick() {
    angle = animateAngle(angle);
    draw(gl, angle, modelMatrix, u_ModelMatrix);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function draw(gl, angle, modelMatrix, u_ModelMatrix) {
  modelMatrix.setRotate(angle, 0., 0., 1.);
  modelMatrix.translate(.35, 0., 0.);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

const ANGLE_STEP = 45.;
let last = Date.now();
function animateAngle(angle) {
  let now = Date.now();
  let elapsed = now - last;
  last = now;
  let newAngle = angle + ANGLE_STEP * elapsed / 1000.;
  console.log(newAngle);
  return newAngle % 360;
}
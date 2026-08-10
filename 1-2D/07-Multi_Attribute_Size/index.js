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

  initShader(gl, vertexSource, fragmentSource);

  let vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  let sizes = new Float32Array([10., 20., 30.]);

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

  let sizeBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
  let a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
  if (a_PointSize < 0) {
    console.log("Failed to get the storage location of a_PointSize");
    return;
  }
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_PointSize);

  let u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (u_FragColor < 0) {
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
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.POINTS, 0, 3);
}

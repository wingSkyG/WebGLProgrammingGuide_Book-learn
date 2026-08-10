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

function draw(gl, vertexCnt) {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 3);
}

function initVertexBuffers(gl) {
  let verticesSizes = new Float32Array([
     0.,  .5, 10.,
    -.5, -.5, 20.,
     .5, -.5, 30.
  ]);
  let vertexCnt = 3;

  let vertexSizeBuffer = gl.createBuffer();
  if (!vertexSizeBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

  let FSIZE = verticesSizes.BYTES_PER_ELEMENT;

  let a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 3 * FSIZE, 0);
  gl.enableVertexAttribArray(a_Position);

  let a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
  if (a_PointSize < 0) {
    console.log("Failed to get the storage location of a_PointSize");
    return;
  }
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 3 * FSIZE, 2 * FSIZE);
  gl.enableVertexAttribArray(a_PointSize);

  let u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (u_FragColor < 0) {
    console.log("Failed to get the storage location of u_FragColor");
    return;
  }
  let pointColor = "#a72987";
  gl.uniform4f(
    u_FragColor,
    pointColor[0],
    pointColor[1],
    pointColor[2],
    pointColor[3],
  );

  return vertexCnt;
}
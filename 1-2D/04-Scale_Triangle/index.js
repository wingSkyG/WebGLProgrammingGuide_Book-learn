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

  let sx = 1., sy = 1.5, sz = 1.;
  let xformMatrix = new Float32Array([
      sx,  0,  0, 0,
       0, sy,  0, 0,
       0,  0, sz, 0,
       0,  0,  0, 1,
  ]);
  let u_xformMatrix = gl.getUniformLocation(gl.program, "u_xformMatrix");
  if (u_xformMatrix < 0) {
    console.log("Failed to get the storage location of u_xformMatrix");
    return;
  }
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

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

  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

/**
 * @param {string} canvasId
 * @returns {WebGLRenderingContext}
 */
export function initWebGL(canvasId) {
  if (!canvasId) {
    console.error("未传入canvasId参数");
    return;
  }

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.log("Failed to retrieve the <canvas> element");
    return;
  }

  const gl = canvas.getContext("webgl");
  if (!gl) {
    return null;
  }
  return gl;
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {string} vertexSource
 * @param {string} fragmentSource
 * @returns {boolean}
 */
export function initShader(gl, vertexSource, fragmentSource) {
  if (!gl) {
    console.log("未传入gl参数");
    return false;
  }
  if (!vertexSource) {
    console.log("未传入vertexSource参数");
    return false;
  }
  if (!fragmentSource) {
    console.log("未传入fragmentSource参数");
    return false;
  }

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexSource);
  gl.shaderSource(fragmentShader, fragmentSource);

  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    let err = gl.getShaderInfoLog(vertexShader);
    alert(err);
    return;
  }
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    let err = gl.getShaderInfoLog(fragmentShader);
    alert(err);
    return;
  }

  const program = gl.createProgram();
  if (!program) {
    console.log("Failed to create program");
    return false;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    let err = gl.getProgramInfoLog(program);
    alert(err);
    return;
  }
  gl.useProgram(program);
  
  gl.program = program;

  return true;
}

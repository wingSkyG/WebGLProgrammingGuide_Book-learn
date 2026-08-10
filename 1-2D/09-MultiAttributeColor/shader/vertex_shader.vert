attribute vec4 a_Position;
attribute vec4 a_Color;
varying vec4 v_Color;

void main() {
    gl_Position = a_Position;
    gl_PointSize = 10.0; // 此行忽略，会看不到渲染出的点
    v_Color = a_Color;
}

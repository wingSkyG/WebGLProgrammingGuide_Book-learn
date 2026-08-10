attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;
uniform mat4 u_MvpMatrix;
uniform mat4 u_NormalMatrix;

uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;
uniform vec3 u_AmbientLight;

varying vec4 v_Color;

void main() {
    gl_Position = u_MvpMatrix * a_Position;
    vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);

    float nDotL = max(dot(u_LightDirection, normal), 0.);
    vec3 diffuse = a_Color.rgb * u_LightColor * nDotL;
    vec3 ambient = u_AmbientLight * a_Color.rgb;
    vec3 finalColor = diffuse + ambient;

    v_Color = vec4(finalColor, a_Color.a);
}

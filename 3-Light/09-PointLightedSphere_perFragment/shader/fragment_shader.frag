precision mediump float;

uniform vec3 u_LightPosition;
uniform vec3 u_LightColor;
uniform vec3 u_AmbientLight;

varying vec3 v_Position;
varying vec3 v_Normal;
varying vec4 v_Color;

void main() {
    vec3 normal = normalize(v_Normal); // Normalize the normal because it is interpolated and not 1.0 in length any more
    vec3 lightDirection = normalize(u_LightPosition - v_Position);
    float nDotL = max(dot(lightDirection, normal), 0.);
    vec3 diffuse = v_Color.rgb * u_LightColor * nDotL;
    vec3 ambient = v_Color.rgb * u_AmbientLight;
    vec3 finalColor = diffuse + ambient;

    gl_FragColor = vec4(finalColor, v_Color.a);
}
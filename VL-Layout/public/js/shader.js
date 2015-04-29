﻿<script type="application/x-glsl" id="sky-vertex">
varying vec2 vUV;

void main() {
vUV = uv;
vec4 pos = vec4(position, 1.0);
gl_Position = projectionMatrix * modelViewMatrix * pos;
}
</script>

<script type="application/x-glsl" id="sky-fragment">
uniform sampler2D texture;
varying vec2 vUV;

void main() {
vec4 sample = texture2D(texture, vUV);
gl_FragColor = vec4(sample.xyz, sample.w);
}
</script>
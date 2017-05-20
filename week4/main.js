let canvas = document.getElementById('canvas');

let vShader = `#version 300 es

in vec3 vertex;

void main() {
    gl_Position = vec4(vertex, 1.0);
}
`;

let fShader = `#version 300 es

precision highp float;

uniform float iGlobalTime;
uniform vec2 iResolution;
out vec4 color;

void main() {
    vec2 p = (2.0*gl_FragCoord.xy-iResolution.xy)/min(iResolution.y,iResolution.x);
 
    p.y -= 0.25;
    
    // animate
    float tt = mod(iGlobalTime,1.5)/1.5;
    float ss = pow(tt,.2)*0.5 + 0.5;  
    ss = 1.0 + ss*0.5*sin(tt*6.2831*3.0+p.y*0.5)*exp(-tt*4.0);
    p *= vec2(0.5,1.5) + ss*vec2(0.5,-0.5);
    
    // shape
    float a = atan(p.x,p.y)/3.141593;
    float r = length(p);
    float h = abs(a);
    float d = (13.0*h - 22.0*h*h + 10.0*h*h*h)/(6.0-5.0*h);
 
    // background color
    vec3 bcol = vec3(1.0,0.8,0.7)*(1.0-0.25*r);
 
    // color
    float s = 0.75 + 0.75*p.x;
    s *= 1.0-0.25*r;
    s = 0.5 + 0.6*s;
    s *= 0.5+0.5*pow( 1.0-clamp(r/d, 0.0, 1.0 ), 0.1 );
    vec3 hcol = vec3(1.0,0.5*r,0.3)*s;
 
    color = vec4(mix( bcol, hcol, smoothstep( -0.01, 0.01, d-r) ),1.0);
}
`;

WebglHelper.initWebgl(canvas);
let shader = new ShaderProgram(vShader,fShader);
let timeStart = new Date();
shader.uniforms.iResolution = ['v2',[512,512]];
function tick(){
    requestAnimationFrame(tick);
    shader.uniforms.iGlobalTime = ['float',(new Date() - timeStart)*0.001];
    shader.render();
}

tick();
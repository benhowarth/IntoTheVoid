#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

//uniform int pointerCount;
//uniform vec3 pointers[10];
uniform vec2 resolution;
uniform float time;
uniform float bgOffset;


float random(vec2 _st){
  return fract(sin(dot(_st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    vec2 u=vec2(0.0);
    // Cubic Hermine Curve.  Same as SmoothStep()
    u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);


    //Quintic interpolation curve
    u = f*f*f*(f*(f*6.-15.)+10.);


    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


vec3 noiseColor(vec2 st,float time,float parallax,
  float noiseFreq1,float noiseFreq2,float stepMin,float stepMax){
  vec3 colorRes=vec3(0);

  st.y=st.y+time*parallax;
  st.x=st.x;

  vec2 pos=floor(st*noiseFreq1);
  vec2 pos2=floor(st*noiseFreq2);
  float n1=noise(pos);
  float n2=noise(pos2);
  vec3 color1=mix(vec3(n1),vec3(n2),0.5);
  colorRes=smoothstep(stepMin,stepMax,color1);

  return colorRes;
}


vec3 getColorAtTime(vec2 st,float val){
  vec3 col=vec3(1);
  float rand=random(st);
  float r=1.0;
  //float r=sin(st.y*time)*255.0;
  //float g=mod((st.y/rand)*time*0.5*val,255.0);
  //float b=mod(time+rand,255.0);
  float g=1.0;
  float b=1.0;

  col=vec3(r,g,b);
  return col;
}
void main(void) {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  //first layer
  vec2 st=uv;
  st.y+=bgOffset;

  //init color
  vec3 color=vec3(0.0);


  vec3 color1=noiseColor(st,time,0.05,100.0,200.0,0.88,1.0);
  color1=color1*getColorAtTime(st,20.0);
  vec3 color2=noiseColor(st,time,0.1,50.0,80.0,0.92,1.0);
  color2=color2*getColorAtTime(st,20.0);
  vec3 color3=noiseColor(st,time,0.2,30.0,60.0,0.95,1.0);
  color3=color3*getColorAtTime(st,20.0);
/*
    vec3 color1=noiseColor(st,time,0.05,200.0,500.0,0.88,1.0);
    color1=color1*getColorAtTime(st,20.0);
    vec3 color2=noiseColor(st,time,0.1,200.0,300.0,0.92,1.0);
    color2=color2*getColorAtTime(st,20.0);
    vec3 color3=noiseColor(st,time,0.2,200.0,100.0,0.95,1.0);
    color3=color3*getColorAtTime(st,20.0);
*/


  color=color1+color2+color3;


  gl_FragColor = vec4(color*0.3, 1.0);
}

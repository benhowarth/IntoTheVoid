// in this example we will send a value from our p5 sketch to the shader
// these values are called "uniform" variables
// we will use p5's setUniform function to make this happen
// https://p5js.org/reference/#/p5.Shader/setUniform

// a shader variable
let uniformsShader;


let bgDrawer;
function preload(){
  // load the shader
  uniformsShader = loadShader('uniform.vert', 'uniform.frag');
  starShader=loadShader("img/starShader.vert","img/starShader.frag")
  defaultShader=loadShader("img/defaultShader.vert","img/defaultShader.frag")

}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  bgDrawer=createGraphics(windowWidth,windowHeight,WEBGL)
  noStroke();
}

function draw() {
  // shader() sets the active shader with our shader
  bgDrawer.shader(starShader);

  // lets send the mouse values to the shader as a vec2
  // first we will map them so that they go from 0 - 1
  let mx = map(mouseX, 0, width, 0, 1);
  let my = map(mouseY, 0, height, 0, 1);

  // next we will use setUniform() to send them to the shader
  // set uniform is smart enough to figure out what kind of variable we are sending it
  // the first parameter is the name of the variable in the shader
  // the second parameters are the data that we want to send

  // to send a single int, float, or bool it looks like
  // shader.setUniform('myFloat', 0.5);
  // shader.setUniform('myInt', 1);
  // shader.setUniform('myBool', true);

  // vec2, vec3, and vec4 use arrays
  // shader.setUniform('myVec2, [val1, val2]);
  // shader.setUniform('myVec3, [val1, val2, val3]);
  // shader.setUniform('myVec4, [val1, val2, val4]);

  // you can also send whole images to shaders
  // these are known as textures
  // check 3-2 for more



  starShader.setUniform("speedUniform",[mx,my])
  starShader.setUniform("resolution",[windowWidth,windowHeight])
  starShader.setUniform("time",frameCount*0.01)
  bgDrawer.background(0)
  // rect gives us some geometry on the screen
  bgDrawer.rect(0,0,width, height);

  //fill(255,255,255)
  texture(bgDrawer)
  rect(-width/2,-height/2,width,height)
  fill(0,0,255);
  rect(100,100,1000,1000);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

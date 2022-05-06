const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con, fruit_con2, fruit_con3;
var rope2, rope3;

var bg_img;
var food;
var rabbit;
var botton;

var bunny;
var piscando;
var comendo;
var triste;

var backSound;
var cutSound;
var sadSound;
var eatSound;
var ar;

var balao;
var mute;
var botao, botao1;
var canW, canH;

function preload(){
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');;
  piscando = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  comendo = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  triste = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");
  backSound = loadSound("sound1.mp3");
  cutSound = loadSound("rope_cut.mp3");
  eatSound = loadSound("eating_sound.mp3");
  sadSound = loadSound("sad.wav");
  ar = loadSound("air.wav");

  piscando.playing = true;
  comendo.playing = true;
  comendo.looping = false;
  triste.playing = true;
  triste.looping = false;
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(displayWidth+80,displayHeight);    
  } else {
    canW = windowWidth;
    canH = windowHeight;
    createCanvas(windowWidth,windowHeight);
  }
  frameRate(80);
  backSound.play();
  backSound.setVolume(0.1);

  engine = Engine.create();
  world = engine.world;
  
  botton = createImg("cut_btn.png");
  botton.position(20, 30);
  botton.size(50, 50);
  botton.mouseClicked(drop);

  botao = createImg("cut_btn.png");
  botao.position(330, 35);
  botao.size(60, 60);
  botao.mouseClicked(drop2);

  botao1 = createImg("cut_btn.png");
  botao1.position(360, 200);
  botao1.size(60, 60);
  botao1.mouseClicked(drop3);


  //balao = createImg("balloon.png");
  //balao.position(10, 250);
  //balao.size(150, 100);
  //balao.mouseClicked(airblow);

  mute = createImg("mute.png");
  mute.position(430, 20);
  mute.size(50, 50);
  mute.mouseClicked(muteSound);
  
  rope = new Rope(8,{x:40,y:30});
  rope2 = new Rope(7,{x:370, y:40});
  rope3 = new Rope(7,{x:400, y:225});
  ground = new Ground(200,canH,600,20);

  piscando.frameDelay = 18;
  comendo.frameDelay = 18;
  triste.frameDelay = 18;

  bunny = createSprite(170,canH-80,100,100);
  bunny.addImage(rabbit);
  bunny.scale = 0.2
  bunny.addAnimation("piscando", piscando);
  bunny.addAnimation("comendo", comendo);
  bunny.addAnimation("chorando", triste);
  bunny.changeAnimation("piscando")

  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con2 = new Link(rope2,fruit);
  fruit_con3 = new Link(rope3,fruit);
  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  
}

function draw() 
{
  background(51);
  image(bg_img, 0, 0, displayWidth+1880, displayHeight+880)

  if (fruit!= null) {
  image(food,fruit.position.x,fruit.position.y,70,70);
  }

  rope.show();
  rope2.show();
  rope3.show();
  Engine.update(engine);
  ground.show();

  if (collide(fruit, bunny)==true) {
    bunny.changeAnimation("comendo");
    eatSound.play();
  }
  if (fruit!=null&&fruit.position.y>=650) {
    bunny.changeAnimation("chorando");
    backSound.stop();
    sadSound.play();
    fruit=null;
  }
   drawSprites();
}

function drop() {
  cutSound.play();
  rope.break();
  fruit_con.dettach();
  fruit_con = null; 
}

function drop2() {
  cutSound.play();
  rope2.break();
  fruit_con2.dettach();
  fruit_con2 = null; 
}

function drop3() {
  cutSound.play();
  rope3.break();
  fruit_con3.dettach();
  fruit_con3 = null; 
}

function collide(body, sprite) {
  if (body!= null) {
    var distancia = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (distancia<=80) {
      World.remove(engine.world, fruit);
      fruit = null;
      return true;
    } else {
      return false;
    }
  }
    


}

function airblow() {
  Matter.Body.applyForce(fruit, {x:0, y:0}, {x:0.01, y:0});
  ar.play();
  ar.setVolume(0.5);
}

function muteSound() {
  if (backSound.isPlaying()) {
    backSound.stop();
  } else {
    backSound.play();
  }
}
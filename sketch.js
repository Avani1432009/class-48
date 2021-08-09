var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var zombieGroup;

var bullet;

var gameState = "fight";
var bullets = 70;

var life = 3;
var score = 0;

var winSound;
var loseSound;
var shootSound;

var zombiehandImg,graveStoneImg;

function preload(){
  
  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  zombieImg = loadImage("assets/zombie.png")

  bgImg = loadImage("assets/bg.jpeg");

  winSound = loadSound("assets/win.mp3");
  loseSound = loadSound("assets/lose.mp3");
  shootSound = loadSound("assets/explosion.mp3");

  zombiehandImg = loadImage("assets/zombieHand.png");
  graveStoneImg = loadImage("assets/graveStone.png");

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = false;
   player.setCollider("rectangle",0,0,300,300)


   //creating sprites to depict lives remaining
   heart1 = createSprite(displayWidth-150,40,20,20)
   heart1.visible = false
    heart1.addImage("heart1",heart1Img)
    heart1.scale = 0.4

    heart2 = createSprite(displayWidth-100,40,20,20)
    heart2.visible = false
    heart2.addImage("heart2",heart2Img)
    heart2.scale = 0.4

    heart3 = createSprite(displayWidth-150,40,20,20)
    heart3.addImage("heart3",heart3Img)
    heart3.scale = 0.4;
   

    //creating group for zombies    
    zombieGroup = new Group();
    bulletGroup = new Group();
}

function draw() {
  background(0); 

  if(gameState === "fight"){
    if(life === 3){
      heart3.visible = true;
      heart2.visible = false;
      heart1.visible = false;
    }

    if(life === 2){
      heart3.visible = false;
      heart2.visible = true;
      heart1.visible = false;
    }

    if(life === 1){
      heart3.visible = false;
      heart2.visible = false;
      heart1.visible = true;
    }

    if(life === 0){
      heart3.visible = false;
      heart2.visible = false;
      heart1.visible = false;
      gameState = "lost";
      loseSound.play();
    }

    if(score === 100){
      gameState = "Win";
      winSound.play();

    }

    //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}
if(keyDown("LEFT_ARROW")||touches.length>0){
  player.x = player.x -30
 }
 if(keyDown("RIGHT_ARROW")||touches.length>0){
  player.x = player.x +30
 }

//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
  player.addImage(shooter_shooting);
  bullet = createSprite(player.x,player.y-20,20,10);
  bullet.velocityX = 10;
  bulletGroup.add(bullet);
  bullets = bullets -1;
  shootSound.play();
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}

if(bullets === 0){
  gameState ="bullet";
}

//destroy zombie when player touches it
if(player.isTouching(zombieGroup)){
 

 for(var i=0;i<zombieGroup.length;i++){     
      
  if(player.isTouching(zombieGroup[i])){
       zombieGroup[i].destroy()
       life = life -1;
  }
       } 
 }

 if(zombieGroup.isTouching(bulletGroup)){
    for(var i=0;i<zombieGroup.length;i++){

        if(zombieGroup[i].isTouching(bulletGroup)){
            bulletGroup.destroyEach();
            score = score + 5;
            zombieGroup[i].addImage(zombiehandImg);
            zombieGroup[i].velocityX = 0;
            zombieGroup[i].scale = 0.5;
            zombieGroup[i].lifetime = 10;
        }
    }
 }




//calling the function to spawn zombies
enemy();
  }
drawSprites();

  textSize(30);
  fill("yellow");
  text("Score: "+score,displayWidth - 200,displayHeight/2 - 270);
  text("Lives: "+life,displayWidth - 200,displayHeight/2 - 230);
  text("Bullets: "+bullets ,displayWidth - 200,displayHeight/2 - 200);

if(gameState === "lost"){
  textSize(100);
   stroke("black");
   fill("green");
   text("You lost!!",400,400);
   zombieGroup.destroyEach();
   player.addImage(graveStoneImg);
   player.scale = 1;
 }

 else if(gameState === "Win"){
  textSize(100);
   stroke("black");
   fill("green");
   text("Congratulations!! You Win!!",400,400);
   zombieGroup.destroyEach();
   player.destroy();
 }

 else if(gameState === "bullet"){
   textSize(50);
   stroke("black");
   fill("yellow");
   text("You ran out of Bullets!!",400,400);
   zombieGroup.destroyEach();
   player.destroy();
   bulletGroup.destroyEach();
   loseSound.play();
 }


}



//creating function to spawn zombies
function enemy(){
  if(frameCount%50===0){

    //giving random x and y positions for zombie to appear
    zombie = createSprite(random(500,1100),random(100,500),40,40)

    zombie.addImage(zombieImg)
    zombie.scale = 0.15
    zombie.velocityX = -3
    zombie.debug= false;
    zombie.setCollider("rectangle",0,0,400,400)
   
    zombie.lifetime = 400
   zombieGroup.add(zombie)
  }

}

"use strict";
//canvas definition
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// canvas width and height 
cvs.width = 288; 
cvs.height = 512; 

//background object
var bg = new Image();
bg.src = "images/bg2.png";

//platform object
var fg = new Image();
fg.src = "images/fg.png";

//bird object
var bird = new Image();
bird.src = "images/bb.png";

//pipes objects
var pipeNorth = new Image();
pipeNorth.src = "images/pipeNorth.png";
var pipeSouth = new Image();
pipeSouth.src = "images/pipeSouth.png";

//gap beetween pipe north from pipe south
var gap = 100;
//distance to draw pipe south
var constant;

//platform x coords
var fg_x = 0;
var bg_x = 0;

//platform speed
var scrollSpeed = 1; 

//Bird coords positions (x, y)
var birdX = 48;
var birdY = 150;

//bird costume x coord (0, 38) for draw
var bird_costume = 0;

//interval before change costume
var bird_interval = 0;

//bird move y (gravity, jump)
var bird_jump_y = 4;

//convert radians
var TO_RADIANS = Math.PI/180;

//angle to convert for bird
var angle = 0;

//variable to start game
var start = 0;
//variable for die game
var die_val = 0;
var stop_fly = false;

//check key pressed
var key = true;

//array pipe 
var pipe = [];

pipe[0] = {
    x : cvs.width,
    y : 0
};

var fly = new Audio();
var scor = new Audio();
var dieBird = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";
dieBird.src = "sounds/die.mp3";

var score = 0;

var alpha = 1.0;

var messageStart = new Image();
messageStart.src = "images/message.png";

var gameOver = new Image();
gameOver.src = "images/gameover.png";

document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 32) {
        if(key) moveUp();
        key = false;
    }
});
  
document.addEventListener('keyup', function (evt) {
    if (evt.keyCode === 32) {
      key = true;
    }
});      

document.addEventListener("touchstart", function (evt) {
        moveUp();
        key = false;
});

document.addEventListener("touchend", function (evt) {
      key = true;
});      

//   bird.addEventListener('click', function (evt) {
//     alert();
//   });     


//function when user click, move up bird
function moveUp(){

    if(!stop_fly){
        fly.play();

        //if key is not pressed 
        if(key == true){
            //limit for value jump
            if(bird_jump_y > -2)
                //value  = value - 6 
                bird_jump_y -= 6;
            //bird angle
            angle = -20;
            //start game, if start = 1 start pipes
            if(start == 0) start = 1;
        }
    }else{
        restart();
    }
}

function mousemove(ev) {   
    //console.log(ev.layerX); 
    //console.log(ev.layerY); 
}

function drawBackground(die_val){
    if(die_val == 0){
        //draw background
        //ctx.drawImage(bg, 0, 0);
        //fg_x/2 to go slowly to sg
        ctx.drawImage(bg, bg_x/2, 0);
        ctx.drawImage(bg, (bg_x/2) + 552, 0);

        //edit platform x coord
        bg_x -= scrollSpeed; 

        //go back platform at the end
        if (bg_x < -552) 
        bg_x = 0; 
    }
}

function drawPipe(die_val){
    if(die_val == 0 && start == 1){

        //array pipes
        for(var i = 0; i < pipe.length; i++){
            // draw pipe
            constant = pipeNorth.height + gap;

            ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
            ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);
                
            //edit x coord to move pipe
            pipe[i].x -= scrollSpeed;
            
            //if user cannot see pipe, delete it
            if(pipe[i].x < -252)
            pipe.shift();

            //after 130 pixel generate new random pipe
            if( pipe[i].x == 130 ){
                pipe.push({
                    x : cvs.width,
                    y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height
                }); 
            }

            //detect collision
            if( birdX + (bird.width/4) >= pipe[i].x && 
                birdX <= pipe[i].x + pipeNorth.width && 
                (birdY <= pipe[i].y + pipeNorth.height || 
                birdY + (bird.height/2) >= pipe[i].y+constant) || 
                birdY + (bird.height/2) >=  cvs.height - fg.height){
                //location.reload(); // reload the page
                if(!stop_fly)
                dieBird.play();

                stop_fly = true;
            }
            
            if(pipe[i].x == 5){
                score++;
                scor.play();
            }

        }
    }
}

function drawBird(die_val){
    if(die_val == 0){

        //if user press space once
        if(start == 1 || stop_fly){
            //gravity
            bird_jump_y += 0.2;
            birdY += bird_jump_y;
        }

        //limit for edit bird angle
        if(angle >= -40 && angle < 90 && start == 1){
            //edit bird angle
            angle+=1.5;
        }

        //rotate bird object
        ctx.save(); 
        ctx.translate(birdX, birdY); 
        ctx.rotate( angle * TO_RADIANS );
        ctx.drawImage(bird, bird_costume, 0, 38, 28, -(bird.width/4), -(bird.height/2), 38, 28);
        ctx.restore(); 

        //count interval for bird costume
        bird_interval++;

        //set bird_costume
        if(bird_costume == 0 && bird_interval == 10){
            bird_costume = 38;
            bird_interval = 0;
        }else if(bird_costume == 38 && bird_interval == 10){
            bird_costume = 0;
            bird_interval = 0;
        }
    }
}

function drawPlatform(die_val){
        //drow platform
        ctx.drawImage(fg, fg_x, 398);
        ctx.drawImage(fg, fg_x + cvs.width, 398);
        
    if(die_val == 0){

        //edit platform x coord
        fg_x -= scrollSpeed; 

        //go back platform at the end
        if (fg_x < -cvs.width) 
        fg_x = 0; 
    }
}

function draw(){

    //if(die_val == 0){
            
        drawBackground(die_val);

        ctx.fillStyle = "#fff";
        ctx.font = "100px Arial Black";
        ctx.fillText(score, 100, 100);

        drawPipe(die_val);
        drawBird(die_val);
        drawPlatform(die_val);


        if(alpha > 0){
            ctx.globalAlpha = alpha;
            ctx.drawImage(messageStart, 50, 100);
            ctx.globalAlpha = 1.0;  
            alpha -= 0.01;
        }

        if(die_val == 1){
            ctx.drawImage(gameOver, 50, 200);
        }
        
        //if bird collide platform (410 is +- y platform)
        if(birdY + 28 > 410){
            die();
        }
    //}

    requestAnimationFrame(draw);
}

function die(){
    // start = 0;
    // birdX = 48;
    // birdY = 150;
    // angle = 0;
    // bird_jump_y = 4;
    //pipe = [];
    die_val = 1;
    
    if(!stop_fly){
        dieBird.play();
        stop_fly = true;
    }

    //window.setInterval(restart, 5000);
}

function restart(){
    //platform x coords
    fg_x = 0;
    bg_x = 0;

    //Bird coords positions (x, y)
    birdX = 48;
    birdY = 150;

    //bird costume x coord (0, 38) for draw
    bird_costume = 0;

    //interval before change costume
    bird_interval = 0;

    //bird move y (gravity, jump)
    bird_jump_y = 4;

    //angle to convert for bird
    angle = 0;

    //variable to start game
    start = 0;
    //variable for die game
    die_val = 0;
    stop_fly = false;

    //check key pressed
    key = true;

    //array pipe 
    pipe = [];

    pipe[0] = {
        x : cvs.width,
        y : 0
    };

    score = 0;

    alpha = 1.0;
}

//localStorage.setItem("nome", "gigi");

draw();
//create the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//pictures
var ship1 = new Image();
ship1.src = ("./images/ship.png");
var asteroid1 = new Image();
asteroid1.src = ("./images/asteroid.png");
var explosion1 = new Image();
explosion1.src = ("./images/explosion.png");
var laser = new Image();
laser.src = ("./images/laser.png");
//variables
var player = new createObject(0, 0, 50, 50);
var asteroid = [];
var lasers = [];
var asterPos = 0;
var laspos = 0;
var start = false;
var score = 0;
var ga = 0.5;
var explosion = new createObject(undefined, undefined, 75, 75);
var fired = false;
//fps
var fps = 60;
var interval = 1000/fps; // milliseconds
var step = interval/1000 // seconds

//controls
var left = false;
var right = false;
var up = false;
var down = false;
var fire = false;
var ga = 0.5;
var timer = 0;

var end = false;
var score = 0;
var lives = 3;

//audio
var backgroundmusic = new Audio();
var backgroundmusic = new Audio("./audio/backgroundmusic.mp3");
backgroundmusic.volume = 0.1;
backgroundmusic.play();
var lasersound = new Audio();
var lasersound = new Audio("./audio/laser.mp3");  
lasersound.volume = 0.04;
var explosionSoundShip = new Audio();
var explosionSoundShip = new Audio("./audio/ship_explosion.mp3");  
explosionSoundShip.volume = 0.2;
var explosionSoundAsteroid = new Audio();
var explosionSoundAsteroid = new Audio("./audio/asteroid_explosion.mp3");  
explosionSoundAsteroid.volume = 0.15;

//resize canvas to fullscreen
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
			main();
    }
    resizeCanvas();
	
var particles = {},
    particleIndex = 0,
    settings = {
      density: 15,
      particleSize: 4,
      gravity: 0,
      maxLife: 50
    };
	
function Particle(dx, dy) {
  // Establish starting positions and velocities
  this.x = dx+15;
  this.y = dy+15;

  // Random X and Y velocities
  this.vx = Math.random() * 20 - 30;
  this.vy = Math.random() * 2.5 - 1;

  // Add new particle to the index
  particleIndex ++;
  particles[particleIndex] = this;
  this.id = particleIndex;
  this.life = 0;
}

Particle.prototype.draw = function() {
  this.x += this.vx;
  this.y += this.vy;

  // Adjust for gravity
  this.vy += settings.gravity;

  // Age the particle
  this.life++;

  // If Particle is old, remove it
  if (this.life >= settings.maxLife) {
    delete particles[this.id];
  }
  
  settings.particleSize = Math.random() * 15 + 2

  // Create the shapes
  ctx.clearRect(settings.leftWall, settings.groundLevel, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.strokeRect(this.x, this.y, settings.particleSize, settings.particleSize); 
  ctx.closePath(); 

    var gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 150);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1, 'orange');
	ctx.lineWidth = 3;
	ctx.lineCap = 'square'
    ctx.strokeStyle = gradient;
    ctx.fill();
}
function renderParticles(x,y)
{
	// Draw the particles
        for (var i = 0; i < settings.density; i++) {
          if (Math.random() > 0.97) {
            // Introducing a random chance of creating a particle
            // corresponding to an chance of 1 per second,
            // per "density" value
            new Particle(x,y);
          }
        }
}


function main()
{
	ctx.globalAlpha=1;
	if  (start == false)
	{
		startScreen();
	}
	else if(end == true)
	{
		endScreen();
	}
	else
	{
		//clear the canvas
		ctx.clearRect(0,0,canvas.width, canvas.height);
		
		//generating asteroids
		if ((timer%100)==0)
		{
			createAsteroid();
		}
		
	//side scrolling,changed to move at steady pace and delete asteroids offscreen 3/27/18
	for (var x = 0; x < asterPos; x++)
	{
		ctx.drawImage(asteroid1, asteroid[x].Xpos, asteroid[x].Ypos, 50, 65);
		asteroid[x].Xpos -= 7+(player.Xpos/100);
		if (asteroid[x].Xpos < -100)
		{
			asteroid[x].Xpos=Math.floor(canvas.width + Math.random() * canvas.width * 2);
			delete asteroid[x].Xpos;
			delete asteroid[x].Ypos;
			delete asteroid[x].width;
			delete asteroid[x].height;
			ctx.clearRect(asteroid[x].Xpos, asteroid[x].Ypos, 75, 75);
		}
	}
	
	//display score
	ctx.font = "35px Garamond";
	ctx.fillStyle = 'white';
	ctx.fillText("Score: "+score,25,50);
	
	//draw lives
	for(i=0;i<lives;i++)
	{
		var tempX=(25*i)+75;//offsets life images
		ctx.drawImage(ship1,canvas.width-tempX,40, 35, 35);
	}
	
	//collision check
	for(var i = 0; i < asterPos; i++)
	{
		if(player.Xpos < asteroid[i].Xpos + asteroid[i].width &&
		player.Xpos + player.width > asteroid[i].Xpos&&
		player.Ypos < asteroid[i].Ypos + asteroid[i].height &&
		player.height+ player.Ypos > asteroid[i].Ypos)
		{
			//player.Xpos = 0;
			//player.Ypos = 0;
			explosionSoundShip.play();
			lives--;
			asteroid[i].Xpos = -100;
			if (lives==0)
			{
				asteroid = [];
				asterPos = 0;
				end=true;
			}
		}
	}
	
	//laser-asteroid collision check
	for(var i = 0; i < asterPos; i++)
	{
		for(var j = 0; j < laspos; j++)
		{
			if(lasers[j].Xpos < asteroid[i].Xpos + asteroid[i].width &&
			lasers[j].Xpos + lasers[j].width > asteroid[i].Xpos&&
			lasers[j].Ypos < asteroid[i].Ypos + asteroid[i].height &&
			lasers[j].height+ lasers[j].Ypos > asteroid[i].Ypos)
			{
				explosionSoundAsteroid.play();
				explosion = new createObject(asteroid[i].Xpos, asteroid[i].Ypos, 75, 75);//*
				
				//set asteroid[i] position to undefined;	
				asteroid[i].Xpos=Math.floor(canvas.width + Math.random() * canvas.width * 2);
				
				//set lasers[j] position to undefined;	
				lasers[j].Xpos = undefined;
				lasers[j].Ypos = undefined;
				//award points
				score += 10;
			}
		}
	}
	
	//speed should be changed
	if(left && player.Xpos>=0)
	{
		renderParticles(player.Xpos, player.Ypos);
		player.Xpos -= step * 500;
	}
	if(up && player.Ypos>=0)
	{
		renderParticles(player.Xpos, player.Ypos);
		player.Ypos -= step * 500;
	}
	if(right && player.Xpos <= (canvas.width-player.width))
	{
		renderParticles(player.Xpos, player.Ypos);
		player.Xpos += step * 500;
	}
	if(down && player.Ypos <= (canvas.height-player.height))
	{
		renderParticles(player.Xpos, player.Ypos);
		player.Ypos += step * 500;
	}
	if(fire)
	{
		//if(wait a second)
		//{
			lasersound.play();
			renderParticles(player.Xpos, player.Ypos);
			createLaser();
			laspos++;
			fire = false;
		//}
	}
		for (var x = 0; x < laspos; x++)
		{
			ctx.drawImage(laser, lasers[x].Xpos, lasers[x].Ypos, 50, 50);
			if (isFinite(lasers[x].Xpos) && isFinite(lasers[x].Ypos))
			{
				renderParticles(lasers[x].Xpos,lasers[x].Ypos);
			}
			lasers[x].Xpos += step * 1500;
			//delete lasers past a certain point
			if (lasers[x].Xpos > player.Xpos + canvas.width || lasers[x].Xpos < -1)
			{
				delete lasers[x].Xpos;
				delete lasers[x].Ypos;
				delete lasers[x].width;
				delete lasers[x].height;
				ctx.clearRect(lasers[x].Xpos, lasers[x].Ypos, 75, 75);
			}
		}

	
	//			  player object starting x and y coord size of ship 
	ctx.drawImage(ship1,player.Xpos,player.Ypos, 50, 50);
	}
	
	//draw current explosion
	ctx.globalAlpha=ga;
	if (ga > 0)//fades out the explosion
	{
		ga = ga-0.01;
	}
	if (ga<=0)
	{
		ga=1;
		explosion.Xpos=undefined;
		explosion.Ypos=undefined;
		
	}
	
	ctx.drawImage(explosion1, explosion.Xpos, explosion.Ypos, 75, 75);
	ctx.globalAlpha=1;
	
	for (var i in particles) {
          particles[i].draw();
        }
timer++;
}
//time to update frames
//needs to be changed
setInterval(main, interval);

//use this for creating objects
function createObject(x, y, w, h)
{
	this.Xpos = x;
	this.Ypos = y;
	this.width = w;
	this.height = h;
}

function createAsteroid()
{
	//var amt = Math.floor(5 + Math.random() * 15);
	var amt = 1;
	for (var x = 0; x < amt; x++)
	{
		var rndX = Math.floor(canvas.width + Math.random() * canvas.width * 2);
		var rndY = Math.floor(Math.random() * canvas.height);
		asteroid[asterPos] = new createObject(rndX, rndY, 75, 75);
		asterPos++;
	}
}

function createLaser()
{
	lasers[laspos] = new createObject(player.Xpos, player.Ypos, 50, 50);
}// end fire

	//controls
	window.addEventListener("keydown", function(e){
		switch(e.keyCode)
		{
			case 13://start
				start = true;
				end = false;
				score = 0;
				lives = 3;
				timer = 0;
				break;
			case 32://fire
			if (!fired)
			{
				fire = true;
				fired = true;
			}
				break;
			case 37: // left arrow
				left = true;
				break;
			case 38: // up arrow
				up = true;
				break;
			case 39: // right arrow
				right = true;
				break;
			case 40: // down arrow
				down = true;
				break;
		}
	}, false);

	window.addEventListener("keyup", function(e){
		switch(e.keyCode)
		{
			case 32: //space
				fire  = false;
				fired = false;
				break;
			case 37: // left arrow
				left = false;
				break;
			case 38: // up arrow
				up = false;
				break;
			case 39: // right arrow
				right = false;
				break;
			case 40: // down arrow
				down = false;
				break;
		}
	}, false);

	
var hue = 255; // the red component of rgb
var direction = 1;// are we moving toward red or black? 
function startScreen()
{
	//make instructions flash
	hue += direction;
        if (hue >= 255) direction = -2;
        if (hue <= 85) direction = 2;
		
	// create a css color from the `hue`
	var color = 'rgb(' + hue + ',0,0)';
	
	//find the center of the canvas
	var x =window.innerWidth / 2.65;
	var y = window.innerHeight / 2;
	
	//clear the canvas
	timer+=1;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	//Write the game title
	ctx.font = "50px Garamond";
	ctx.fillStyle = 'red';
	ctx.fillText("Asteroids Side Scroller",x,y);
	
	//Write start instructions
	ctx.font = "25px Garamond";
	ctx.fillStyle = color;
	ctx.fillText("Press Enter to begin",x,y+50);
}
	
function endScreen()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.font = "50px Garamond";
	ctx.fillStyle = 'red';
	ctx.fillText("MISSION FAILED, you ran out of lives!",(canvas.width/2)-150,canvas.height/2);
	
	ctx.font = "25px Garamond";
	ctx.fillStyle = 'red';
	ctx.fillText("Press Enter to play again",(canvas.width/2)-150,(canvas.height/2)+50);	
}
	

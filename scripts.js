//variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var player = new createObject("ship.png", 0, 0, 50, 50);
var asteroid = [];
var lasers = [];
var asterPos = 0;
var laspos = 0;
var start = true;
var score = 0;
var old = new Date();
var o = old.setSeconds(5);
var explosion = new createObject("explosion.png", undefined, undefined, 75, 75);

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
      particleSize: 7,
      gravity: 0,
      maxLife: 100
    };
	
function Particle(dx, dy) {
  // Establish starting positions and velocities
  this.x = dx+15;
  this.y = dy+15;

  // Random X and Y velocities
  this.vx = Math.random() * 20 - 40;
  this.vy = Math.random() * 20- 5;

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

  // Create the shapes
  ctx.clearRect(settings.leftWall, settings.groundLevel, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.fillStyle="white";
  ctx.fillRect(this.x, this.y, settings.particleSize, settings.particleSize); 
  ctx.closePath(); 
  ctx.fill();
}
function renderParticles()
{
	// Draw the particles
        for (var i = 0; i < settings.density; i++) {
          if (Math.random() > 0.97) {
            // Introducing a random chance of creating a particle
            // corresponding to an chance of 1 per second,
            // per "density" value
            new Particle(player.Xpos, player.Ypos);
          }
        }
}

function preShake() {
  ctx.save();
  var dx = Math.random()*10;
  var dy = Math.random()*10;
  ctx.translate(dx, dy);  
}

function postShake() {
  ctx.restore();
}

	
	
function main()
{
	ctx.globalAlpha=1;
	if  (start == true)
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
		ctx.drawImage(asteroid[x].Sprite, asteroid[x].Xpos, asteroid[x].Ypos, 50, 65);
		asteroid[x].Xpos -= 3+(player.Xpos/300);
		if (asteroid[x].Xpos < -100)
		{
			asteroid[x].Xpos=Math.floor(canvas.width + Math.random() * canvas.width * 2);
			//delete asteroid[x].Xpos;
			//delete asteroid[x].Ypos;
			//delete asteroid[x].width;
			//delete asteroid[x].height;
			//ctx.clearRect(asteroid[x].Xpos, asteroid[x].Ypos, 75, 75);
		}
	}
	//display score
	ctx.font = "35px Garamond";
	ctx.fillStyle = 'white';
	ctx.fillText("Score: "+score,25,50);
	
	//timer
	ctx.font = "35px Garamond";
	ctx.fillStyle = 'white';
	ctx.fillText(Math.floor(timer/100),500,50);
	
	//draw lives
	for(i=0;i<lives;i++)
	{
		var tempX=(25*i)+75;//offsets life images
	ctx.drawImage(player.Sprite,canvas.width-tempX,40, 35, 35);
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
			lives--;
			asteroid[i].Xpos = -10;
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
				
				explosion = new createObject("explosion.png", asteroid[i].Xpos, asteroid[i].Ypos, 75, 75);//*
				
				//set asteroid[i] position to undefined;	
				asteroid[i].Xpos=Math.floor(canvas.width + Math.random() * canvas.width * 2);
				
				
				//set lasers[j] position to undefined;	
				lasers[j].Xpos = undefined;
				lasers[j].Ypos = undefined;
				//award points
				score += 100;
			}
		}
	}
	
	//speed should be changed
	if(left && player.Xpos>=0)
	{
		renderParticles();
		player.Xpos -= 10;
	}
	if(up && player.Ypos>=0)
	{
		renderParticles();
		player.Ypos -= 10;
	}
	if(right && player.Xpos <= (canvas.width-player.width))
	{
		renderParticles();
		player.Xpos += 10;
	}
	if(down && player.Ypos <= (canvas.height-player.height))
	{
		renderParticles();
		player.Ypos += 10;
	}
	if(fire)
	{
		postShake();
		createLaser();
		laspos++;
		fire = false;
	}
	for (var x = 0; x < laspos; x++)
		{
			ctx.drawImage(lasers[x].Sprite, lasers[x].Xpos, lasers[x].Ypos, 50, 50);
			lasers[x].Xpos += step * 1500;
		}

	
	//			  player object starting x and y coord size of ship 
	ctx.drawImage(player.Sprite,player.Xpos,player.Ypos, 50, 50);
	}
	for (var i in particles) {
          particles[i].draw();
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
	
	ctx.drawImage(explosion.Sprite, explosion.Xpos, explosion.Ypos, 75, 75);
	ctx.globalAlpha=1;

	timer++;
}
//time to update frames
//needs to be changed
setInterval(main, interval);

//use this for creating objects
function createObject(img, x, y, w, h)
{
	this.Sprite = new Image();
	this.Sprite.src = img;
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
		asteroid[asterPos] = new createObject("asteroid.png", rndX, rndY, 75, 75);
		asterPos++;
	}
}

function createLaser()
{
	lasers[laspos] = new createObject("laser.png", player.Xpos, player.Ypos, 10, 25);
}// end fire



	//controls
	window.addEventListener("keydown", function(e){
		switch(e.keyCode)
		{
			case 13://start
				start = false;
				end = false;
				score = 0;
				lives = 3;
				timer = 0;
				break;
			case 32://fire
				fire  = true;
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
	lives=3;
}

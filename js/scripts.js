//variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var player = new createObject("ship.png", 0, 0, 50, 50);
var asteroid = [];
var lasers = [];
var asterPos = 0;
var laspos = 0;
var start = false;
var explosion = new createObject("explosion.png", undefined, undefined, 75, 75);
var ga=0.5;

//resize canvas to fullscreen
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
			main();
    }
    resizeCanvas();

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

function main()
{
	if  (start == false)
	{
	 startScreen();
	}
	else
	{
	//clear the canvas
	ctx.clearRect(0,0,canvas.width, canvas.height);
	
	//generating asteroids
	var amt = Math.floor(5 + Math.random() * 15);
	
	if(asterPos == 0)
	{
		for(var x = 0; x < amt; x++)
		{
			createAsteroid()
			asterPos++;
		}
	}
	//side scrolling
	for (var x = 0; x < asterPos; x++)
	{
		ctx.drawImage(asteroid[x].Sprite, asteroid[x].Xpos, asteroid[x].Ypos, 75, 75);
		asteroid[x].Xpos += -player.Xpos / 50;
	}
	
	//collision check
	for(var i = 0; i < asterPos; i++)
	{
		if(player.Xpos < asteroid[i].Xpos + asteroid[i].width &&
		player.Xpos + player.width > asteroid[i].Xpos&&
		player.Ypos < asteroid[i].Ypos + asteroid[i].height &&
		player.height+ player.Ypos > asteroid[i].Ypos)
		{
			player.Xpos = 0;
			player.Ypos = 0;
		}
	}
	
	//speed should be changed
	if(left)
		player.Xpos -= 10;
	if(up)
		player.Ypos -= 10;
	if(right)
		player.Xpos += 10;
	if(down)
		player.Ypos += 10;
	if(fire)
	{
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
	var rndX = Math.floor(100 + Math.random() * 500);
	var rndY = Math.floor(100 + Math.random() * 500);
	asteroid[asterPos] = new createObject("asteroid.png", rndX, rndY, 75, 75);
}

function createLaser()
{
	lasers[laspos] = new createObject("laser.png", player.Xpos, player.Ypos, 10, 25);
}// end fire

	//controls
	window.addEventListener("keydown", function(e){
		switch(e.keyCode)
		{
			case 13:
				start = true;
				break;
			case 32:
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

	
function startScreen()
{
	 // the red component of rgb
	 var hue = 255; 
	 // create a css color from the `hue`
	 var color = 'rgb(' + hue + ',0,0)';
	/*make instructions flash
    // are we moving toward red or black?
    var direction = 1; 
		
	hue += direction;
        if (hue > 255) direction = -1;
        if (hue < 0) direction = 1;
	*/
	//find the center of the canvas
	var x = canvas.width / 2;
	var y = canvas.height / 2;
	
	//clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	//Write the game title
	ctx.font = "50px Garamond";
	ctx.fillStyle = 'red';
	ctx.fillText("Asteroids Side Scroller",100,y);
	
	//Write start instructions
	ctx.font = "25px Garamond";
	ctx.fillStyle = color;
	ctx.fillText("Press Enter to begin",170,y+50);
}

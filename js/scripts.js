//variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var player = new createObject("ship.png", 0, 0, 50, 50);
var laser = new createObject("laser.png",player.Xpos, player.Ypos, 50, 50);
var asteroid = [4];
//var laser = [];

for(var x=0; x < 4; x++)
{
	var rnd = Math.floor(100 + Math.random() * 500);
	asteroid[x] = new createObject("asteroid.png", rnd, rnd, 75, 75);
}

//fps
var fps = 30;
var interval = 1000/fps; // milliseconds
var step = interval/1000 // seconds

//controls
var left = false;
var right = false;
var up = false;
var down = false;
var fire = false;
var stopped = false;

//calls main
main();

function main()
{
	//clear the canvas
	ctx.clearRect(0,0,canvas.width, canvas.height);
	
	//side scrolling
	for (var x = 0; x < 4; x++)
	{
		asteroid[x].Xpos += -player.Xpos / 50;
		asteroid[x].Ypos += -player.Ypos/ 50;
	}
	
	//collision check
	for(var i = 0; i < 4; i++)
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
		for(var x=0; x < canvas.width; x++)
		{
			laser.Xpos += 10;
			if (laser.Xpos == 500)
			{
				fire = false;
				laser.Xpos = player.Xpos;
				laser.Ypos = player.Ypos;
			}
		}
		ctx.drawImage(laser.Sprite, laser.Xpos, laser.Ypos, 50, 50);
	}

	
	//			  player object starting x and y coord size of ship 
	ctx.drawImage(player.Sprite,player.Xpos,player.Ypos, 50, 50);
	//asteroids
	for (var x=0; x < 4; x++)
	ctx.drawImage(asteroid[x].Sprite, asteroid[x].Xpos, asteroid[x].Ypos, 75, 75);
}
//time to update frames
//needs to be changed
setInterval(main, 10);

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
//laser
/*function Laser(){
	var laser = new createObject("laser.png", player.Xpos, player.Ypos, 10, 25);
	for (var x = 0; x < canvas.width; x++)
		laser.Xpos += x;
	//this.setBoundAction(DESTROY);
	//this.setAngle(Sprite.getImgAngle());
	//this.setSpeed(10);
}// end fire*/

//controls
	window.addEventListener("keypress", function(e){
		if(e.keyCode == 32)
		{
			fire = true;
		}
	}, false);

	//controls
	window.addEventListener("keydown", function(e){
		switch(e.keyCode)
		{
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
				break
		}
	}, false);

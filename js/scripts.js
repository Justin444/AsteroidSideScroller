//variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var player = new createObject("ship.png", 0, 0);

//controls
var left = false;
var right = false;
var up = false;
var down = false;

//calls main
main();

/*
var fps = 30;
var interval = 1000/fps; // milliseconds
var step = interval/1000 // seconds
*/

function main()
{
	//speed should be changed
	if(left)
		player.Xpos -= 10;
	if(up)
		player.Ypos -= 10;
	if(right)
		player.Xpos += 10;
	if(down)
		player.Ypos += 10;
	
	//clear the canvas
	ctx.clearRect(0,0,canvas.width, canvas.height);
	//			  player object starting x and y coord size of ship 
	ctx.drawImage(player.Sprite,player.Xpos,player.Ypos, 50, 50);
}
//time to update frames
//needs to be changed
setInterval(main, 10);

//use this for creating objects
function createObject(img, x, y)
{
	this.Sprite = new Image();
	this.Sprite.src = img;
	this.Xpos = x;
	this.Ypos = y;
}

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
				break;	
		}
	}, false);

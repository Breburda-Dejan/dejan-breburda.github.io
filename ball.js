function Ball(x, y, radius, e, mass, density, colour){
	this.position = {x: x, y: y}; //m
	this.velocity = {x: 0, y: 0}; // m/s
	this.e = -e; // has no units
	this.mass = mass; //kg
	this.radius = radius; //m
	this.height = radius;
	this.width = radius;
	this.density = density;
	this.colour = colour;
	this.area = (Math.PI * radius * radius) / 10000; //m^2
}


var canvas = null;
var ctx = null;
var fps = 1/120; //120 FPS
var dt = fps * 1000; //ms
var timer = false;
var Cd = 0.47;
var rho = 1.22; //kg/m^3
var mouse = {x: 0, y:0, isDown: false};
var ag = 9.81; //m/s^2 acceleration due to gravity on earth = 9.81 m/s^2.
var width = 0;
var height = 0;
var balls = [];

var setup = function(){
	canvas = document.getElementById('canvas');
	canvas.width = document.body.clientWidth -20; //document.width is obsolete
    canvas.height = document.body.clientHeight -20; //document.height is obsolete
	ctx = canvas.getContext('2d');
	width = canvas.width;
	height = canvas.height;
	balls.push(new Ball(500, 200, 40, 0.7,0.45,0.08, "rgb(" + 0 + "," + 0 + "," + 0 + ")"));
	timer = setInterval(loop, dt);
    console.log("done");
}

function loop() {
	//Clear window at the begining of every frame
	ctx.clearRect(0, 0, width, height);
	for (var i = 0; i < balls.length; i++) {
		//Rendering the ball
		ctx.beginPath();
		ctx.fillStyle = balls[i].colour;
		ctx.arc(balls[i].position.x, balls[i].position.y, balls[i].radius, 0, 2 * Math.PI, true);
		ctx.fill();
		ctx.closePath();
		collisionWall(balls[i]);
		collisionPlayer(balls[i])
	}
}
const canvas = document.getElementById('canvas-background');
const ctx = canvas.getContext('2d');

let settings = {
	ballsize: 10,
	drag: 0.003,
	weight: 5,
	gravity: 9.81,
	density: 0.5,
	color: "rgb(255, 255, 255)"
};



class Ball{
	constructor(){
		this.size = settings.ballsize;
		this.density = settings.density;
		this.weight = settings.weight;
		this.color = settings.color;
		this.x = 300;
		this.y = 300;
		this.vx = 0;
		this.vy = 0;
	}
	
	update(){
		this.x += this.vx;
		this.y += this.vy;
	}
	
	draw(){
		ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
		console.log("done!");
	}
}


var ball = new Ball();
function main(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ball.draw();
	requestAnimationFrame(main());
	//main();
}
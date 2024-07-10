const canvas = document.getElementById('canvas-background');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];

function particleCount(){
	return Math.round((window.innerWidth / 1000)* 200);
}

class Particle {
	constructor() {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
		this.size = Math.random() * 5 + 1;
		this.speedX = (Math.random() - 0.5) * 0.4;
		this.speedY = (Math.random() - 0.5) * 0.4;
		this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
	}

	update() {
		this.x += this.speedX;
		this.y += this.speedY;

		if (this.size > 0.2) this.size -= 0.01;

		if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
		if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
	}

	draw() {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fill();
	}
}

function createParticles() {
	particles.length = 0;
	for (let i = 0; i < particleCount(); i++) {
		particles.push(new Particle());
	}
}

let cursorx = -2000;
let cursory = -2000;
const maxfeet = 10;
const maxconnections = 10;

function animateParticles() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	let currentfeet = 0;
	for (let i = 0; i < particles.length; i++) {
		particles[i].update();
		particles[i].draw();
		const dxc = particles[i].x - cursorx;
		const dyc = particles[i].y - cursory;
		const distancec = Math.sqrt(dxc * dxc + dyc * dyc);
		
		let currentconnections = 0;
		for (let j = i; j < particles.length; j++) {
			const dx = particles[i].x - particles[j].x;
			const dy = particles[i].y - particles[j].y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			
			
			if (distance < 200 && currentconnections < maxconnections) {
				currentconnections ++;
				ctx.beginPath();
				ctx.strokeStyle = particles[i].color;
				ctx.lineWidth = Math.max(0.03,1-distance/100);
				ctx.moveTo(particles[i].x, particles[i].y);
				ctx.lineTo(particles[j].x, particles[j].y);
				ctx.stroke();
			}
		}
		
		if (distancec < 150 && currentfeet < maxfeet) {
			currentfeet	++;
			ctx.beginPath();
			ctx.strokeStyle = particles[i].color;
			ctx.lineWidth = Math.max(0.2,1-distancec/60);
			ctx.moveTo(particles[i].x, particles[i].y);
			ctx.lineTo(cursorx+(25*Math.max(0.4,(cursorx/canvas.width))), cursory+10);
			ctx.stroke();
		}

		if (particles[i].size <= 0.2) {
			particles.splice(i, 1);
			i--;
			particles.push(new Particle());
		}
	}
	requestAnimationFrame(animateParticles);
}

createParticles();
animateParticles();

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	createParticles();
});

const cursor = document.getElementById('interactive-cursor');
document.addEventListener('mousemove', (e) => {
	cursorx = e.clientX-10;
	cursory = e.clientY-10;
	cursor.style.left = cursorx + 'px';
	cursor.style.top = cursory + 'px';
});

document.querySelectorAll('body').forEach(section => {
	section.addEventListener('mouseenter', () => {
		cursor.style.transform = 'scale(1)';
		cursor.style.width = '15px';
		cursor.style.height = '15px';
	});
	section.addEventListener('mouseleave', () => {
		cursor.style.transform = 'scale(0)';
		cursor.style.width = '0px';
		cursor.style.height = '0px';
		cursorx = -2000;
		cursory = -2000;
	});
});
window.addEventListener('load', () => {
	anime({
		targets: '.section',
		translateY: [50, 0],
		opacity: [0, 1],
		delay: anime.stagger(200),
		easing: 'easeOutExpo',
		duration: 1500
	});

	anime({
		targets: '.skill-progress',
		width: (el) => [10,el.style.with],
		easing: 'easeInOutQuart',
		delay: anime.stagger(100),
		duration: 1500
	});
});
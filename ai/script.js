const Engine = Matter.Engine,
	  Render = Matter.Render,
	  Runner = Matter.Runner,
	  Bodies = Matter.Bodies,
	  Composite = Matter.Composite,
	  MouseConstraint = Matter.MouseConstraint,
	  Mouse = Matter.Mouse,
	  World = Matter.World,
	  Body = Matter.Body,
	  Vector = Matter.Vector;

const engine = Engine.create();
const world = engine.world;

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const render = Render.create({
	canvas: canvas,
	engine: engine,
	options: {
		width: window.innerWidth,
		height: window.innerHeight,
		wireframes: false,
		background: '#1a1a2e'
	}
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

let ground, leftWall, rightWall, topWall;

function createWalls() {
	ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 60, { 
		isStatic: true,
		render: { fillStyle: '#0f3460' }
	});
	leftWall = Bodies.rectangle(0, window.innerHeight / 2, 60, window.innerHeight, { 
		isStatic: true,
		render: { fillStyle: '#0f3460' }
	});
	rightWall = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 60, window.innerHeight, { 
		isStatic: true,
		render: { fillStyle: '#0f3460' }
	});
	topWall = Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 60, { 
		isStatic: true,
		render: { fillStyle: '#0f3460' }
	});
	Composite.add(world, [ground, leftWall, rightWall, topWall]);
}

createWalls();

const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
	mouse: mouse,
	constraint: {
		stiffness: 0.2,
		render: { visible: false }
	}
});

Composite.add(world, mouseConstraint);
render.mouse = mouse;

function addShape(type) {
	const x = Math.random() * (window.innerWidth - 100) + 50;
	const y = 50;
	const color = `hsl(${Math.random() * 360}, 80%, 60%)`;
	let shape;

	switch(type) {
		case 'circle':
			shape = Bodies.circle(x, y, Math.random() * 20 + 10, {
				restitution: 0.8,
				friction: 0.005,
				render: { 
					fillStyle: color,
					strokeStyle: 'white',
					lineWidth: 2
				}
			});
			break;
		case 'square':
			const size = Math.random() * 40 + 20;
			shape = Bodies.rectangle(x, y, size, size, {
				chamfer: { radius: 5 },
				render: { 
					fillStyle: color,
					strokeStyle: 'white',
					lineWidth: 2
				}
			});
			break;
		case 'triangle':
			const sideLength = Math.random() * 40 + 20;
			shape = Bodies.polygon(x, y, 3, sideLength, {
				render: { 
					fillStyle: color,
					strokeStyle: 'white',
					lineWidth: 2
				}
			});
			break;
	}

	Composite.add(world, shape);
}

let gravityOn = true;
function toggleGravity() {
	gravityOn = !gravityOn;
	engine.world.gravity.y = gravityOn ? 1 : 0;
	document.getElementById('toggleGravity').classList.toggle('active', gravityOn);
}

let wallsOn = true;
function toggleWalls() {
	wallsOn = !wallsOn;
	if (wallsOn) {
		Composite.add(world, [leftWall, rightWall, topWall]);
	} else {
		Composite.remove(world, [leftWall, rightWall, topWall]);
	}
	document.getElementById('toggleWalls').classList.toggle('active', wallsOn);
}

function reset() {
	World.clear(world);
	createWalls();
	Composite.add(world, mouseConstraint);
	gravityOn = true;
	wallsOn = true;
	engine.world.gravity.y = 1;
	document.getElementById('toggleGravity').classList.add('active');
	document.getElementById('toggleWalls').classList.add('active');
}

function createExplosionParticles(x, y, color) {
	const particleCount = 10;
	const particleRadius = 3;
	const particles = [];

	for (let i = 0; i < particleCount; i++) {
		const angle = (i / particleCount) * Math.PI * 2;
		const particle = Bodies.circle(x, y, particleRadius, {
			render: { fillStyle: color },
			frictionAir: 0.1
		});
		
		const speed = 5;
		Body.setVelocity(particle, Vector.create(
			Math.cos(angle) * speed,
			Math.sin(angle) * speed
		));

		particles.push(particle);
	}

	Composite.add(world, particles);

	setTimeout(() => {
		Composite.remove(world, particles);
	}, 1000);
}

canvas.addEventListener('dblclick', function(event) {
	const bodies = Composite.allBodies(world);
	for (let i = 0; i < bodies.length; i++) {
		if (Matter.Bounds.contains(bodies[i].bounds, { x: event.clientX, y: event.clientY }) &&
			!bodies[i].isStatic) {
			const color = bodies[i].render.fillStyle;
			const { x, y } = bodies[i].position;
			World.remove(world, bodies[i]);
			createExplosionParticles(x, y, color);
			break;
		}
	}
});

document.getElementById('addCircle').addEventListener('click', () => addShape('circle'));
document.getElementById('addSquare').addEventListener('click', () => addShape('square'));
document.getElementById('addTriangle').addEventListener('click', () => addShape('triangle'));
document.getElementById('toggleGravity').addEventListener('click', toggleGravity);
document.getElementById('toggleWalls').addEventListener('click', toggleWalls);
document.getElementById('reset').addEventListener('click', reset);

window.addEventListener('resize', function() {
	render.canvas.width = window.innerWidth;
	render.canvas.height = window.innerHeight;
	Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight });
	Matter.Body.setPosition(leftWall, { x: 0, y: window.innerHeight / 2 });
	Matter.Body.setPosition(rightWall, { x: window.innerWidth, y: window.innerHeight / 2 });
	Matter.Body.setPosition(topWall, { x: window.innerWidth / 2, y: 0 });
});

// Aktiviere initial die Buttons für Gravitation und Wände
document.getElementById('toggleGravity').classList.add('active');
document.getElementById('toggleWalls').classList.add('active');
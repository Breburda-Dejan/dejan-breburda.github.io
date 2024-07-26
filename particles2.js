const canvas = document.getElementById('canvas-background');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];

// Particle system settings
let settings = {
    particleCount: 300,
	drag: 0.004,
	cweight: 2000,
    particleSize: 5,
    connectionDistance: 150,
    gravity: 0.3
};

function particleCount() {
    return Math.round((window.innerWidth / 1000) * settings.particleCount);
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * settings.particleSize + 1;
        this.mass = this.size * 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        this.opacity = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.001;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    distance(particle) {
        const dx = this.x - particle.x;
        const dy = this.y - particle.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    distanceCursor() {
        const dx = this.x - cursorx;
        const dy = this.y - cursory;
        return Math.sqrt(dx * dx + dy * dy);
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
const maxFeet = 100;
const maxConnections = 10;
var cursorgdir = 1;

class PhysicsEngine {
    constructor() {
        this.G = settings.gravity; // Gravitational constant
        this.drag = settings.drag; // Reduced drag for more movement
    }
    
    applyForces() {
        for (let i = 0; i < particles.length; i++) {
            let totalForceX = 0;
            let totalForceY = 0;
            
            const dxc = particles[i].x - cursorx;
            const dyc = particles[i].y - cursory;
            const distanceCursor = Math.sqrt(dxc * dxc + dyc * dyc);
            if (distanceCursor > 5 && distanceCursor < 1999){
                const force = (this.G * settings.cweight * particles[i].mass)/ (distanceCursor * distanceCursor);
                totalForceX -= (force * dxc) * cursorgdir;
                totalForceY -= (force * dyc) * cursorgdir;
            }

            for (let j = 0; j < particles.length; j++) {
                if (i !== j) {
                    const dx = particles[j].x - particles[i].x;
                    const dy = particles[j].y - particles[i].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if(distance > 100 && distance < 550){
                        const force = (this.G * particles[i].mass * particles[j].mass) / (distance * distance);
                        totalForceX += force * dx;
                        totalForceY += force * dy;
                    }
                }
            }

            particles[i].speedX += totalForceX * this.drag;
            particles[i].speedY += totalForceY * this.drag;

            // Add some random movement
            particles[i].speedX += (Math.random() - 0.5) * 0.1;
            particles[i].speedY += (Math.random() - 0.5) * 0.1;

            // Limit speed
            const maxSpeed = 0.8;
            const speed = Math.sqrt(particles[i].speedX * particles[i].speedX + particles[i].speedY * particles[i].speedY);
            if (speed > maxSpeed) {
                particles[i].speedX = (particles[i].speedX / speed) * maxSpeed;
                particles[i].speedY = (particles[i].speedY / speed) * maxSpeed;
            }
        }
    }
}

const ph = new PhysicsEngine();

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ph.applyForces();
    
    let currentFeet = 0;
    for (let i = 0; i < particles.length; i++) {
        if (particles[i].opacity < 1) {
            particles[i].opacity += 0.01;
        }
        particles[i].update();
        particles[i].draw();
        const distancec = particles[i].distanceCursor();
        
        let currentConnections = 0;
        for (let j = i + 1; j < particles.length; j++) {
            const distance = particles[i].distance(particles[j]);
            
            if (distance < settings.connectionDistance && currentConnections < maxConnections) {
                currentConnections++;
                ctx.beginPath();
                ctx.strokeStyle = particles[i].color;
                ctx.globalAlpha = Math.max(0.03, 1 - distance / (settings.connectionDistance / 2));
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
        
        if (distancec < 1999 && currentFeet < maxFeet) {
            currentFeet++;
            ctx.beginPath();
            ctx.strokeStyle = particles[i].color;
            ctx.globalAlpha = Math.max(0.2, 1 - distancec / 60);
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(cursorx + (25 * Math.max(0.4, (cursorx / canvas.width))), cursory + 10);
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

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
});

const cursor = document.getElementById('interactive-cursor');
document.addEventListener('mousemove', (e) => {
    cursorx = e.clientX;
    cursory = e.clientY;
    cursor.style.left = cursorx + 'px';
    cursor.style.top = cursory + 'px';
    cursor.style.opacity = 1;
});

document.body.addEventListener('mousedown', () => {
    cursorgdir = -1;
});

document.body.addEventListener('mouseup', () => {
    cursorgdir = 1;
});

document.body.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(1)';
});
document.body.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(0)';
    cursorx = -2000;
    cursory = -2000;
});

document.addEventListener('DOMContentLoaded', function() {
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const menuOverlay = document.querySelector('.menu-overlay');

    hamburgerIcon.addEventListener('click', function() {
        this.classList.toggle('open');
        
        if (this.classList.contains('open')) {
            menuOverlay.style.display = 'flex';
            anime({
                targets: '.menu-overlay',
                opacity: [0, 1],
                scale: [0.9, 1],
                easing: 'easeOutExpo',
                duration: 300
            });
        } else {
            anime({
                targets: '.menu-overlay',
                opacity: [1, 0],
                scale: [1, 0.9],
                easing: 'easeInExpo',
                duration: 300,
                complete: function() {
                    menuOverlay.style.display = 'none';
                }
            });
        }
    });

    // Set up sliders
    const particleCountSlider = document.getElementById('particleCount');
    const particleSizeSlider = document.getElementById('particleSize');
    const connectionDistanceSlider = document.getElementById('connectionDistance');
    const gravitySlider = document.getElementById('gravity');
	const dragSlider = document.getElementById('drag');
	const cweightSlider = document.getElementById('cweight');

    particleCountSlider.value = settings.particleCount;
    particleSizeSlider.value = settings.particleSize;
    connectionDistanceSlider.value = settings.connectionDistance;
    gravitySlider.value = settings.gravity;
	dragSlider.value = settings.drag;
	cweightSlider.value = settings.cweight;

    document.getElementById('particleCountValue').textContent = settings.particleCount;
    document.getElementById('particleSizeValue').textContent = settings.particleSize;
    document.getElementById('connectionDistanceValue').textContent = settings.connectionDistance;
    document.getElementById('gravityValue').textContent = settings.gravity;
	document.getElementById('dragValue').textContent = settings.drag;
	document.getElementById('cweightValue').textContent = settings.cweight;

    particleCountSlider.addEventListener('input', function() {
        settings.particleCount = parseInt(this.value);
        document.getElementById('particleCountValue').textContent = settings.particleCount;
        createParticles();
    });

    particleSizeSlider.addEventListener('input', function() {
        settings.particleSize = parseFloat(this.value);
        document.getElementById('particleSizeValue').textContent = settings.particleSize;
        createParticles();
    });

    connectionDistanceSlider.addEventListener('input', function() {
        settings.connectionDistance = parseInt(this.value);
        document.getElementById('connectionDistanceValue').textContent = settings.connectionDistance;
    });

    gravitySlider.addEventListener('input', function() {
        settings.gravity = parseFloat(this.value);
        document.getElementById('gravityValue').textContent = settings.gravity;
        ph.G = settings.gravity;
    });
	
	dragSlider.addEventListener('input', function() {
        settings.drag = parseFloat(this.value);
        document.getElementById('dragValue').textContent = settings.drag;
        ph.drag = settings.drag;
    });
	
	cweightSlider.addEventListener('input', function() {
        settings.cweight = parseFloat(this.value);
        document.getElementById('cweightValue').textContent = settings.cweight;
    });
});

animateParticles();
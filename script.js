/**
 * EDO x AI : Syncretism Project
 * Ultimate Script
 */

/* --------------------------------------------------
   0. Custom Cursor Logic (PC Only)
-------------------------------------------------- */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 60);
    });

    const interactiveTargets = 'a, button, .art-piece, .hero-visual-container, input, textarea, .lexicon-item, .code-card';
    document.querySelectorAll(interactiveTargets).forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '50px';
            cursor.style.height = '50px';
            cursor.style.backgroundColor = 'rgba(211, 56, 28, 0.15)';
            follower.style.borderColor = '#d3381c';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'transparent';
            follower.style.borderColor = 'rgba(77, 121, 255, 0.5)';
        });
    });
}

/* --------------------------------------------------
   1. Interactive Bonsai Circuit
-------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const svg = document.getElementById('bonsai-svg');
    const container = document.getElementById('bonsai-container');
    const paths = Array.from(document.querySelectorAll('.circuit-path'));

    if (!svg || paths.length === 0) return;

    let isHovering = false;
    let particles = [];

    container.addEventListener('mouseenter', () => isHovering = true);
    container.addEventListener('mouseleave', () => isHovering = false);

    class CircuitParticle {
        constructor(pathElement) {
            this.path = pathElement;
            this.totalLength = pathElement.getTotalLength();
            this.progress = 0;
            this.direction = Math.random() > 0.5 ? 1 : -1;
            if (this.direction === -1) this.progress = 1;
            this.baseSpeed = (Math.random() * 1.5 + 0.5); 
            this.size = Math.random() * 2 + 2;

            this.element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            this.element.setAttribute("r", this.size);
            this.element.setAttribute("class", "packet");
            
            this.updatePosition();
            svg.appendChild(this.element);
        }

        update() {
            const speedMultiplier = isHovering ? 5 : 1;
            const moveAmount = (this.baseSpeed * speedMultiplier) / this.totalLength * 2;

            if (this.direction === 1) {
                this.progress += moveAmount;
            } else {
                this.progress -= moveAmount;
            }

            if (this.progress >= 1 || this.progress <= 0) {
                this.remove();
                return false;
            }
            this.updatePosition();
            return true;
        }

        updatePosition() {
            try {
                const point = this.path.getPointAtLength(this.progress * this.totalLength);
                this.element.setAttribute("cx", point.x);
                this.element.setAttribute("cy", point.y);
            } catch(e) {
                this.remove();
            }
        }

        remove() {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }
    }

    function animateCircuit() {
        const spawnChance = isHovering ? 0.4 : 0.03;
        const attempts = isHovering ? 3 : 1;

        for(let k=0; k<attempts; k++) {
            if (Math.random() < spawnChance) {
                const randomPath = paths[Math.floor(Math.random() * paths.length)];
                particles.push(new CircuitParticle(randomPath));
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const alive = particles[i].update();
            if (!alive) particles.splice(i, 1);
        }
        requestAnimationFrame(animateCircuit);
    }

    animateCircuit();
});

/* --------------------------------------------------
   2. Canvas Background
-------------------------------------------------- */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let fallingParticles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class FallingParticle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * width;
        this.y = -20; 
        this.speed = Math.random() * 1 + 0.5;
        this.size = Math.random() * 3 + 1;
        this.wobble = Math.random() * Math.PI * 2;
        this.char = Math.random() > 0.5 ? '1' : '0';
        this.color = '#ffb7b2'; 
    }
    update() {
        this.y += this.speed;
        this.wobble += 0.02;
        this.x += Math.sin(this.wobble) * 0.5;
        
        if (this.y > height * 0.6) {
            this.isDigit = true;
            this.color = '#4d79ff';
        } else {
            this.isDigit = false;
            this.color = '#ffb7b2';
        }
        if (this.y > height) this.reset();
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.4;
        if (this.isDigit) {
            ctx.font = '10px "Space Mono"';
            ctx.fillText(this.char, this.x, this.y);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
            ctx.fill();
        }
    }
}

function initFalling() {
    fallingParticles = [];
    const count = window.innerWidth < 768 ? 30 : 80;
    for(let i=0; i<count; i++) fallingParticles.push(new FallingParticle());
}
initFalling();

function animateFalling() {
    ctx.clearRect(0, 0, width, height);
    fallingParticles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateFalling);
}
animateFalling();

/* --------------------------------------------------
   3. Scroll Observer
-------------------------------------------------- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.animate-target').forEach(el => observer.observe(el));
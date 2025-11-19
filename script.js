/**
 * EDO x AI : Syncretism Project
 * Script created by Gemini
 */

/* --------------------------------------------------
   0. Custom Cursor Logic (PC Only)
-------------------------------------------------- */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

// マウス移動時の処理
document.addEventListener('mousemove', (e) => {
    // メインカーソルは即座に移動
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // フォロワーは少し遅れて追従（CSS transitionで滑らかに）
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';
});

// リンクやボタンホバー時のリアクション
document.querySelectorAll('a, button, .card, .art-piece').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '50px';
        cursor.style.height = '50px';
        cursor.style.backgroundColor = 'rgba(211, 56, 28, 0.2)'; // 淡い赤
        follower.style.borderColor = '#d3381c';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.backgroundColor = 'transparent';
        follower.style.borderColor = 'rgba(77, 121, 255, 0.5)';
    });
});


/* --------------------------------------------------
   1. Canvas Particle System (Sakura -> Binary)
-------------------------------------------------- */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = -20; 
        this.speed = Math.random() * 1.5 + 0.5;
        this.size = Math.random() * 4 + 2;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.02;
        this.isDigit = false;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.char = Math.random() > 0.5 ? '1' : '0';
        this.color = '#ffb7b2';
    }

    update() {
        this.y += this.speed;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.5;

        if (this.y > height * 0.6) {
            this.isDigit = true;
            this.color = '#4d79ff';
        } else {
            this.isDigit = false;
            this.color = '#ffb7b2';
        }

        if (this.y > height) {
            this.reset();
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;

        if (this.isDigit) {
            ctx.font = '10px "Space Mono"';
            ctx.fillText(this.char, this.x, this.y);
        } else {
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.size, this.size * 0.6, this.wobble, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function initParticles() {
    particles = [];
    // PCなら多め、スマホなら少なめ
    const particleCount = window.innerWidth < 768 ? 40 : 120;
    for (let i = 0; i < particleCount; i++) {
        const p = new Particle();
        p.y = Math.random() * height; 
        particles.push(p);
    }
}
initParticles();

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}
animate();


/* --------------------------------------------------
   2. Scroll Animation Observer
-------------------------------------------------- */
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-target').forEach(el => {
    observer.observe(el);
});
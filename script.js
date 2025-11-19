/**
 * EDO x AI : Syncretism Project
 * Script created by Gemini
 */

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
        this.speed = Math.random() * 2 + 0.5; // 少しゆっくりに
        this.size = Math.random() * 5 + 2;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.03;
        this.isDigit = false;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.char = Math.random() > 0.5 ? '1' : '0';
        this.color = '#ffb7b2';
    }

    update() {
        this.y += this.speed;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.5;

        // 画面の下半分に来たらデジタル化率を上げる
        if (this.y > height * 0.5) {
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
    const particleCount = window.innerWidth < 768 ? 40 : 80;
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
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // 一度表示されたら監視を解除（パフォーマンス向上）
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// .animate-target クラスを持つすべての要素を監視
document.querySelectorAll('.animate-target').forEach(el => {
    observer.observe(el);
});

/* --------------------------------------------------
   3. Extra Interactions
-------------------------------------------------- */
// ロゴ（タイトル）をクリックするとページトップへ
document.querySelector('h1').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
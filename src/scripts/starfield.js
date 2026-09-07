/**
 * Super Mind Odyssey - Cosmic Starfield Canvas Engine
 * High-performance, battery-conscious ambient stardust & shooting star system.
 */

class CosmicStarfield {
  constructor(canvasId = 'cosmic-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.shootingStars = [];
    this.numStars = window.innerWidth < 768 ? 45 : 75;
    this.animationFrameId = null;
    this.lastShootingStarTime = Date.now();

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate initial stars
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.4 + 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        alphaSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        speedY: Math.random() * 0.15 + 0.05,
        color: Math.random() > 0.3 ? '#FFF' : (Math.random() > 0.5 ? '#48CAE4' : '#FFD166')
      });
    }

    // Handle visibility to save battery on inactive tabs
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(this.animationFrameId);
      } else {
        this.render();
      }
    });

    this.render();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  maybeSpawnShootingStar() {
    const now = Date.now();
    if (now - this.lastShootingStarTime > 9000 && Math.random() < 0.02) {
      this.lastShootingStarTime = now;
      this.shootingStars.push({
        x: Math.random() * (this.canvas.width * 0.7),
        y: Math.random() * (this.canvas.height * 0.3),
        length: Math.random() * 80 + 60,
        speed: Math.random() * 6 + 7,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        opacity: 1,
        fadeSpeed: 0.025
      });
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render & update ambient stardust
    for (let s of this.stars) {
      s.alpha += s.alphaSpeed;
      if (s.alpha > 0.9 || s.alpha < 0.15) {
        s.alphaSpeed = -s.alphaSpeed;
      }

      s.y -= s.speedY;
      if (s.y < 0) {
        s.y = this.canvas.height;
        s.x = Math.random() * this.canvas.width;
      }

      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = s.alpha;
      this.ctx.fill();
    }

    // Render & update shooting stars
    this.maybeSpawnShootingStar();
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const ss = this.shootingStars[i];
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.opacity -= ss.fadeSpeed;

      if (ss.opacity <= 0) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      const tailX = ss.x - Math.cos(ss.angle) * ss.length;
      const tailY = ss.y - Math.sin(ss.angle) * ss.length;

      const grad = this.ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(1, `rgba(72, 202, 228, ${ss.opacity})`);

      this.ctx.beginPath();
      this.ctx.moveTo(tailX, tailY);
      this.ctx.lineTo(ss.x, ss.y);
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 1.8;
      this.ctx.globalAlpha = ss.opacity;
      this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1;
    this.animationFrameId = requestAnimationFrame(() => this.render());
  }
}

// Auto-start when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.cosmicStarfield = new CosmicStarfield();
});

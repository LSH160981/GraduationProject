<script setup>
import { onMounted, ref } from "vue";
import { animationFrameTimer } from "@/utils/Animate.js";

const canvasContainer = ref(null);
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const particles = [];

class Particle {
  constructor() {
    this.r = Math.floor(Math.random() * 15) + 30;
    this.x = Math.random() * (canvas.width - this.r * 2) + this.r;
    this.y = Math.random() * (canvas.height - this.r * 2) + this.r;
    this.d = Math.floor(Math.random() * 360);
    this.h = Math.floor(Math.random() * 6) + 3;
    this.vx = Math.random() - 0.5;
    this.vy = Math.random() - 0.5;
    const [r, g, b] = getRandomColor();
    this.color = `rgba(${r}, ${g}, ${b}, 0.2)`;
  }
  update() {
    this.x += this.vx * 2;
    this.y += this.vy * 2;
    this.d += 2;
    this.checkBoundaryCollision();
  }
  checkBoundaryCollision() {
    if (this.x < this.r || this.x > canvas.width - this.r) {
      this.vx = -this.vx;
    }
    if (this.y < this.r || this.y > canvas.height - this.r) {
      this.vy = -this.vy;
    }
  }
  draw() {
    ctx.beginPath();
    for (let i = 0; i < this.h; i++) {
      const angle = this.d + i * (360 / this.h);
      const x = this.r * Math.cos((angle * Math.PI) / 180) + this.x;
      const y = this.r * Math.sin((angle * Math.PI) / 180) + this.y;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "gray";
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
  }
}

const getRandomColor = () => [
  Math.floor(Math.random() * 255),
  Math.floor(Math.random() * 255),
  Math.floor(Math.random() * 255),
];

const initParticles = () => {
  const count = (canvas.width * canvas.height) / 10000;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
};

onMounted(() => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.zIndex = "-1";
  canvasContainer.value.appendChild(canvas);
  initParticles();
  animationFrameTimer(draw);
});
</script>

<template>
  <div ref="canvasContainer" class="canvas-container overflow-hidden"></div>
</template>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  z-index: -2;
}
</style>

<script setup>
import { onMounted, ref } from "vue";
import { animationFrameTimer } from "@/utils/Animate.js";

const canvasContainer = ref(null);
const particles = [];
const pcount = 1000;
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = Math.random();
  }
  update() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const deg = Math.atan2(this.y - centerY, this.x - centerX);
    const r = Math.sqrt(Math.pow(this.x - centerX, 2) + Math.pow(this.y - centerY, 2));
    this.x = r * Math.cos(deg + this.vx / 200) + centerX;
    this.y = r * Math.sin(deg + this.vx / 200) + centerY;
  }
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 1 + this.vx, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(255,255,255,${this.vx})`;
    this.ctx.fill();
  }
}

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (particles.length < pcount) {
    particles.push(new Particle(canvas));
  }
  for (const p of particles) {
    p.update();
    p.draw();
  }
};

onMounted(() => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.zIndex = -1;
  canvasContainer.value.appendChild(canvas);
  animationFrameTimer(animate);
});
</script>

<template>
  <div>
    <div class="rocket">
      <SVG name="rocket" width="128px" height="128px"></SVG>
    </div>
    <div ref="canvasContainer" class="canvas-container"></div>
  </div>
</template>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
.rocket {
  pointer-events: none;
  position: absolute;
  top: 60%;
  left: 15%;
  width: 200px;
  height: 200px;
  font-size: 8em;
  text-align: center;
  line-height: 200px;
  border-radius: 50%;
  box-shadow: inset 0 0 55px rgba(255, 255, 255, 0.1);
  animation: move 5s linear infinite;
}

.rocket::before {
  content: "";
  position: absolute;
  top: 90px;
  left: 20px;
  width: 30%;
  height: 60%;
  background: #ff0;
  transform: rotate(45deg);
  border-radius: 50%;
  filter: blur(15px);
  z-index: -1;
  animation: flue 5s linear infinite;
}

.rocket svg {
  position: absolute;
  top: 32px;
  left: 39px;
}

@media (max-width: 767px) {
  .rocket {
    top: 70%;
    left: 60px;
  }
}

@keyframes flue {
  0% {
    background: #00abff;
    transform: rotate(45deg) scaleY(1);
  }
  25% {
    background: #ffff90;
  }
  50% {
    background: #f100ff;
    transform: rotate(45deg) scaleY(2);
  }
  75% {
    background: #09dbff;
  }
  100% {
    background: #00abff;
    transform: rotate(45deg) scaleY(1);
  }
}

@keyframes move {
  0% {
    transform: translate(-20px, -20px);
  }
  25% {
    transform: translate(20px, 0px);
  }
  50% {
    transform: translate(-20px, 20px);
  }
  75% {
    transform: translate(20px, 0px);
  }
  100% {
    transform: translate(-20px, -20px);
  }
}
</style>

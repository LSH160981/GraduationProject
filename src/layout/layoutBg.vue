<template>
  <div ref="canvasContainer" class="canvas-container"></div>
</template>

<script>
import { onMounted, ref, onBeforeUnmount } from "vue";

export default {
  setup() {
    const canvasContainer = ref(null);
    let canvas, ctx, particles, count, intervalId;
    onMounted(() => {
      canvas = document.createElement("canvas");
      ctx = canvas.getContext("2d");
      particles = [];

      class Particle {
        constructor() {
          this.r = Math.floor(Math.random() * 15) + 30;
          this.x = Math.random() * (canvas.width - this.r * 2) + this.r;
          this.y = Math.random() * (canvas.height - this.r * 2) + this.r;
          this.d = Math.floor(Math.random() * 360);
          this.h = Math.floor(Math.random() * 6) + 3;
          this.vx = Math.random() - 0.5;
          this.vy = Math.random() - 0.5;
          let c = getColor();
          this.color = `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.2)`;
        }
        update() {
          this.x += this.vx * 2;
          this.y += this.vy * 2;
          this.d += 2;
        }
        draw() {
          ctx.beginPath();
          for (let i = 0; i < this.h; i++) {
            let d = this.d + i * (360 / this.h);
            let x = this.r * Math.cos((d * Math.PI) / 180) + this.x;
            let y = this.r * Math.sin((d * Math.PI) / 180) + this.y;
            ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.strokeStyle = "gray";
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.stroke();
        }
      }

      function getColor() {
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        return [r, g, b];
      }

      function init() {
        count = (canvas.width * canvas.height) / 10000;
        for (let i = 0; i < count; i++) {
          particles.push(new Particle());
        }
      }

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i in particles) {
          let p = particles[i];
          p.update();
          p.draw();
          if (p.x < p.r || p.x > canvas.width - p.r) {
            p.vx = -p.vx;
          }
          if (p.y < p.r || p.y > canvas.height - p.r) {
            p.vy = -p.vy;
          }
        }
      };

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.zIndex = "-1";
      canvasContainer.value.appendChild(canvas);
      init();
      intervalId = setInterval(draw, 1000 / 60);
    });

    onBeforeUnmount(() => {
      clearInterval(intervalId);
    });

    return {
      canvasContainer,
    };
  },
};
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  z-index: -2;
}
</style>

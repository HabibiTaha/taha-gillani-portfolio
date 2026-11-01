import { useRef, useEffect } from 'react';

interface CursorTrailProps {
  theme: 'dark' | 'light';
}

class Node {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
}

class WaveOscillator {
  phase: number;
  offset: number;
  frequency: number;
  amplitude: number;

  constructor(options: { phase?: number; offset?: number; frequency?: number; amplitude?: number }) {
    this.phase = options.phase || 0;
    this.offset = options.offset || 0;
    this.frequency = options.frequency || 0.001;
    this.amplitude = options.amplitude || 1;
  }

  update(): number {
    this.phase += this.frequency;
    return this.offset + Math.sin(this.phase) * this.amplitude;
  }
}

// Exact physics constants from tejasthind.com
const CONFIG = {
  friction: 0.5,
  trails: 20,
  size: 50,
  dampening: 0.25,
  tension: 0.98,
};

class Line {
  spring: number;
  friction: number;
  nodes: Node[];

  constructor(options: { spring: number }, initX: number, initY: number) {
    this.spring = options.spring + 0.1 * Math.random() - 0.02;
    this.friction = CONFIG.friction + 0.01 * Math.random() - 0.002;
    this.nodes = [];
    for (let i = 0; i < CONFIG.size; i++) {
      const node = new Node();
      node.x = initX;
      node.y = initY;
      this.nodes.push(node);
    }
  }

  update(targetX: number, targetY: number) {
    let spring = this.spring;
    const head = this.nodes[0];
    head.vx += (targetX - head.x) * spring;
    head.vy += (targetY - head.y) * spring;

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      if (i > 0) {
        const prev = this.nodes[i - 1];
        node.vx += (prev.x - node.x) * spring;
        node.vy += (prev.y - node.y) * spring;
        node.vx += prev.vx * CONFIG.dampening;
        node.vy += prev.vy * CONFIG.dampening;
      }
      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;
      spring *= CONFIG.tension;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    let currX = this.nodes[0].x;
    let currY = this.nodes[0].y;
    ctx.beginPath();
    ctx.moveTo(currX, currY);

    for (let i = 1; i < this.nodes.length - 2; i++) {
      const a = this.nodes[i];
      const b = this.nodes[i + 1];
      currX = 0.5 * (a.x + b.x);
      currY = 0.5 * (a.y + b.y);
      ctx.quadraticCurveTo(a.x, a.y, currX, currY);
    }

    if (this.nodes.length >= 2) {
      const a = this.nodes[this.nodes.length - 2];
      const b = this.nodes[this.nodes.length - 1];
      ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
    }

    ctx.stroke();
    ctx.closePath();
  }
}

export default function CursorTrail({ theme }: CursorTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    // Only run on desktop mouse/fine pointers
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    let animationFrameId: number;

    const mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      initialized: false,
      lastMoveTime: 0,
    };

    let trails: Line[] = [];

    const initTrails = (x: number, y: number) => {
      trails = [];
      for (let i = 0; i < CONFIG.trails; i++) {
        trails.push(
          new Line(
            { spring: 0.45 + (i / CONFIG.trails) * 0.025 },
            x,
            y
          )
        );
      }
    };

    const oscillator = new WaveOscillator({
      phase: 2 * Math.PI * Math.random(),
      amplitude: 85,
      frequency: 0.0015,
      offset: 285,
    });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const handlePointerMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.lastMoveTime = performance.now();
      if (!mouse.initialized) {
        mouse.initialized = true;
        initTrails(mouse.x, mouse.y);
      }
    };

    const handleFocus = () => {
      if (!isRunning) {
        isRunning = true;
        render();
      }
    };

    const handleBlur = () => {
      isRunning = false;
    };

    const render = () => {
      if (!isRunning) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, width, height);

      const now = performance.now();
      const idleTime = mouse.initialized ? now - mouse.lastMoveTime : Infinity;

      // Full opacity while actively moving, smoothly fades out over ~500ms once mouse stops
      let fade = 0;
      if (idleTime < 180) {
        fade = 1.0;
      } else if (idleTime < 700) {
        fade = Math.max(0, 1 - (idleTime - 180) / 520);
      }

      if (fade > 0 && trails.length > 0) {
        const isDark = themeRef.current === 'dark';
        const hue = Math.round(oscillator.update());

        if (isDark) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = `hsla(${hue}, 70%, 55%, ${0.22 * fade})`;
        } else {
          ctx.globalCompositeOperation = 'multiply';
          ctx.strokeStyle = `hsla(${hue}, 75%, 45%, ${0.3 * fade})`;
        }

        ctx.lineWidth = 1;

        for (let i = 0; i < trails.length; i++) {
          trails[i].update(mouse.x, mouse.y);
          trails[i].draw(ctx);
        }
      } else if (fade === 0 && trails.length > 0 && mouse.initialized) {
        // While invisible, align nodes cleanly to mouse so it blooms smoothly on next move
        for (let i = 0; i < trails.length; i++) {
          const t = trails[i];
          for (let j = 0; j < t.nodes.length; j++) {
            t.nodes[j].x = mouse.x;
            t.nodes[j].y = mouse.y;
            t.nodes[j].vx = 0;
            t.nodes[j].vy = 0;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('resize', resize);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    render();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', resize);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 hidden md:block"
      style={{
        mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
      }}
    />
  );
}

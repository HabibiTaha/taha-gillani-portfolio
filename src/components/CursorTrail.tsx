import { useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
  age: number;
  color: string;
}

const NEON_COLORS = ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00']; // Cyan, Magenta, Yellow, Neon Green

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, moving: false });
  const colorIndexRef = useRef(0);

  useEffect(() => {
    // Disable cursor trail on mobile viewports for performance
    if (window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moving = true;

      // Color cycling
      colorIndexRef.current = (colorIndexRef.current + 0.1) % NEON_COLORS.length;
      const color1 = NEON_COLORS[Math.floor(colorIndexRef.current)];
      const color2 = NEON_COLORS[(Math.floor(colorIndexRef.current) + 1) % NEON_COLORS.length];
      
      // Interpolate colors for smooth transitions
      const ratio = colorIndexRef.current % 1;
      const r1 = parseInt(color1.substring(1, 3), 16);
      const g1 = parseInt(color1.substring(3, 5), 16);
      const b1 = parseInt(color1.substring(5, 7), 16);
      const r2 = parseInt(color2.substring(1, 3), 16);
      const g2 = parseInt(color2.substring(3, 5), 16);
      const b2 = parseInt(color2.substring(5, 7), 16);
      const r = Math.round(r1 + (r2 - r1) * ratio);
      const g = Math.round(g1 + (g2 - g1) * ratio);
      const b = Math.round(b1 + (b2 - b1) * ratio);
      const color = `rgb(${r}, ${g}, ${b})`;

      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
        color
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation render loop
    let animationFrameId: number;
    const maxAge = 60; // Length of the trail in frames

    const drawTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current;

      // Update point ages and filter out expired points
      for (let i = 0; i < points.length; i++) {
        points[i].age += 1;
      }
      pointsRef.current = points.filter((p) => p.age < maxAge);

      // Draw the connecting ribbon trail
      const activePoints = pointsRef.current;
      if (activePoints.length > 1) {
        for (let i = 1; i < activePoints.length; i++) {
          const p1 = activePoints[i - 1];
          const p2 = activePoints[i];

          const alpha = 1 - p2.age / maxAge;
          ctx.strokeStyle = p2.color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = Math.max(0.5, (1 - p2.age / maxAge) * 4); // taper thickness
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1.0; // reset
      animationFrameId = requestAnimationFrame(drawTrail);
    };

    animationFrameId = requestAnimationFrame(drawTrail);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] hidden md:block"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

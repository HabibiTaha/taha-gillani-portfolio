import { useRef, useEffect } from 'react';

interface CursorTrailProps {
  theme: 'dark' | 'light';
}

interface CircleSegment {
  x: number;
  y: number;
}

export default function CursorTrail({ theme }: CursorTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circlesRef = useRef<CircleSegment[]>([]);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const hueRef = useRef(0);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    // Disable cursor trail on mobile viewports for performance
    if (window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to fill window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize trail segments
    const numCircles = 25; // Number of trail segments
    const circles: CircleSegment[] = [];
    for (let i = 0; i < numCircles; i++) {
      circles.push({ x: mouseRef.current.x, y: mouseRef.current.y });
    }
    circlesRef.current = circles;

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation render loop
    let animationFrameId: number;

    const drawTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let targetX = mouseRef.current.x;
      let targetY = mouseRef.current.y;

      // Increment hue for color cycling over time
      hueRef.current = (hueRef.current + 1.2) % 360;

      circlesRef.current.forEach((circle, index) => {
        // Spring physics: move each circle a percentage of the distance to the target
        // Added a tiny extra delay (multiplier reduced from 0.3 to 0.2)
        circle.x += (targetX - circle.x) * 0.2;
        circle.y += (targetY - circle.y) * 0.2;

        // Draw the segment
        ctx.beginPath();
        // Size shrinks down the trail (tapered multiplier reduced from 0.4 to 0.25 for smaller scale)
        const radius = (numCircles - index) * 0.25;
        ctx.arc(circle.x, circle.y, Math.max(radius, 0.1), 0, Math.PI * 2);
        
        // Opacity fades out
        const opacity = (numCircles - index) / numCircles;
        
        // Color cycle: smooth HSL shifts along the trail, adapting brightness for light/dark themes
        const hue = (hueRef.current + index * 4.5) % 360;
        const lightness = themeRef.current === 'dark' ? 60 : 45; // slightly darker/richer colors in light mode
        ctx.fillStyle = `hsla(${hue}, 100%, ${lightness}%, ${opacity * 0.55})`;
        ctx.fill();

        // The next circle's target is the current circle's position
        targetX = circle.x;
        targetY = circle.y;
      });

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
      style={{ mixBlendMode: theme === 'dark' ? 'screen' : 'multiply' }}
    />
  );
}

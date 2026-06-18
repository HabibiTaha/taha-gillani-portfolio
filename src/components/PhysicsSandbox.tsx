import { useRef, useEffect } from 'react';
import { Engine, World, Bodies, Mouse, MouseConstraint, Composite, Body } from 'matter-js';

interface PhysicsSandboxProps {
  zeroGravity: boolean;
}

export default function PhysicsSandbox({ zeroGravity }: PhysicsSandboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const zeroGravityRef = useRef(zeroGravity);

  // Responsive canvas sizing
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // ── 1. INITIALIZE MATTER.JS ENGINE ──
    const engine = Engine.create({
      gravity: { x: 0, y: zeroGravity ? 0 : 1, scale: 0.001 }
    });
    engineRef.current = engine;

    // ── 2. CREATE WALL BOUNDARIES (THICK AND ENCLOSED TO PREVENT ESCAPE) ──
    // Left wall
    const wallLeft = Bodies.rectangle(-100, height / 2, 200, height + 400, { isStatic: true });
    // Right wall
    const wallRight = Bodies.rectangle(width + 100, height / 2, 200, height + 400, { isStatic: true });
    // Floor
    const floor = Bodies.rectangle(width / 2, height + 100, width + 400, 200, { isStatic: true });
    // Ceiling
    const ceiling = Bodies.rectangle(width / 2, -100, width + 400, 200, { isStatic: true });

    Composite.add(engine.world, [wallLeft, wallRight, floor, ceiling]);

    const skills = [
      "React", "Node.js", "C++", "MongoDB", "AWS", "Docker", "Python", 
      "REST APIs", "Game Physics", "DynamoDB", "SAP", 
      "Git", "OOP", "Vercel", "PowerBI", "MS", "Office365", 
      "Supabase", "Azure", "Java", "Javascript", "SQL", "Finance", 
      "Express", "Django", "AI/ML", "C", "Prompting", "PowerApps", 
      "API", "JSON", "PCs", "Agile", "CMake", "RAII", "CI/CD"
    ];
    const blocks = skills.map((skill, index) => {
      // Calculate dynamic block size based on text length
      const blockWidth = skill.length * 10 + 36;
      const blockHeight = 36;
      const x = width / 4 + Math.random() * (width / 2);
      // Stagger drops vertically inside the screen bounds
      const y = 40 + index * 40;

      const block = Bodies.rectangle(x, y, blockWidth, blockHeight, {
        restitution: zeroGravity ? 1.0 : 0.45,
        friction: zeroGravity ? 0 : 0.08,
        frictionAir: zeroGravity ? 0 : 0.01,
        frictionStatic: zeroGravity ? 0 : 0.5,
        label: skill,
      });

      // Attach dimensions directly to the body for the custom renderer
      (block as any).w = blockWidth;
      (block as any).h = blockHeight;
      return block;
    });

    Composite.add(engine.world, blocks);

    // ── 4. ATTACH MOUSE CONSTRAINT (WITH DYNAMIC TOUCH & SCROLL SUPPORT) ──
    const getTouchPos = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    };

    let touchDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      const pos = getTouchPos(e);
      const bodies = Composite.allBodies(engine.world).filter(b => !b.isStatic);
      const hit = bodies.some(body => {
        return pos.x >= body.bounds.min.x &&
               pos.x <= body.bounds.max.x &&
               pos.y >= body.bounds.min.y &&
               pos.y <= body.bounds.max.y;
      });

      if (hit) {
        touchDragging = true;
        canvas.style.touchAction = 'none';
      } else {
        touchDragging = false;
        canvas.style.touchAction = 'pan-y';
        e.stopImmediatePropagation();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchDragging) {
        e.stopImmediatePropagation();
      }
    };

    const handleTouchEnd = () => {
      touchDragging = false;
      canvas.style.touchAction = 'pan-y';
    };

    canvas.addEventListener('touchstart', handleTouchStart, { capture: true, passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { capture: true, passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { capture: true, passive: true });

    const mouse = Mouse.create(canvas);
    // Set default touchAction to allow trackpad/mobile scrolling on empty space
    canvas.style.touchAction = 'pan-y';

    // Remove Matter's default wheel and touch event capture listeners that block scrolling
    canvas.removeEventListener('mousewheel', (mouse as any).mousewheel);
    canvas.removeEventListener('DOMMouseScroll', (mouse as any).mousewheel);
    canvas.removeEventListener('wheel', (mouse as any).mousewheel);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.18,
        render: { visible: false } // Hide Matter's constraint lines
      }
    });

    Composite.add(engine.world, mouseConstraint);

    // ── 5. CUSTOM DRAW & ANIMATION LOOP ──
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const renderLoop = () => {
      // Step the physics engine forward
      Engine.update(engine, 16.666);

      // Keep blocks strictly within the visible canvas borders
      blocks.forEach((block) => {
        const w = (block as any).w;
        const h = (block as any).h;
        const minX = w / 2 + 2;
        const maxX = width - w / 2 - 2;
        const minY = h / 2 + 2;
        const maxY = height - h / 2 - 2;

        let posX = block.position.x;
        let posY = block.position.y;
        let velX = block.velocity.x;
        let velY = block.velocity.y;
        let reset = false;

        if (posX < minX) {
          posX = minX;
          velX = -velX * 0.5;
          reset = true;
        } else if (posX > maxX) {
          posX = maxX;
          velX = -velX * 0.5;
          reset = true;
        }

        if (posY < minY) {
          posY = minY;
          velY = -velY * 0.5;
          reset = true;
        } else if (posY > maxY) {
          posY = maxY;
          velY = -velY * 0.5;
          reset = true;
        }

        if (reset) {
          Body.setPosition(block, { x: posX, y: posY });
          Body.setVelocity(block, { x: velX, y: velY });
        }
      });

      // Draw Screen background (pure black)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Render grid decoration lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const grid = 50;
      for (let xPos = 0; xPos < width; xPos += grid) {
        ctx.beginPath();
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, height);
        ctx.stroke();
      }
      for (let yPos = 0; yPos < height; yPos += grid) {
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(width, yPos);
        ctx.stroke();
      }

      // Render blocks
      blocks.forEach((block) => {
        const w = (block as any).w;
        const h = (block as any).h;

        ctx.save();
        ctx.translate(block.position.x, block.position.y);
        ctx.rotate(block.angle);

        // Check if mouse is hovering over this body
        const isHovered = mouseConstraint.body === block || 
          (mouse.position.x >= block.bounds.min.x &&
           mouse.position.x <= block.bounds.max.x &&
           mouse.position.y >= block.bounds.min.y &&
           mouse.position.y <= block.bounds.max.y);

        if (isHovered) {
          // Hover state: solid white box, black text
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(-w / 2, -h / 2, w, h);
          
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 12px "Space Mono", monospace';
        } else {
          // Normal state: transparent box, thin white borders, white text
          ctx.fillStyle = '#000000';
          ctx.fillRect(-w / 2, -h / 2, w, h);

          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.strokeRect(-w / 2, -h / 2, w, h);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = '12px "Space Mono", monospace';
        }

        // Draw centered text
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(block.label || '', 0, 0);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  // Adjust gravity on the fly when the prop changes
  useEffect(() => {
    zeroGravityRef.current = zeroGravity;
    if (engineRef.current) {
      engineRef.current.gravity.y = zeroGravity ? 0 : 1;

      // Adjust friction & bounce of all bodies dynamically
      const bodies = Composite.allBodies(engineRef.current.world);
      bodies.forEach((body) => {
        if (!body.isStatic) {
          if (zeroGravity) {
            // Space mode: zero friction, zero air drag, perfect elastic bounces
            body.frictionAir = 0;
            body.friction = 0;
            body.frictionStatic = 0;
            body.restitution = 1.0;

            // Push static blocks to start floating immediately
            if (Math.abs(body.velocity.x) < 0.15 && Math.abs(body.velocity.y) < 0.15) {
              Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 3.5,
                y: (Math.random() - 0.5) * 3.5,
              });
            }
          } else {
            // Earth mode: restore gravity behaviors
            body.frictionAir = 0.01;
            body.friction = 0.08;
            body.frictionStatic = 0.5;
            body.restitution = 0.45;
          }
        }
      });
    }
  }, [zeroGravity]);

  return (
    <div ref={containerRef} className="w-full h-full relative border-t border-white/10 overflow-hidden bg-black">
      <canvas ref={canvasRef} className="block w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}

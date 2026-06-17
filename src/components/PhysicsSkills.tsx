import { useRef, useEffect } from 'react';
import { Engine, World, Bodies, Mouse, MouseConstraint, Composite, Body } from 'matter-js';

const CYBER_COLORS = ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00']; // Cyan, Magenta, Yellow, Neon Green

const SKILL_CATEGORIES: { [key: string]: number } = {
  // Column 0: Languages
  "C++": 0, "C": 0, "Python": 0, "Java": 0, "Javascript": 0, "SQL": 0,
  // Column 1: Frontend & Web API
  "React": 1, "Vercel": 1, "API": 1, "JSON": 1,
  // Column 2: Backend & DB
  "Node.js": 2, "Express": 2, "MongoDB": 2, "REST APIs": 2, "Supabase": 2, "Django": 2,
  // Column 3: Cloud & DevOps
  "Git": 3, "Docker": 3, "AWS": 3, "Azure": 3, "CI/CD": 3,
  // Column 4: Systems & Physics
  "Memory Management": 4, "OOP": 4, "Game Physics": 4, "Collision Detection": 4, "CMake": 4, "RAII": 4,
  // Column 5: Business, Tools & AI
  "PowerBI": 5, "MS": 5, "Office365": 5, "Finance": 5, "PowerApps": 5, "PCs": 5, "Agile": 5, "MachineLearning": 5, "AI": 5, "Prompting": 5
};

const CATEGORY_NAMES = [
  "Languages",
  "Frontend",
  "Backend",
  "DevOps",
  "Systems",
  "Tools & AI"
];

interface PhysicsSkillsProps {
  zeroGravity: boolean;
  onToggleGravity: () => void;
  stacked: boolean;
  onToggleStacked: () => void;
  theme: 'dark' | 'light';
}

export default function PhysicsSkills({ zeroGravity, onToggleGravity, stacked, onToggleStacked, theme }: PhysicsSkillsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const zeroGravityRef = useRef(zeroGravity);
  const stackedRef = useRef(stacked);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);
  
  // Track bounds inside refs to keep them updated for the render loop
  const dimensionsRef = useRef({ width: 800, height: 400 });
  const boundaryRefs = useRef<{
    floor: Body | null;
    ceiling: Body | null;
    left: Body | null;
    right: Body | null;
  }>({ floor: null, ceiling: null, left: null, right: null });

  // Sync zeroGravity status
  useEffect(() => {
    zeroGravityRef.current = zeroGravity;
    if (engineRef.current) {
      engineRef.current.gravity.y = zeroGravity ? 0 : 1;

      // Adjust friction & bounce of all bodies dynamically
      const bodies = Composite.allBodies(engineRef.current.world);
      bodies.forEach((body) => {
        // Only modify if not static (meaning not frozen in stacked state)
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

  // Sync stacked status
  useEffect(() => {
    stackedRef.current = stacked;
    if (engineRef.current) {
      const bodies = Composite.allBodies(engineRef.current.world);
      
      if (stacked) {
        const currentWidth = dimensionsRef.current.width;
        const currentHeight = dimensionsRef.current.height;
        const numCols = 6;
        const colWidth = currentWidth / numCols;
        const colCounters = [0, 0, 0, 0, 0, 0];

        bodies.forEach((body) => {
          if (body.label && SKILL_CATEGORIES[body.label] !== undefined) {
            const colIndex = SKILL_CATEGORIES[body.label];
            const itemIndex = colCounters[colIndex]++;
            const blockHeight = (body as any).h || 42;
            const x = colWidth * (colIndex + 0.5);
            // Stack from the bottom up, leaving room for floor and category labels
            const y = currentHeight - 50 - (itemIndex * (blockHeight + 10));

            Body.setStatic(body, true);
            Body.setPosition(body, { x, y });
            Body.setAngle(body, 0);
            Body.setVelocity(body, { x: 0, y: 0 });
            Body.setAngularVelocity(body, 0);
          }
        });
      } else {
        // Restore dynamic state
        bodies.forEach((body) => {
          if (body.label && SKILL_CATEGORIES[body.label] !== undefined) {
            Body.setStatic(body, false);
            // Give them a tiny random velocity nudge so they fall dynamically
            Body.setVelocity(body, {
              x: (Math.random() - 0.5) * 1.5,
              y: (Math.random() - 0.5) * 1.5
            });
          }
        });
      }
    }
  }, [stacked]);



  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 400;
    canvas.width = width;
    canvas.height = height;
    dimensionsRef.current = { width, height };

    // ── 1. INITIALIZE MATTER.JS ENGINE ──
    const engine = Engine.create({
      gravity: { x: 0, y: zeroGravity ? 0 : 1, scale: 0.001 }
    });
    engineRef.current = engine;

    // ── 2. CREATE WALL BOUNDARIES (THICK AND ENCLOSED) ──
    const wallLeft = Bodies.rectangle(-100, height / 2, 200, height + 400, { isStatic: true });
    const wallRight = Bodies.rectangle(width + 100, height / 2, 200, height + 400, { isStatic: true });
    const floor = Bodies.rectangle(width / 2, height + 100, width + 400, 200, { isStatic: true });
    const ceiling = Bodies.rectangle(width / 2, -100, width + 400, 200, { isStatic: true });

    boundaryRefs.current = { floor, ceiling, left: wallLeft, right: wallRight };

    Composite.add(engine.world, [wallLeft, wallRight, floor, ceiling]);

    // ── 3. SPAWN TECH STACK BLOCKS ──
    const skills = [
      "React", "Node.js", "C++", "MongoDB", "AWS", "Docker", "Python", 
      "REST APIs", "Game Physics", "Collision Detection", "Memory Management", 
      "Git", "OOP", "Vercel", "PowerBI", "MS", "Office365", 
      "Supabase", "Azure", "Java", "Javascript", "SQL", "Finance", 
      "Express", "Django", "AI", "C", "Prompting", "PowerApps", 
      "API", "JSON", "PCs", "Agile", "MachineLearning", "CMake", "RAII", "CI/CD"
    ];

    const isMobile = window.innerWidth < 768;

    const blocks = skills.map((skill, index) => {
      // Calculate responsive block dimensions based on text length and screen width
      const blockWidth = isMobile ? (skill.length * 6.8 + 14) : (skill.length * 10.5 + 32);
      const blockHeight = isMobile ? 28 : 42;
      const fontSize = isMobile ? 10 : 13;
      
      // Spawn clustered in the upper-middle region of the visible canvas width/height
      const x = (width / 4) + (Math.random() * (width / 2));
      const y = 40 + Math.random() * (height / 2 - 60);

      const block = Bodies.rectangle(x, y, blockWidth, blockHeight, {
        restitution: zeroGravity ? 1.0 : 0.45,
        friction: zeroGravity ? 0 : 0.08,
        frictionAir: zeroGravity ? 0 : 0.012,
        frictionStatic: zeroGravity ? 0 : 0.5,
        label: skill,
      });

      // Attach custom render attributes
      (block as any).w = blockWidth;
      (block as any).h = blockHeight;
      (block as any).fontSize = fontSize;
      (block as any).color = CYBER_COLORS[index % CYBER_COLORS.length];
      return block;
    });

    Composite.add(engine.world, blocks);

    // If initial state is stacked, organize them immediately
    if (stackedRef.current) {
      const isMobile = window.innerWidth < 768;
      const numCols = isMobile ? 3 : 6;
      const colWidth = width / numCols;
      const colCounters = isMobile ? [0, 0, 0] : [0, 0, 0, 0, 0, 0];
      blocks.forEach((block) => {
        if (block.label && SKILL_CATEGORIES[block.label] !== undefined) {
          const catIndex = SKILL_CATEGORIES[block.label];
          const colIndex = isMobile 
            ? (catIndex === 0 || catIndex === 4 ? 0 : catIndex === 1 || catIndex === 2 ? 1 : 2)
            : catIndex;
          const itemIndex = colCounters[colIndex]++;
          const blockHeight = (block as any).h || 42;
          const x = colWidth * (colIndex + 0.5);
          const y = height - 50 - (itemIndex * (blockHeight + 10));

          Body.setStatic(block, true);
          Body.setPosition(block, { x, y });
          Body.setAngle(block, 0);
          Body.setVelocity(block, { x: 0, y: 0 });
          Body.setAngularVelocity(block, 0);
        }
      });
    }

    // ── 4. ATTACH MOUSE CONSTRAINT (WITH TOUCH & SCROLL SUPPORT) ──

    // Enable touch scroll on empty canvas spaces for mobile devices
    const getTouchPos = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    };

    const handleTouchStartMove = (e: TouchEvent) => {
      const pos = getTouchPos(e);
      const bodies = Composite.allBodies(engine.world).filter(b => !b.isStatic);
      const hit = bodies.some(body => {
        return pos.x >= body.bounds.min.x &&
               pos.x <= body.bounds.max.x &&
               pos.y >= body.bounds.min.y &&
               pos.y <= body.bounds.max.y;
      });
      if (!hit) {
        // Stop Matter.js from capturing the event, allowing the page to scroll
        e.stopImmediatePropagation();
      }
    };

    canvas.addEventListener('touchstart', handleTouchStartMove, { passive: true });
    canvas.addEventListener('touchmove', handleTouchStartMove, { passive: true });

    const mouse = Mouse.create(canvas);
    // Remove Matter's default wheel listeners so the page can scroll when hovering over the canvas
    canvas.removeEventListener('mousewheel', (mouse as any).mousewheel);
    canvas.removeEventListener('DOMMouseScroll', (mouse as any).mousewheel);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Composite.add(engine.world, mouseConstraint);

    // ── 5. RESIZE OBSERVER FOR MOBILE BOUNDARIES ──
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w === 0 || h === 0) continue;
        
        canvas.width = w;
        canvas.height = h;
        dimensionsRef.current = { width: w, height: h };

        const bounds = boundaryRefs.current;
        if (bounds.left) Body.setPosition(bounds.left, { x: -100, y: h / 2 });
        if (bounds.right) Body.setPosition(bounds.right, { x: w + 100, y: h / 2 });
        if (bounds.floor) Body.setPosition(bounds.floor, { x: w / 2, y: h + 100 });
        if (bounds.ceiling) Body.setPosition(bounds.ceiling, { x: w / 2, y: -100 });

        // If stacked is active, recalculate positions for all blocks
        if (stackedRef.current && engineRef.current) {
          const bodies = Composite.allBodies(engineRef.current.world);
          const isMobile = window.innerWidth < 768;
          const numCols = isMobile ? 3 : 6;
          const colWidth = w / numCols;
          const colCounters = isMobile ? [0, 0, 0] : [0, 0, 0, 0, 0, 0];

          bodies.forEach((body) => {
            if (body.label && SKILL_CATEGORIES[body.label] !== undefined) {
              const catIndex = SKILL_CATEGORIES[body.label];
              const colIndex = isMobile 
                ? (catIndex === 0 || catIndex === 4 ? 0 : catIndex === 1 || catIndex === 2 ? 1 : 2)
                : catIndex;
              const itemIndex = colCounters[colIndex]++;
              const blockHeight = (body as any).h || 42;
              const x = colWidth * (colIndex + 0.5);
              const y = h - 50 - (itemIndex * (blockHeight + 10));
              Body.setPosition(body, { x, y });
            }
          });
        }
      }
    });
    
    resizeObserver.observe(container);

    // ── 6. DRAW & ANIMATION LOOP ──
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const renderLoop = () => {
      // Step physics
      Engine.update(engine, 16.666);

      const currentWidth = dimensionsRef.current.width;
      const currentHeight = dimensionsRef.current.height;

      // Keep blocks strictly within screen bounds (prevent clipping)
      const bounceCoeff = zeroGravityRef.current ? -1.0 : -0.5;
      blocks.forEach((block) => {
        const w = (block as any).w;
        const h = (block as any).h;
        const minX = w / 2 + 2;
        const maxX = currentWidth - w / 2 - 2;
        const minY = h / 2 + 2;
        const maxY = currentHeight - h / 2 - 2;

        let posX = block.position.x;
        let posY = block.position.y;
        let velX = block.velocity.x;
        let velY = block.velocity.y;
        let reset = false;

        if (posX < minX) {
          posX = minX;
          velX = velX * bounceCoeff;
          reset = true;
        } else if (posX > maxX) {
          posX = maxX;
          velX = velX * bounceCoeff;
          reset = true;
        }

        if (posY < minY) {
          posY = minY;
          velY = velY * bounceCoeff;
          reset = true;
        } else if (posY > maxY) {
          posY = maxY;
          velY = velY * bounceCoeff;
          reset = true;
        }

        if (reset) {
          Body.setPosition(block, { x: posX, y: posY });
          Body.setVelocity(block, { x: velX, y: velY });
        }
      });

      // Clear canvas based on theme
      ctx.fillStyle = themeRef.current === 'dark' ? '#000000' : '#f8fafc';
      ctx.fillRect(0, 0, currentWidth, currentHeight);

      // Render subtle background grid
      ctx.strokeStyle = themeRef.current === 'dark' ? 'rgba(255, 255, 255, 0.015)' : 'rgba(15, 23, 42, 0.025)';
      ctx.lineWidth = 1;
      const grid = 40;
      for (let xPos = 0; xPos < currentWidth; xPos += grid) {
        ctx.beginPath();
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, currentHeight);
        ctx.stroke();
      }
      for (let yPos = 0; yPos < currentHeight; yPos += grid) {
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(currentWidth, yPos);
        ctx.stroke();
      }

      // Draw category headers if stacked
      if (stackedRef.current) {
        ctx.fillStyle = themeRef.current === 'dark' ? 'rgba(255, 255, 255, 0.35)' : 'rgba(15, 23, 42, 0.45)';
        ctx.font = 'bold 9px "Space Mono", monospace';
        ctx.textAlign = 'center';
        const isMobile = window.innerWidth < 768;
        const numCols = isMobile ? 3 : 6;
        const colWidth = currentWidth / numCols;
        
        const mobileHeaders = [
          "LANGS & SYS",
          "FRONT & BACK",
          "DEVOPS & TOOLS"
        ];

        const headerY = isMobile ? 110 : 80;
        for (let col = 0; col < numCols; col++) {
          const x = colWidth * (col + 0.5);
          const headerText = isMobile ? mobileHeaders[col] : CATEGORY_NAMES[col].toUpperCase();
          ctx.fillText(headerText, x, headerY);
        }
      }

      // Draw each block
      blocks.forEach((block) => {
        const w = (block as any).w;
        const h = (block as any).h;
        const fontSize = (block as any).fontSize || 12;
        const baseColor = (block as any).color;
        const currentTheme = themeRef.current;

        // Map neon colors to high-contrast equivalents in light mode
        let color = baseColor;
        if (currentTheme === 'light') {
          if (baseColor === '#00FFFF') color = '#0891b2'; // Cyan -> Cyan-600
          else if (baseColor === '#FF00FF') color = '#c026d3'; // Magenta -> Fuchsia-600
          else if (baseColor === '#FFFF00') color = '#b45309'; // Yellow -> Amber-700
          else if (baseColor === '#00FF00') color = '#16a34a'; // Neon Green -> Green-600
        }

        ctx.save();
        ctx.translate(block.position.x, block.position.y);
        ctx.rotate(block.angle);

        // Check hover / selection
        const isHovered = mouseConstraint.body === block || 
          (mouse.position.x >= block.bounds.min.x &&
           mouse.position.x <= block.bounds.max.x &&
           mouse.position.y >= block.bounds.min.y &&
           mouse.position.y <= block.bounds.max.y);

        if (isHovered) {
          // Hover fill state: solid color background, black text (dark mode) or white text (light mode)
          ctx.shadowBlur = 15;
          ctx.shadowColor = color;
          ctx.fillStyle = color;
          ctx.fillRect(-w / 2, -h / 2, w, h);
          
          ctx.fillStyle = currentTheme === 'dark' ? '#000000' : '#ffffff';
          ctx.font = `bold ${fontSize + 1}px "Space Mono", monospace`;
        } else {
          // Normal state: translucent background, color border, color text
          ctx.fillStyle = currentTheme === 'dark' ? 'rgba(10, 10, 10, 0.85)' : 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(-w / 2, -h / 2, w, h);

          ctx.strokeStyle = color;
          ctx.lineWidth = 1.8;
          ctx.strokeRect(-w / 2, -h / 2, w, h);

          ctx.fillStyle = color;
          ctx.font = `bold ${fontSize}px "Space Mono", monospace`;
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(block.label || '', 0, 0);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('touchstart', handleTouchStartMove);
      canvas.removeEventListener('touchmove', handleTouchStartMove);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div ref={containerRef} className={`w-full h-full relative overflow-hidden flex flex-col justify-between ${
      theme === 'dark' ? 'bg-black' : 'bg-slate-50'
    }`}>
      {/* Simulation HUD bar */}
      <div className={`absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 pointer-events-none font-mono text-[9px] ${
        theme === 'dark' ? 'text-white/40' : 'text-slate-500'
      }`}>
        <div className={`px-3 py-1.5 border rounded flex flex-col gap-0.5 pointer-events-auto shadow-lg ${
          theme === 'dark' ? 'bg-black/90 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
        }`}>
          <span className={`font-bold tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>SKILL ENGINE SANDBOX</span>
          <span className={`text-[7.5px] font-normal lowercase tracking-normal ${
            theme === 'dark' ? 'text-white/40' : 'text-slate-500'
          }`}>feel free to drag blocks around or stack them!</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pointer-events-auto w-full sm:w-auto items-stretch sm:items-center">
          <button
            onClick={onToggleStacked}
            className={`px-3 py-1 border rounded text-[9px] font-bold transition-all cursor-pointer ${
              stacked
                ? theme === 'dark'
                  ? 'bg-[#00FFFF] border-[#00FFFF] text-black shadow-[0_0_12px_rgba(0,255,255,0.4)]'
                  : 'bg-[#0891b2] border-[#0891b2] text-white shadow-[0_0_12px_rgba(8,145,178,0.4)]'
                : theme === 'dark'
                  ? 'bg-black/80 border-white/20 hover:border-white hover:bg-white/5 text-white'
                  : 'bg-white/90 border-slate-200 hover:border-slate-400 hover:bg-slate-100 text-slate-700'
            }`}
          >
            {stacked ? 'GRID STACK: ON' : 'STACK NEATLY'}
          </button>
          <button
            onClick={onToggleGravity}
            className={`px-3 py-1 border rounded text-[9px] font-bold transition-all cursor-pointer ${
              zeroGravity
                ? theme === 'dark'
                  ? 'bg-white border-white text-black shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                  : 'bg-slate-900 border-slate-900 text-white shadow-[0_0_12px_rgba(15,23,42,0.2)]'
                : theme === 'dark'
                  ? 'bg-black/80 border-white/20 hover:border-white hover:bg-white/5 text-white'
                  : 'bg-white/90 border-slate-200 hover:border-slate-400 hover:bg-slate-100 text-slate-700'
            }`}
          >
            {zeroGravity ? 'ZERO GRAVITY: ON' : 'ZERO GRAVITY: OFF'}
          </button>
        </div>
      </div>
      
      {/* Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface ScrollRevealTextProps {
  theme: 'dark' | 'light';
}

interface WordProps {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  isHighlight?: boolean;
  theme: 'dark' | 'light';
}

function Word({ word, progress, range, isHighlight, theme }: WordProps) {
  // Smooth scroll-driven illumination
  const opacity = useTransform(progress, range, [0.18, 1]);
  const y = useTransform(progress, range, [8, 0]);
  const blurValue = useTransform(progress, range, [4, 0]);

  return (
    <span className="relative inline-block mr-[0.26em] my-[0.06em]">
      <motion.span
        style={{
          opacity,
          y,
          filter: useTransform(blurValue, (v) => `blur(${v}px)`),
        }}
        className={`inline-block transition-colors duration-300 ${
          isHighlight
            ? theme === 'dark'
              ? 'text-cyan-400 font-semibold drop-shadow-[0_0_12px_rgba(6,182,212,0.45)]'
              : 'text-cyan-600 font-semibold drop-shadow-[0_0_8px_rgba(8,145,178,0.25)]'
            : theme === 'dark'
              ? 'text-white'
              : 'text-slate-900'
        }`}
      >
        {word}
      </motion.span>
    </span>
  );
}

export default function ScrollRevealText({ theme }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll through the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.45'],
  });

  const statement =
    "I engineer data-driven digital products and autonomous AI agents that drive a competitive edge.";
  const words = statement.split(' ');

  const highlights = new Set(['data-driven', 'digital', 'products', 'autonomous', 'AI', 'agents', 'competitive', 'edge.']);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-4xl mx-auto py-16 md:py-24 text-left font-sans select-none"
    >
      {/* Category Eyebrow HUD Tag */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 mb-6 font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase"
      >
        <span
          className={`px-2.5 py-1 rounded border ${
            theme === 'dark'
              ? 'border-cyan-400/30 text-cyan-400 bg-cyan-950/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
              : 'border-cyan-600/30 text-cyan-700 bg-cyan-50'
          }`}
        >
          01 // SELECTED WORK & EXPERIENCE
        </span>
        <div
          className={`h-[1px] flex-1 ${
            theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'
          }`}
        />
      </motion.div>

      {/* Scroll-Revealed Main Headline */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight leading-[1.25] md:leading-[1.2]">
        {words.map((word, i) => {
          const step = 1 / words.length;
          const start = i * step * 0.85;
          const end = Math.min(1, start + step * 1.5);
          return (
            <Word
              key={i}
              word={word}
              progress={scrollYProgress}
              range={[start, end]}
              isHighlight={highlights.has(word)}
              theme={theme}
            />
          );
        })}
      </h2>

      {/* Subtitle with 3D perspective slide-up */}
      <motion.p
        initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`mt-6 text-sm sm:text-base md:text-lg font-mono leading-relaxed max-w-2xl ${
          theme === 'dark' ? 'text-white/45' : 'text-slate-600'
        }`}
      >
        A curated showcase of production software, automated financial pipelines, and high-throughput cloud architectures.
      </motion.p>
    </div>
  );
}

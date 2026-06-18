import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BlinkingCursor = () => (
  <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{
      duration: 0.8,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    }}
    className="inline-block w-[3px] md:w-[4px] h-[0.85em] bg-cyan-400 ml-1 rounded-sm align-middle"
  />
);

interface CharItem {
  char: string;
  id: string;
  className?: string;
}

export default function TypewriterIntro({ onComplete, className }: { onComplete?: () => void; className?: string }) {
  const [step, setStep] = useState(0);

  const line1Text = "Hello, World.";
  const line2PartA = "I'm ";
  const line2PartB = "Taha Gillani";
  const line2PartC = ".";
  const line3Text = "Engineer | Innovator | Student";

  // Generate arrays of characters
  const line1Chars: CharItem[] = line1Text.split("").map((char, idx) => ({
    char,
    id: `l1-${idx}`,
  }));

  const line2Chars: CharItem[] = [
    ...line2PartA.split("").map((char, idx) => ({ char, id: `l2-a-${idx}` })),
    ...line2PartB.split("").map((char, idx) => ({
      char,
      id: `l2-b-${idx}`,
      className: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-300 font-extrabold"
    })),
    ...line2PartC.split("").map((char, idx) => ({ char, id: `l2-c-${idx}` })),
  ];

  const line3Chars: CharItem[] = line3Text.split("").map((char, idx) => ({
    char,
    id: `l3-${idx}`,
  }));

  const line1Len = line1Chars.length; // 13
  const pause1Len = 8; // 8 * 80ms = 640ms pause
  const line2Len = line2Chars.length; // 17
  const pause2Len = 8; // 8 * 80ms = 640ms pause
  const line3Len = line3Chars.length; // 36

  const totalSteps = line1Len + pause1Len + line2Len + pause2Len + line3Len; // 82

  useEffect(() => {
    if (step >= totalSteps) {
      if (onComplete) {
        const timer = setTimeout(() => {
          onComplete();
        }, 1000); // 1-second pause after typing finishes before transitioning
        return () => clearTimeout(timer);
      }
      return;
    }

    const timer = setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 80); // slow typing speed

    return () => clearTimeout(timer);
  }, [step, totalSteps, onComplete]);

  // Map step to typed counts
  const getTypedCounts = (s: number) => {
    let l1 = 0;
    let l2 = 0;
    let l3 = 0;

    // Line 1
    if (s <= line1Len) {
      l1 = s;
    } else {
      l1 = line1Len;
    }

    // Line 2
    const line2Start = line1Len + pause1Len;
    if (s > line2Start) {
      if (s <= line2Start + line2Len) {
        l2 = s - line2Start;
      } else {
        l2 = line2Len;
      }
    }

    // Line 3
    const line3Start = line1Len + pause1Len + line2Len + pause2Len;
    if (s > line3Start) {
      if (s <= line3Start + line3Len) {
        l3 = s - line3Start;
      } else {
        l3 = line3Len;
      }
    }

    return { l1, l2, l3 };
  };

  const { l1, l2, l3 } = getTypedCounts(step);

  // Active cursor placement
  const line2Start = line1Len + pause1Len;

  const activeLine = step < line1Len + pause1Len ? 1 : step < line2Start + line2Len + pause2Len ? 2 : 3;

  const renderLine = (chars: CharItem[], typedCount: number, isActive: boolean) => {
    const typed = chars.slice(0, typedCount);
    const untyped = chars.slice(typedCount);

    return (
      <>
        {typed.map((item) => (
          <span key={item.id} className={item.className || ''}>
            {item.char}
          </span>
        ))}
        {isActive && <BlinkingCursor />}
        {untyped.map((item) => (
          <span key={item.id} className={`opacity-0 select-none pointer-events-none ${item.className || ''}`}>
            {item.char}
          </span>
        ))}
      </>
    );
  };

  return (
    <h1 className={`text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight uppercase leading-[1.15] text-white mb-4 lg:mb-6 ${className || ''}`}>
      <span className="block min-h-[1.2em]">
        {renderLine(line1Chars, l1, activeLine === 1)}
      </span>
      <span className="block min-h-[1.2em]">
        {renderLine(line2Chars, l2, activeLine === 2)}
      </span>
      <span className="block min-h-[1.2em]">
        {renderLine(line3Chars, l3, activeLine === 3)}
      </span>
    </h1>
  );
}

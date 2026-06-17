import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Briefcase, Code, Circle } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  bullets: string[];
  tech?: string[];
  logo?: string;
  logoBg?: string;
}

const EXPERIENCE_ITEMS: AccordionItem[] = [
  {
    id: 'exp-2',
    title: 'Full Stack Developer / Software Engineer',
    subtitle: 'Imperio Property Management LTD. | Calgary, AB (June 2024 – August 2025)',
    color: '#FFFF00', // Neon Yellow
    logo: '/imperio.png',
    logoBg: '#ffffff',
    bullets: [
      'Engineered and optimized full-stack web applications utilizing the MERN stack, significantly enhancing system scalability, performance, and user engagement.',
      'Designed and deployed secure RESTful APIs to facilitate seamless, low-latency communication between front-end and back-end architectures.',
      'Streamlined local development and deployment pipelines by containerizing applications with Docker and managing version control via Git.',
      'Collaborated directly with stakeholders to debug critical issues, minimize system downtime, and refine technical workflows.',
      'Elevated user interface responsiveness and cross-browser reliability through component testing and iterative debugging.'
    ],
    tech: ['MERN Stack', 'RESTful APIs', 'Docker', 'Git', 'API Design', 'Debugging']
  },
  {
    id: 'exp-1',
    title: 'Commissioned Sales Representative',
    subtitle: 'Visions Electronics | Calgary, AB (Oct 2024 – August 2025)',
    color: '#FF00FF', // Neon Magenta
    logo: '/visions.png',
    logoBg: '#ffffff',
    bullets: [
      'Generated over $400K in product and accessory sales by translating complex technical specifications into consumer-focused value propositions.',
      'Recognized as a top-performing accessory salesperson across Canada for consistently outperforming aggressive regional targets.',
      'Cultivated a loyal client base through proactive relationship management, driving consistent repeat business and referrals.'
    ],
    tech: ['Sales Engineering', 'Consultative Selling', 'CRM Systems', 'Revenue Generation']
  }
];

const PROJECT_ITEMS: AccordionItem[] = [
  {
    id: 'proj-1',
    title: 'Interactive Physics-Sandbox Developer Portfolio',
    subtitle: 'React / Tailwind CSS / Framer Motion / Matter.js',
    color: '#00FFA3', // Neon Green
    logo: '/physics_logo.png',
    logoBg: '#000000',
    bullets: [
      'Engineered a custom single-page portfolio built around a high-performance 2D physics engine dashboard.',
      'Designed a full-screen scroll-locked boot sequence with a character-by-character slow typewriter intro and blinking cursor.',
      'Implemented smooth layout transformations using Framer Motion to reveal dashboard components upon intro completion.',
      'Built an interactive Matter.js canvas hosting 37 skill blocks, featuring Zero Gravity floating states and category-based column stacking.',
      'Implemented custom passive wheel and touch event intercepts to allow seamless page scrollability on desktop and mobile.'
    ],
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Matter.js', 'Vite']
  },
  {
    id: 'proj-2',
    title: 'NPC & Item Management Engine',
    subtitle: 'Modern C++ / OOP / CMake',
    color: '#00FFFF', // Neon Cyan
    logo: '/engine_logo.png',
    logoBg: '#000000',
    bullets: [
      'Engineered a low-level game entity system in modern C++ utilizing the Bridge design pattern to decouple abstractions.',
      'Optimized memory layouts, manual pointer allocations, and enforced strict RAII rules preventing memory leaks.',
      'Structured cross-platform compilation targets and builds using CMake configuration scripts.'
    ],
    tech: ['C++', 'OOP', 'Bridge Pattern', 'RAII', 'CMake', 'Memory Management']
  },
  {
    id: 'proj-3',
    title: 'Full-Stack Development (MERN & Cloud)',
    subtitle: 'MERN Stack / Docker / DevOps',
    color: '#FF00FF', // Neon Magenta
    logo: '/cloud_db_logo.png',
    logoBg: '#000000',
    bullets: [
      'Designed robust web applications with RESTful API architectures built on the MERN stack.',
      'Containerized development and deployment dependencies via Docker packaging.',
      'Configured CI/CD automation and deployed scalable applications to AWS and Azure cloud platforms.'
    ],
    tech: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Docker', 'AWS', 'Azure', 'CI/CD']
  }
];

export default function TabsContent() {
  const [activeTab, setActiveTab] = useState<'experience' | 'projects'>('experience');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const items = activeTab === 'experience' ? EXPERIENCE_ITEMS : PROJECT_ITEMS;

  return (
    <div className="w-full max-w-3xl mx-auto font-mono select-none">
      {/* ─── TAB TOGGLE HEADER ─── */}
      <div className="flex justify-center gap-6 mb-8 border-b border-white/10 pb-4">
        <button
          onClick={() => {
            setActiveTab('experience');
            setExpandedId(null);
          }}
          className={`text-xs md:text-sm font-bold tracking-widest transition-all pb-2 relative uppercase ${
            activeTab === 'experience' ? 'text-white' : 'text-white/40 hover:text-white'
          }`}
        >
          <span>Experience</span>
          {activeTab === 'experience' && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-neon shadow-[0_0_8px_#00FFA3]"
            />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('projects');
            setExpandedId(null);
          }}
          className={`text-xs md:text-sm font-bold tracking-widest transition-all pb-2 relative uppercase ${
            activeTab === 'projects' ? 'text-white' : 'text-white/40 hover:text-white'
          }`}
        >
          <span>Projects</span>
          {activeTab === 'projects' && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-blue shadow-[0_0_8px_#00B8FF]"
            />
          )}
        </button>
      </div>

      {/* ─── ACCORDION CONTAINER ─── */}
      <div className="flex flex-col gap-4">
        {items.map((item) => {
          const isOpen = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="border border-white/5 rounded-xl bg-studio-900/40 overflow-hidden transition-all duration-300 accordion-panel"
              style={{
                borderColor: isOpen ? `${item.color}40` : 'rgba(255, 255, 255, 0.05)',
                boxShadow: isOpen ? `0 0 15px ${item.color}10` : 'none'
              }}
            >
              {/* Row Header Trigger */}
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.logo ? (
                    <div 
                      className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-1 border border-white/10 shadow-sm"
                      style={{ backgroundColor: item.logoBg || '#ffffff' }}
                    >
                      <img src={item.logo} alt={`${item.title} logo`} className="w-full h-full object-contain" />
                    </div>
                  ) : activeTab === 'experience' ? (
                    <Briefcase size={14} style={{ color: item.color }} />
                  ) : (
                    <Code size={14} style={{ color: item.color }} />
                  )}
                  <div>
                    <h3 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">{item.title}</h3>
                    <span className="text-[10px] text-white/40 mt-0.5 block">{item.subtitle}</span>
                  </div>
                </div>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-white/40"
                >
                  <ChevronDown size={16} />
                </motion.div>
              </button>

              {/* Smooth Drawer Expand */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-2 border-t border-white/5 flex flex-col gap-4">
                      {/* Tech stack badges */}
                      {item.tech && (
                        <div className="flex flex-wrap gap-1.5">
                          {item.tech.map((t) => (
                            <span
                              key={t}
                              className="text-[9px] px-2 py-0.5 rounded-sm border"
                              style={{
                                color: item.color,
                                borderColor: `${item.color}30`,
                                backgroundColor: `${item.color}05`
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Technical bullets */}
                      <ul className="flex flex-col gap-2">
                        {item.bullets.map((b, idx) => (
                          <li key={idx} className="flex gap-2.5 text-[11px] leading-relaxed text-white/70 font-sans">
                            <Circle size={4} className="mt-2 flex-shrink-0" style={{ fill: item.color, color: item.color }} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

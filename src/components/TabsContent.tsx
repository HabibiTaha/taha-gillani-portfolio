import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Briefcase, Code, Circle } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="12"
    height="12"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface AccordionItem {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  bullets: string[];
  tech?: string[];
  logo?: string;
  logoBg?: string;
  github?: string;
  live?: string;
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
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Matter.js', 'Vite'],
    github: 'https://github.com/HabibiTaha/taha-gillani-portfolio',
    live: 'https://tahagillani.vercel.app'
  },
  {
    id: 'proj-2',
    title: 'NPC & Item Management Engine',
    subtitle: 'Modern C++ / OOP / CMake',
    color: '#00FFFF', // Neon Cyan
    logo: '/engine_logo.png',
    logoBg: '#000000',
    bullets: [
      'Developed a modular, high-performance game entity system using modern C++ (C++17/20), emphasizing memory efficiency and cache-friendly data structures.',
      'Implemented the Bridge design pattern to isolate entity representations from their implementation details, decoupling the NPC codebase and enhancing extensibility.',
      'Enforced strict memory management practices including manual pointer operations, customized smart pointers, and RAII principles to completely eliminate memory leaks.',
      'Engineered inventory and item allocation algorithms using STL containers (std::vector, std::unordered_map) optimized for low retrieval latency.',
      'Configured a cross-platform compilation pipeline utilizing CMake build scripting, organizing external dependency management and compiler warning sets.'
    ],
    tech: ['C++', 'OOP', 'Bridge Pattern', 'RAII', 'CMake', 'Memory Management'],
    github: 'https://github.com/HabibiTaha'
  },
  {
    id: 'proj-3',
    title: 'Full-Stack Development (MERN & Cloud)',
    subtitle: 'MERN Stack / Docker / DevOps',
    color: '#FF00FF', // Neon Magenta
    logo: '/cloud_db_logo.png',
    logoBg: '#000000',
    bullets: [
      'Architected scalable full-stack web applications using the MERN stack (MongoDB, Express.js, React, Node.js), writing RESTful API routes and services.',
      'Implemented robust authentication pipelines using JSON Web Tokens (JWT) and encrypted passwords with bcrypt for secure user access.',
      'Containerized application microservices using Docker and Docker Compose, creating consistent localized development environments.',
      'Configured automated CI/CD deployment pipelines using GitHub Actions to coordinate unit testing and production builds.',
      'Deployed and managed cloud server and database instances across AWS (EC2/S3) and Azure App Services, utilizing MongoDB Atlas for cloud persistence.'
    ],
    tech: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Docker', 'AWS', 'Azure', 'CI/CD'],
    github: 'https://github.com/HabibiTaha'
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
    <div className="w-full max-w-5xl mx-auto font-mono select-none">
      {/* ─── TAB TOGGLE HEADER ─── */}
      <div className="flex justify-center gap-8 mb-10 border-b border-white/10 pb-5">
        <button
          onClick={() => {
            setActiveTab('experience');
            setExpandedId(null);
          }}
          className={`text-xs md:text-sm lg:text-base xl:text-lg font-bold tracking-widest transition-all pb-2.5 relative uppercase ${
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
          className={`text-xs md:text-sm lg:text-base xl:text-lg font-bold tracking-widest transition-all pb-2.5 relative uppercase ${
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
      <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
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
                className="w-full text-left px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {item.logo ? (
                    <div 
                      className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-1 border border-white/10 shadow-sm"
                      style={{ backgroundColor: item.logoBg || '#ffffff' }}
                    >
                      <img src={item.logo} alt={`${item.title} logo`} className="w-full h-full object-contain" />
                    </div>
                  ) : activeTab === 'experience' ? (
                    <Briefcase className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" style={{ color: item.color }} />
                  ) : (
                    <Code className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" style={{ color: item.color }} />
                  )}
                  <div>
                    <h3 className="text-xs md:text-sm lg:text-base xl:text-lg font-bold text-white uppercase tracking-wider">{item.title}</h3>
                    <span className="text-[10px] md:text-xs lg:text-sm xl:text-base text-white/40 mt-1 block">{item.subtitle}</span>
                  </div>
                </div>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-white/40"
                >
                  <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
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
                    <div className="px-6 pb-6 pt-3 md:px-8 md:pb-8 border-t border-white/5 flex flex-col gap-5">
                      {/* Tech stack badges */}
                      {item.tech && (
                        <div className="flex flex-wrap gap-2">
                          {item.tech.map((t) => (
                            <span
                              key={t}
                              className="text-[9px] md:text-xs lg:text-sm px-2.5 py-1 md:px-3 md:py-1.5 rounded-md border"
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
                      <ul className="flex flex-col gap-3">
                        {item.bullets.map((b, idx) => (
                          <li key={idx} className="flex gap-3 text-[11px] md:text-sm lg:text-base xl:text-[17px] leading-relaxed lg:leading-loose text-white/70 font-sans">
                            <Circle className="mt-2 flex-shrink-0 w-1.5 h-1.5 md:w-2 md:h-2" style={{ fill: item.color, color: item.color }} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Project Links */}
                      {(item.github || item.live) && (
                        <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
                          {item.github && (
                            <a
                              href={item.github}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2.5 font-mono text-[10px] md:text-xs lg:text-sm px-4 py-2 md:px-5 md:py-2.5 rounded-md border border-white/10 bg-white/2 text-white/60 hover:text-[#00FFFF] hover:border-[#00FFFF]/30 hover:bg-[#00FFFF]/5 transition-all cursor-pointer social-link github"
                            >
                              <GithubIcon className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5" />
                              <span>Check it out on GitHub</span>
                              <span>↗</span>
                            </a>
                          )}
                          {item.live && (
                            <a
                              href={item.live}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 font-mono text-[10px] md:text-xs lg:text-sm px-4 py-2 md:px-5 md:py-2.5 rounded-md border border-white/10 bg-white/2 text-white/60 hover:text-[#00FF00] hover:border-[#00FF00]/30 hover:bg-[#00FF00]/5 transition-all cursor-pointer social-link resume"
                            >
                              <span>Live Site</span>
                              <span>↗</span>
                            </a>
                          )}
                        </div>
                      )}
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

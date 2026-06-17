import { useState, useEffect } from 'react';
import { FileText, Mail, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import CursorTrail from './components/CursorTrail';
import TabsContent from './components/TabsContent';
import PhysicsSkills from './components/PhysicsSkills';
import TypewriterIntro from './components/TypewriterIntro';

// Custom GithubIcon SVG
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    stroke="currentColor"
    strokeWidth="1.8"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Custom LinkedInIcon SVG
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    stroke="currentColor"
    strokeWidth="1.8"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Custom InstagramIcon SVG
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    stroke="currentColor"
    strokeWidth="1.8"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function App() {
  const [zeroGravity, setZeroGravity] = useState(false);
  const [stacked, setStacked] = useState(true);
  const [introCompleted, setIntroCompleted] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  return (
    <div className={`w-full min-h-screen font-mono flex flex-col overflow-x-hidden transition-all duration-1000 ${
      theme === 'dark'
        ? 'bg-black text-white selection:bg-accent-neon/30'
        : 'bg-slate-50 text-slate-900 selection:bg-cyan-200'
    } ${introCompleted ? 'overflow-y-auto' : 'overflow-y-hidden h-screen'}`}>
      
      {/* ─── THEME TOGGLE BUTTON ─── */}
      {introCompleted && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-6 right-6 z-50"
        >
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-3 rounded-full border backdrop-blur-md transition-all duration-300 shadow-lg group flex items-center justify-center cursor-pointer ${
              theme === 'dark'
                ? 'border-white/10 bg-black/40 hover:bg-white/5 hover:border-white/30 text-white shadow-black/50'
                : 'border-slate-200 bg-white/40 hover:bg-slate-100/50 hover:border-slate-300 text-slate-800 shadow-slate-200'
            }`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-[#FFFF00] group-hover:scale-110 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-[#c026d3] group-hover:scale-110 transition-transform" />
            )}
          </button>
        </motion.div>
      )}

      {/* Global Mouse Ribbon Trail */}
      <CursorTrail theme={theme} />

      {/* ─── 1. HERO SECTION (SCROLLABLE INTRO) ─── */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-20 px-6 md:px-12 relative border-b border-white/5">
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-grid bg-repeat" />

        <motion.div
          layout
          className={`max-w-4xl w-full flex flex-col md:flex-row items-center md:items-start z-10 transition-all duration-1000 ${introCompleted ? 'gap-8 md:gap-12' : 'gap-0'}`}
        >
          
          {/* Circular profile image container */}
          <div className={`transition-all duration-1000 ease-out ${introCompleted ? 'scale-100 opacity-100 w-32 h-32 md:w-36 md:h-36 mr-0' : 'scale-0 opacity-0 w-0 h-0 overflow-hidden pointer-events-none'}`}>
            <div className="relative group">
              {/* Cyber glowing halo border */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-300 opacity-60 blur-md group-hover:opacity-100 transition duration-500" />
              <div className={`relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border bg-black transition-all duration-1000 ${
                theme === 'dark' ? 'border-white/20' : 'border-slate-200'
              }`}>
                <img
                  src="/taha.jpg"
                  alt="Taha Gillani Profile"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Intro typography */}
          <div className={`flex-1 flex flex-col justify-between h-full transition-all duration-1000 ${introCompleted ? 'text-center md:text-left' : 'text-center'}`}>

            
            <TypewriterIntro onComplete={() => setIntroCompleted(true)} className={introCompleted ? 'text-center md:text-left' : 'text-center'} />

            {/* Academic & Professional HUD Badges, bio, and social links */}
            <div className={`transition-all duration-1000 delay-300 ${introCompleted ? 'opacity-100 translate-y-0 h-auto mt-6' : 'opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden'}`}>
              
              {/* Academic HUD Badges */}
              <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                <span className="text-[10px] font-mono border border-cyan-400/30 text-cyan-400 bg-cyan-950/20 px-2.5 py-1 rounded-sm shadow-[0_0_8px_rgba(6,182,212,0.15)] academic-badge cs">
                  4th-Year CS @ U of Lethbridge
                </span>
                <span className="text-[10px] font-mono border border-pink-500/30 text-pink-400 bg-pink-950/20 px-2.5 py-1 rounded-sm shadow-[0_0_8px_rgba(236,72,153,0.15)] academic-badge gpa">
                  GPA: 3.8
                </span>
                <span className="text-[10px] font-mono border border-yellow-500/30 text-yellow-400 bg-yellow-950/20 px-2.5 py-1 rounded-sm shadow-[0_0_8px_rgba(234,179,8,0.15)] academic-badge grad">
                  ULeth (2027)
                </span>
              </div>

              <p className="text-xs md:text-sm text-white/50 leading-relaxed max-w-2xl mb-8 font-sans text-left">
                Beyond the code, I'm a developer driven by curiosity, problem-solving, and a love for building things that work. 
                When I'm not coding full-stack applications or designing systems, you can usually find me playing sports, diving into video games, or exploring the latest in technology and finance. 
                I enjoy blending logical engineering with active and creative pursuits. I am actively seeking co-op and internship opportunities for the 2026–2027 terms. If you are a recruiter, please don't hesitate to reach out. I would love to connect to discuss new experiences and learning opportunities!
              </p>

              {/* Clickable Brand & Action Icon Links */}
              <div className="flex justify-center md:justify-start items-center gap-6">
                <a
                  href="https://github.com/HabibiTaha"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link github text-white/40 hover:text-[#00FFFF] transition-all hover:scale-115 hover:shadow-[0_0_15px_#00FFFF] p-2 rounded-lg border border-white/5 hover:border-[#00FFFF]/30 bg-white/2"
                  title="View GitHub Profile"
                >
                  <GithubIcon />
                </a>

                <a
                  href="https://www.linkedin.com/in/taha-gillani/"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link linkedin text-white/40 hover:text-[#FF00FF] transition-all hover:scale-115 hover:shadow-[0_0_15px_#FF00FF] p-2 rounded-lg border border-white/5 hover:border-[#FF00FF]/30 bg-white/2"
                  title="Connect on LinkedIn"
                >
                  <LinkedinIcon />
                </a>

                <a
                  href="https://www.instagram.com/not_gillani/"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link instagram text-white/40 hover:text-[#FFFF00] transition-all hover:scale-115 hover:shadow-[0_0_15px_#FFFF00] p-2 rounded-lg border border-white/5 hover:border-[#FFFF00]/30 bg-white/2"
                  title="Follow on Instagram"
                >
                  <InstagramIcon />
                </a>

                <a
                  href="mailto:taha.gillani@uleth.ca"
                  className="social-link email text-white/40 hover:text-[#FF6B35] transition-all hover:scale-115 hover:shadow-[0_0_15px_#FF6B35] p-2 rounded-lg border border-white/5 hover:border-[#FF6B35]/30 bg-white/2"
                  title="Send Email"
                >
                  <Mail size={22} strokeWidth={1.8} />
                </a>

                <a
                  href="/TAHA_GILLANI_RESUME.pdf"
                  download
                  className="social-link resume text-white/40 hover:text-[#00FF00] transition-all hover:scale-115 hover:shadow-[0_0_15px_#00FF00] p-2 rounded-lg border border-white/5 hover:border-[#00FF00]/30 bg-white/2"
                  title="Download Resume PDF"
                >
                  <FileText size={22} strokeWidth={1.8} />
                </a>
              </div>

            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[9px] text-white/30 tracking-[0.2em] font-mono animate-bounce uppercase transition-all duration-1000 delay-700 ${introCompleted ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}>
          <span>Scroll Down</span>
          <span>↓</span>
        </div>

      </section>

      {/* ─── 2. TABBED CONTENT SECTION (MIDDLE) ─── */}
      <section className={`w-full py-24 px-6 md:px-12 border-b border-white/5 bg-studio-900/10 transition-all duration-1000 ${introCompleted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="max-w-4xl mx-auto flex flex-col items-center">

          <div className="w-full text-left">
            <TabsContent />
          </div>

          {/* Scroll down indicator to sandbox */}
          <div className="flex flex-col items-center gap-2 text-[9px] text-white/30 tracking-[0.2em] font-mono animate-bounce uppercase mt-16">
            <span>Scroll to Skills Sandbox</span>
            <span>↓</span>
          </div>
        </div>
      </section>

      {/* ─── 3. PHYSICS SKILLS CANVAS (BOTTOM) ─── */}
      <section className={`w-full flex flex-col border-b h-[80vh] min-h-[700px] relative transition-all duration-1000 ${
        theme === 'dark' ? 'border-white/5 bg-black' : 'border-slate-200 bg-slate-50'
      } ${introCompleted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>


        {/* Matter.js simulation container */}
        <div className="flex-1 w-full h-full relative">
          <PhysicsSkills
            zeroGravity={zeroGravity}
            onToggleGravity={() => setZeroGravity(!zeroGravity)}
            stacked={stacked}
            onToggleStacked={() => setStacked(!stacked)}
            theme={theme}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className={`w-full py-8 text-center text-[9px] font-mono border-t transition-all duration-1000 ${
        theme === 'dark'
          ? 'text-white/20 border-white/5 bg-black'
          : 'text-slate-500 border-slate-200 bg-slate-50'
      } ${introCompleted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <span>© 2026 Syed Taha Gillani. All rights reserved.</span>
      </footer>

    </div>
  );
}

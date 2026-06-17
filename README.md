# Syed Taha Gillani — Physics Hybrid Portfolio

An interactive, high-performance, single-page developer portfolio dashboard featuring a real-time 2D physics engine sandbox. Built using React, TypeScript, Tailwind CSS, and Matter.js, the site is designed to engage recruiters and showcase technical proficiency in full-stack engineering, low-level systems, and modern visual design.

**Live Deployment URL:** [https://tahagillani.vercel.app](https://tahagillani.vercel.app)

---

## 🚀 Key Features

### 1. Interactive 2D Physics Skill Engine
* **Matter.js Engine**: Interactive 2D canvas containing 36 draggable skill blocks that collide and react realistically to user drag controls.
* **Zero Gravity Toggle**: Simulates outer space environments. Activating zero gravity pushes blocks into floating trajectories with zero air resistance and perfect elastic bounces.
* **Grid Column Stacking**: Organizes the blocks neatly into columns sorted by skill categories (Languages, Frontend, Backend, DevOps, Systems, Tools & AI). Swaps automatically to a 3-column mobile-friendly grid on smaller screens.
* **Boundary Guarding**: Blocks are bounded dynamically to the canvas viewport to prevent clipping or layout overflows.

### 2. Universal Theme Toggle (Light / Dark)
* **Lag-Free Theme Updates**: Uses React state synchronized to a root document namespace to transition theme styles instantly without tearing down or rebuilding the Matter.js physics engine.
* **Color-Safe Rendering**: Bright neons are swapped dynamically for rich, high-contrast equivalents (e.g., Cyan-600, Amber-700, Fuchsia-600) in light mode to preserve accessibility and text readability on white panels.
* **Fixed Header Control**: Premium glassmorphic float toggle button fading in only after the typewriter introduction completes.

### 3. Full-Screen welcome Boot Sequence
* **Scroll Lock**: The landing page is initially scroll-locked and displays only a typewriter prompt, focusing the user's attention.
* **Reveal Animation**: Once the typewriter welcome completes, scroll constraints unlock and elements (profile photo, HUD badges, bio, social actions, tabs, sandbox canvas, footer) slide and fade into view using Framer Motion.

### 4. Custom Mouse Ribbon Trail
* **Responsive Canvas Trail**: Generates a smooth colorful trail behind the mouse pointer.
* **Theme Adaptability**: Changes blend mode (`screen` in dark mode, `multiply` in light mode) and cycles through corresponding high-contrast palettes based on the selected website theme.

### 5. Detailed Projects Drawer
* **Accordion Navigation**: Houses experience and projects lists, highlighting detailed technical contributions and tech stack tags.
* **Call to Action Buttons**: Renders direct buttons to check projects on GitHub (with custom branding) or preview the live site.

---

## 🛠️ Technology Stack

* **Core Framework**: React 19 (TypeScript)
* **Styling**: Tailwind CSS v4, Vanilla CSS
* **Animations**: Framer Motion
* **Physics Engine**: Matter.js
* **Vector Graphics**: Lucide Icons
* **Hosting**: Vercel

---

## 📦 Setup & Development

Follow these steps to run the project locally:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your computer.

### 2. Installation
Clone this repository and install the project dependencies:
```bash
git clone https://github.com/HabibiTaha/taha-gillani-portfolio.git
cd taha-gillani-portfolio
npm install
```

### 3. Run Development Server
Start the Vite local development server:
```bash
npm run dev
```

### 4. Build for Production
Compile and bundle the production files inside the `dist/` directory:
```bash
npm run build
```

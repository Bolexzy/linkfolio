import React from 'react';
import ReactDOM from 'react-dom/client';
import Lenis from '@studio-freight/lenis';
import ScrollTrigger from 'gsap/ScrollTrigger';
import App from './App.jsx';
import './index.css';

// lenis smooth wheel scrolling
const lenis = new Lenis({
  lerp: 0.08,
  smoothWheel: true,
});

lenis.on('scroll', () => {
  ScrollTrigger.update();
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

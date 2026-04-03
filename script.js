const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revisits();
function revisits() {
  reveals.forEach((item) => observer.observe(item));
}

document.querySelectorAll('[data-scroll]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.querySelector(button.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const projectContent = {
  scour: {
    tag: 'Offshore systems',
    title: 'Offshore scour simulations',
    description:
      'Focused on flow acceleration, vortex structures, and sediment response around offshore foundations, linking numerical detail with practical structural relevance.'
  },
  wind: {
    tag: 'Aerodynamics',
    title: 'Wind turbine aerodynamics',
    description:
      'Exploring flow behaviour around energy systems to better understand loading, performance, and the trade-offs embedded in engineering design.'
  },
  multiphase: {
    tag: 'Multiphase CFD',
    title: 'Multiphase CFD modeling',
    description:
      'Building numerical representations of interacting phases and transport processes where interface behaviour and physical interpretation both matter.'
  },
  sdg: {
    tag: 'Innovation',
    title: 'SDG Innovation Accelerator',
    description:
      'Connecting technical work to broader sustainability narratives, innovation culture, and impact-oriented thinking across engineering contexts.'
  }
};

const modal = document.getElementById('project-modal');
const modalTag = document.getElementById('modal-tag');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');

document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('click', () => {
    const content = projectContent[card.dataset.project];
    if (!content) return;
    modalTag.textContent = content.tag;
    modalTitle.textContent = content.title;
    modalDescription.textContent = content.description;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

document.querySelectorAll('[data-close-modal]').forEach((item) => {
  item.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

const heroCanvas = document.getElementById('hero-canvas');
const heroCtx = heroCanvas.getContext('2d');
let particles = [];

function resizeHeroCanvas() {
  heroCanvas.width = window.innerWidth * devicePixelRatio;
  heroCanvas.height = window.innerHeight * devicePixelRatio;
  heroCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  createParticles();
}

function createParticles() {
  const count = Math.max(36, Math.floor(window.innerWidth / 28));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.8 + 0.6,
    speed: Math.random() * 0.28 + 0.08,
    drift: (Math.random() - 0.5) * 0.16
  }));
}

function animateHeroBackground() {
  heroCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const gradient = heroCtx.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);
  gradient.addColorStop(0, 'rgba(96, 171, 255, 0.08)');
  gradient.addColorStop(1, 'rgba(145, 228, 218, 0.03)');
  heroCtx.fillStyle = gradient;
  heroCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  heroCtx.strokeStyle = 'rgba(146, 196, 255, 0.11)';
  heroCtx.lineWidth = 1;
  for (let layer = 0; layer < 4; layer += 1) {
    heroCtx.beginPath();
    for (let x = 0; x <= window.innerWidth; x += 8) {
      const y =
        window.innerHeight * (0.56 + layer * 0.08) +
        Math.sin(x * 0.007 + performance.now() * 0.00045 + layer) * (16 + layer * 6);
      if (x === 0) heroCtx.moveTo(x, y);
      else heroCtx.lineTo(x, y);
    }
    heroCtx.stroke();
  }

  particles.forEach((particle) => {
    particle.y -= particle.speed;
    particle.x += Math.sin(performance.now() * 0.0003 + particle.y * 0.01) * particle.drift;
    if (particle.y < -12) {
      particle.y = window.innerHeight + 12;
      particle.x = Math.random() * window.innerWidth;
    }
    heroCtx.beginPath();
    heroCtx.fillStyle = 'rgba(187, 219, 255, 0.42)';
    heroCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    heroCtx.fill();
  });

  requestAnimationFrame(animateHeroBackground);
}

resizeHeroCanvas();
animateHeroBackground();
window.addEventListener('resize', resizeHeroCanvas);

const signalCanvas = document.getElementById('signal-canvas');
const signalCtx = signalCanvas.getContext('2d');
const chartButtons = document.querySelectorAll('.chart-btn');
let chartMode = 'wave';
let animationFrame = 0;

chartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    chartButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    chartMode = button.dataset.mode;
    drawSignal();
  });
});

function drawSignal() {
  const width = signalCanvas.width;
  const height = signalCanvas.height;
  signalCtx.clearRect(0, 0, width, height);

  const bg = signalCtx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, 'rgba(11, 27, 46, 0.95)');
  bg.addColorStop(1, 'rgba(7, 17, 31, 1)');
  signalCtx.fillStyle = bg;
  signalCtx.fillRect(0, 0, width, height);

  signalCtx.strokeStyle = 'rgba(159, 178, 204, 0.16)';
  signalCtx.lineWidth = 1;
  for (let i = 1; i < 6; i += 1) {
    const y = (height / 6) * i;
    signalCtx.beginPath();
    signalCtx.moveTo(0, y);
    signalCtx.lineTo(width, y);
    signalCtx.stroke();
  }

  signalCtx.beginPath();
  signalCtx.lineWidth = 3;
  signalCtx.strokeStyle = chartMode === 'wave' ? '#8ec6ff' : '#91e4da';

  for (let x = 0; x <= width; x += 3) {
    let y;
    if (chartMode === 'wave') {
      y =
        height * 0.52 +
        Math.sin(x * 0.015 + animationFrame * 0.06) * 34 +
        Math.sin(x * 0.042 - animationFrame * 0.03) * 12;
    } else {
      const eta = x / width;
      const profile = 1 - Math.pow(eta - 0.12, 2.2);
      y = height - Math.max(0.12, profile) * (height * 0.72) + Math.sin(animationFrame * 0.04 + x * 0.018) * 4;
    }

    if (x === 0) signalCtx.moveTo(x, y);
    else signalCtx.lineTo(x, y);
  }
  signalCtx.stroke();

  signalCtx.fillStyle = 'rgba(255,255,255,0.7)';
  signalCtx.font = '16px Inter';
  signalCtx.fillText(chartMode === 'wave' ? 'Free-surface inspired signal' : 'Velocity-profile inspired trace', 24, 34);
}

function animateSignal() {
  animationFrame += 1;
  drawSignal();
  requestAnimationFrame(animateSignal);
}

animateSignal();

'use strict';

const publicationTools = document.querySelector('.publication-tools');
const publications = [...document.querySelectorAll('.publication')];

if (publicationTools && publications.length) {
  const filterButtons = [...publicationTools.querySelectorAll('[data-filter]')];
  const status = publicationTools.querySelector('[role="status"]');
  const labels = {
    all: ['selected work', 'selected works'],
    journal: ['journal article', 'journal articles'],
    conference: ['conference contribution', 'conference contributions'],
    thesis: ['thesis', 'theses'],
  };

  const filterPublications = (kind) => {
    let visible = 0;
    publications.forEach((publication) => {
      const matches = kind === 'all' || publication.dataset.kind === kind;
      publication.hidden = !matches;
      if (matches) visible += 1;
    });
    filterButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === kind));
    });
    status.textContent = `${visible} ${labels[kind][visible === 1 ? 0 : 1]}`;
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => filterPublications(button.dataset.filter));
  });
  filterPublications('all');
  publicationTools.hidden = false;
}


const menuToggle = document.querySelector('.menu-toggle');
const mainNavigation = document.getElementById('main-nav');

if (menuToggle && mainNavigation) {
  document.body.classList.add('nav-ready');

  const closeNavigation = () => {
    mainNavigation.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    mainNavigation.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  mainNavigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeNavigation();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeNavigation();
      menuToggle.focus();
    }
  });

  window.matchMedia('(max-width: 760px)').addEventListener('change', closeNavigation);
}

/** Every local URL includes the GitHub Pages project base. */
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const local = (path = '') => `${base}/${path.replace(/^\/+/, '')}`;

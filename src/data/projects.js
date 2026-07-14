// ============================================================
//  PROJECTS — the data lives in projects.json so the admin page
//  (/admin.html) can manage it: add/edit/delete projects, upload
//  screenshots, and commit straight to the repo. You can still
//  edit projects.json by hand — same shape as before:
//
//  category: 'ml' | 'fullstack' | 'other'
//  featured: true  → full-width block in the work showcase
//  hue: 0-360      → tint for the placeholder cover art
//  images: ['projects/<id>/1.webp', ...] in public/
// ============================================================

import projectsData from './projects.json';

export const projects = projectsData;

export const categories = {
  ml: 'ML / AI',
  fullstack: 'Full-Stack',
  other: 'Other',
};

// ============================================================
//  SITE CONTENT — edit this file to change anything on the site.
//  No layout code needs to change. Save and the site rebuilds.
// ============================================================

export const site = {
  // ---- identity -------------------------------------------------
  firstName: 'AHMED',
  lastName: 'KHALED',
  title: 'Machine Learning Engineer',
  tagline:
    'I build end-to-end ML systems — from raw data to deployed models — and the full-stack apps that put them in people’s hands.',
  eyebrow: '// ml engineer — portfolio v1.0',
  location: 'Egypt · UTC+2',
  status: 'open to work', // shown in the nav pill

  // ---- theme ----------------------------------------------------
  // Change the accent once here and the whole site follows.
  accent: '#e10600',

  // ---- contact --------------------------------------------------
  email: 'kemostar97@gmail.com',
  socials: [
    { label: 'GitHub', short: 'gh', url: 'https://github.com/01End' },
    { label: 'LinkedIn', short: 'in', url: '#' }, // ← put your LinkedIn URL here
  ],

  // Drop your CV at public/cv/Ahmed-Khaled-CV.pdf then set this
  // to 'cv/Ahmed-Khaled-CV.pdf' — the button appears automatically.
  cvUrl: null,

  // ---- about ----------------------------------------------------
  about: [
    'I’m Ahmed — a machine learning engineer who likes owning the whole pipeline: framing the problem, wrangling the data, training and evaluating models, and shipping them as real applications people can use.',
    'My work spans classical ML, deep learning, and retrieval-augmented generation — plus the full-stack engineering (React, Node, Firebase) needed to wrap models in products.',
    'When a model ships, I care about the boring-but-critical parts too: leakage checks, monotonicity constraints, tests, and honest evaluation.',
  ],

  stats: [
    { value: 10, suffix: '+', label: 'projects built end-to-end' },
    { value: 6, suffix: '', label: 'ML pipelines shipped' },
    { value: 3, suffix: '+', label: 'years writing code' },
  ],

  // ---- skills ---------------------------------------------------
  skillGroups: [
    {
      name: 'ML / AI',
      tag: 'core',
      skills: [
        'Python', 'Pandas', 'NumPy', 'scikit-learn',
        'TensorFlow / Keras', 'XGBoost', 'RAG & LLMs', 'Streamlit',
      ],
    },
    {
      name: 'Full-Stack',
      tag: 'product',
      skills: [
        'JavaScript', 'React', 'Node.js', 'Firebase',
        'HTML / CSS', 'SQL / PostgreSQL', 'REST APIs', 'PWA',
      ],
    },
    {
      name: 'Practice',
      tag: 'craft',
      skills: [
        'Git', 'Docker', 'Pytest', 'Jupyter',
        'Data Viz', 'MLOps', 'Feature Engineering', 'Model Evaluation',
      ],
    },
  ],

  footerNote: 'designed & built from scratch',
};

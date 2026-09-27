export const site = {
  name: 'Nishchay Tiwari',
  role: 'Computational scientist',
  description: 'Computational scientist working across fluid dynamics, Python and machine learning. Explore numerical experiments, black-box optimisation and published research by Nishchay Tiwari.',
  email: 'tiwarinishchay1@gmail.com',
  location: 'Oxfordshire, UK',
  socials: [
    {label: 'GitHub', url: 'https://github.com/nishchayoxford', icon: 'github'},
    {label: 'LinkedIn', url: 'https://www.linkedin.com/in/nishchay-tiwari-000001/', icon: 'linkedin'},
    {label: 'ResearchGate', url: 'https://www.researchgate.net/profile/Nishchay-Tiwari-2', icon: 'researchgate'},
  ],
} as const;
export const nav = [
  {label: 'work', id: 'projects'},
  {label: 'background', id: 'about'},
  {label: 'experience', id: 'experience'},
  {label: 'publications', id: 'publications'},
  {label: 'contact', id: 'contact'},
] as const;
export const expertise = [
  {title: 'Scientific computing', detail: 'Python · C++ · NumPy · parallel workflows', description: 'From governing equations to repeatable numerical experiments.'},
  {title: 'Machine learning & AI', detail: 'scikit-learn · Gaussian processes · Bayesian optimisation', description: 'Surrogate models and sequential decisions when observations are scarce.'},
  {title: 'Computational fluid dynamics', detail: 'OpenFOAM · RANS / LES · multiphase flow', description: 'Physical modelling, sensitivity analysis and experimental validation.'},
] as const;
export const experience = [
  {company: 'HR Wallingford', shortName: 'HRW', url: 'https://www.hrwallingford.com/', role: 'Research Scientist', period: 'Nov 2023 – present', location: 'United Kingdom', start: '2023-11', end: null,
   bullets: ['Model sediment transport and local scour using Eulerian multiphase CFD in OpenFOAM.', 'Compare numerical predictions with laboratory flume measurements, examining time-dependent behaviour and sensitivity to geometry and forcing.']},
  {company: 'University of Patras', shortName: 'Patras', url: 'https://www.upatras.gr/en/', role: 'Visiting Researcher', period: 'Jul – Aug 2025', location: 'Greece', start: '2025-07', end: '2025-09',
   bullets: ['Investigated wave–current interactions and sediment-driven scour using three-phase Eulerian modelling.', 'Tested numerical predictions against laboratory flume data.']},
  {company: 'Institute of Fluid-Flow Machinery, Polish Academy of Sciences', shortName: 'IMP-PAN', url: 'https://www.imp.gda.pl/en/', role: 'Aerodynamics Researcher', period: 'Sep 2020 – Sep 2023', location: 'Poland', start: '2020-09', end: '2023-10',
   bullets: ['Investigated rod and vane vortex generators for wind-turbine airfoils using RANS and LES in OpenFOAM.', 'Validated predictions against TU Delft wind-tunnel data and collaborated on urban-flow modelling and aerodynamic optimisation.']},
  {company: 'von Karman Institute for Fluid Dynamics', shortName: 'VKI', url: 'https://www.vki.ac.be/', role: 'Visiting Researcher', period: 'Jul – Aug 2022', location: 'Belgium', start: '2022-07', end: '2022-09',
   bullets: ['Used high-fidelity large-eddy simulation to investigate airfoil–wind-tunnel interactions.', 'Examined how facility–model coupling affects the measured and simulated flow.']},
  {company: 'Kamstrup', shortName: 'Kamstrup', url: 'https://www.kamstrup.com/', role: 'Fluid Dynamics Research Intern', period: 'Sep 2019 – Mar 2020', location: 'Denmark', start: '2019-09', end: '2020-04',
   bullets: ['Automated flow-meter geometry calculations across inflow configurations.', 'Collected laser Doppler velocimetry measurements and compared experimental data with OpenFOAM predictions.']},
];
export const education = [
  {degree: 'PhD research', institution: 'The Open University · HR Wallingford', period: '2024 – present', detail: 'Multiphase numerical modelling of scour processes in wave-current environments. Doctoral candidate.'},
  {degree: 'MSc, Aeronautical Engineering', institution: 'Politecnico di Milano', period: '2016 – 2019', detail: 'CFD and conjugate heat transfer in a dimpled micro-plate heat exchanger.'},
  {degree: 'BTech, Aerospace Engineering', institution: 'UPES', period: '2012 – 2016', detail: 'Aerodynamics, propulsion and flight mechanics.'},
];

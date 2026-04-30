export interface Formula {
  name: string;
  latex: string;
}

export interface Topic {
  id: string;
  name: string;
  questions: number; // estimated average questions in past 10 years
  level: 'Easy' | 'Intermediate' | 'Hard';
  subtopics: string[];
  formulas: Formula[];
}

// ── SHARED TOPICS (Where syllabi overlap significantly) ──
const PHYSICS_SHARED: Topic[] = [
  {
    id: 'p-thermo', name: 'Thermodynamics', questions: 25, level: 'Intermediate',
    subtopics: ['First Law of Thermodynamics', 'Carnot Engine', 'Entropy'],
    formulas: [
      { name: 'First Law', latex: '\\Delta U = Q - W' },
      { name: 'Ideal Gas Law', latex: 'PV = nRT' },
      { name: 'Gibbs Free Energy', latex: '\\Delta G = \\Delta H - T\\Delta S' },
      { name: 'Efficiency of Carnot Engine', latex: '\\eta = 1 - \\frac{T_2}{T_1}' }
    ]
  },
  {
    id: 'p-wep', name: 'Work, Energy & Power', questions: 20, level: 'Easy',
    subtopics: ['Work-Energy Theorem', 'Conservation of Energy', 'Collisions'],
    formulas: [
      { name: 'Work Done', latex: 'W = F \\cdot d \\cos\\theta' },
      { name: 'Kinetic Energy', latex: 'KE = \\frac{1}{2}mv^2' },
      { name: 'Power', latex: 'P = \\frac{W}{t} = F \\cdot v' }
    ]
  },
  {
    id: 'p-curr', name: 'Current Electricity', questions: 28, level: 'Intermediate',
    subtopics: ["Ohm's Law", 'Kirchhoff’s Laws', 'Wheatstone Bridge'],
    formulas: [
      { name: "Ohm's Law", latex: 'V = IR' },
      { name: 'Power', latex: 'P = VI = I^2 R = \\frac{V^2}{R}' },
      { name: 'Resistance in Series', latex: 'R_{eq} = R_1 + R_2 + ...' }
    ]
  },
  {
    id: 'p-optics', name: 'Ray Optics', questions: 22, level: 'Hard',
    subtopics: ['Mirror Formula', 'Lens Maker’s Formula', 'Prism'],
    formulas: [
      { name: 'Lens Formula', latex: '\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}' },
      { name: 'Mirror Formula', latex: '\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}' },
      { name: 'Magnification', latex: 'm = \\frac{h_i}{h_o} = \\frac{v}{u}' }
    ]
  }
];

const CHEMISTRY_SHARED: Topic[] = [
  {
    id: 'c-atomic', name: 'Atomic Structure', questions: 18, level: 'Intermediate',
    subtopics: ['Bohr Model', 'Quantum Numbers', 'De Broglie Equation'],
    formulas: [
      { name: 'Energy of Orbit', latex: 'E_n = -13.6 \\frac{Z^2}{n^2} \\text{ eV}' },
      { name: 'De Broglie Wavelength', latex: '\\lambda = \\frac{h}{p} = \\frac{h}{mv}' },
      { name: 'Heisenberg Uncertainty', latex: '\\Delta x \\cdot \\Delta p \\geq \\frac{h}{4\\pi}' }
    ]
  },
  {
    id: 'c-coord', name: 'Coordination Compounds', questions: 22, level: 'Hard',
    subtopics: ['IUPAC Nomenclature', 'Isomerism', 'Crystal Field Theory'],
    formulas: [
      { name: 'Effective Atomic Number', latex: 'EAN = Z - X + 2L' },
      { name: 'Crystal Field Splitting', latex: '\\Delta_o = 10 Dq' }
    ]
  },
  {
    id: 'c-mole', name: 'Mole Concept & Solutions', questions: 20, level: 'Easy',
    subtopics: ['Molarity & Molality', 'Colligative Properties', 'Raoult’s Law'],
    formulas: [
      { name: 'Number of Moles', latex: 'n = \\frac{\\text{mass}}{\\text{Molar Mass}}' },
      { name: 'Molarity', latex: 'M = \\frac{\\text{moles of solute}}{\\text{Volume (L)}}' },
      { name: 'Elevation of Boiling Point', latex: '\\Delta T_b = K_b \\cdot m' }
    ]
  }
];

// ── STATE SPECIFIC TOPICS ──

export const AP_DATA: Record<string, Topic[]> = {
  Mathematics: [
    {
      id: 'apm-int', name: 'Integration', questions: 35, level: 'Hard',
      subtopics: ['Indefinite Integrals', 'Integration by Parts', 'Substitution'],
      formulas: [
        { name: 'Power Rule', latex: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C' },
        { name: 'Integration by Parts', latex: '\\int u \\, dv = uv - \\int v \\, du' },
        { name: 'Standard Form 1', latex: '\\int e^x(f(x) + f\'(x)) dx = e^x f(x) + C' }
      ]
    },
    {
      id: 'apm-mat', name: 'Matrices & Determinants', questions: 25, level: 'Easy',
      subtopics: ['Properties of Determinants', 'Inverse of Matrix', 'Cramer’s Rule'],
      formulas: [
        { name: 'Inverse', latex: 'A^{-1} = \\frac{1}{|A|} \\text{adj}(A)' },
        { name: 'Properties', latex: '|AB| = |A||B|' }
      ]
    },
    {
      id: 'apm-geom', name: '2D Geometry & Lines', questions: 28, level: 'Intermediate',
      subtopics: ['Distance Formula', 'Straight Lines', 'Section Formula'],
      formulas: [
        { name: 'Distance', latex: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}' },
        { name: 'Line Equation', latex: 'y - y_1 = m(x - x_1)' }
      ]
    }
  ],
  Physics: PHYSICS_SHARED,
  Chemistry: CHEMISTRY_SHARED
};

export const TS_DATA: Record<string, Topic[]> = {
  Mathematics: [
    {
      id: 'tsm-comp', name: 'Complex Numbers', questions: 30, level: 'Hard',
      subtopics: ['De Moivre’s Theorem', 'Roots of Unity', 'Locus Problems'],
      formulas: [
        { name: 'Imaginary Unit', latex: 'i^2 = -1' },
        { name: 'Modulus', latex: '|z| = \\sqrt{a^2 + b^2}' },
        { name: 'Euler Form', latex: 'z = r e^{i\\theta} = r(\\cos\\theta + i\\sin\\theta)' }
      ]
    },
    {
      id: 'tsm-prob', name: 'Probability', questions: 28, level: 'Intermediate',
      subtopics: ['Conditional Probability', 'Bayes Theorem', 'Random Variables'],
      formulas: [
        { name: 'Basic Probability', latex: 'P(A) = \\frac{n(A)}{n(S)}' },
        { name: 'Conditional', latex: 'P(A|B) = \\frac{P(A \\cap B)}{P(B)}' },
        { name: 'Independent Events', latex: 'P(A \\cap B) = P(A) \\cdot P(B)' }
      ]
    },
    {
      id: 'tsm-quad', name: 'Quadratic Expressions', questions: 22, level: 'Easy',
      subtopics: ['Roots of Equations', 'Nature of Roots', 'Maximum/Minimum Value'],
      formulas: [
        { name: 'Roots', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
        { name: 'Sum of Roots', latex: '\\alpha + \\beta = -\\frac{b}{a}' },
        { name: 'Product of Roots', latex: '\\alpha \\beta = \\frac{c}{a}' }
      ]
    }
  ],
  Physics: PHYSICS_SHARED,
  Chemistry: CHEMISTRY_SHARED
};

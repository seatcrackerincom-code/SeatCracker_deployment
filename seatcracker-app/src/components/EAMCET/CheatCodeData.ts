export interface Formula {
  name: string;
  latex: string;
  hint: string;
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
    subtopics: ['First Law of Thermodynamics', 'Carnot Engine', 'Entropy', 'Isothermal & Adiabatic Processes'],
    formulas: [
      { 
        name: 'First Law', 
        latex: '\\Delta Q = \\Delta U + \\Delta W',
        hint: 'Use this when heat is supplied or work is done. Remember sign convention: +Q if heat is added, +W if gas expands.'
      },
      { 
        name: 'Work Done (Isothermal)', 
        latex: 'W = nRT \\ln\\left(\\frac{V_2}{V_1}\\right)',
        hint: 'Apply when temperature is constant (\\(\\Delta T = 0\\)). If volume doubles, work is proportional to \\(\\ln(2)\\).'
      },
      { 
        name: 'Adiabatic Relation', 
        latex: 'PV^\\gamma = \\text{constant}',
        hint: 'Use for sudden compression/expansion problems where no heat is exchanged (\\(\\Delta Q = 0\\)).'
      },
      { 
        name: 'Efficiency of Carnot Engine', 
        latex: '\\eta = 1 - \\frac{T_2}{T_1}',
        hint: 'Always convert temperatures \\(T_1\\) (source) and \\(T_2\\) (sink) to Kelvin before calculating!'
      }
    ]
  },
  {
    id: 'p-wep', name: 'Work, Energy & Power', questions: 20, level: 'Easy',
    subtopics: ['Work-Energy Theorem', 'Conservation of Energy', 'Collisions in 1D/2D'],
    formulas: [
      { 
        name: 'Work-Energy Theorem', 
        latex: 'W_{net} = \\Delta KE',
        hint: 'Ultimate cheat: If forces are complex or variable, just find the change in velocity (\\(v_f^2 - v_i^2\\)).'
      },
      { 
        name: 'Coefficient of Restitution', 
        latex: 'e = \\frac{v_2 - v_1}{u_1 - u_2}',
        hint: 'Use \\(e=1\\) for elastic, \\(e=0\\) for perfectly inelastic. Always used alongside momentum conservation.'
      },
      { 
        name: 'Power of a Pump', 
        latex: 'P = \\frac{mgh}{t} + \\frac{1}{2}\\frac{mv^2}{t}',
        hint: 'Standard EAMCET question: Water pumped from a well. Don\'t forget to add kinetic energy if water is ejected with velocity!'
      }
    ]
  },
  {
    id: 'p-curr', name: 'Current Electricity', questions: 28, level: 'Intermediate',
    subtopics: ["Ohm's Law", 'Kirchhoff’s Laws', 'Wheatstone Bridge', 'Potentiometer'],
    formulas: [
      { 
        name: 'Drift Velocity', 
        latex: 'v_d = \\frac{I}{neA}',
        hint: 'Direct formula application. Remember \\(n\\) is number density, not total number of electrons.'
      },
      { 
        name: 'Wheatstone Bridge Balance', 
        latex: '\\frac{P}{Q} = \\frac{R}{S}',
        hint: 'If you see a complex resistor diamond, check if cross-products match. If yes, remove the middle resistor!'
      },
      { 
        name: 'Internal Resistance (Potentiometer)', 
        latex: 'r = R \\left( \\frac{l_1}{l_2} - 1 \\right)',
        hint: 'Guaranteed question type. \\(l_1\\) is balancing length without shunt, \\(l_2\\) is with shunt \\(R\\).'
      }
    ]
  },
  {
    id: 'p-optics', name: 'Ray Optics', questions: 22, level: 'Hard',
    subtopics: ['Mirror Formula', 'Lens Maker’s Formula', 'Prism', 'Optical Instruments'],
    formulas: [
      { 
        name: 'Lens Maker’s Formula', 
        latex: '\\frac{1}{f} = (\\mu - 1) \\left( \\frac{1}{R_1} - \\frac{1}{R_2} \\right)',
        hint: 'Sign convention is key! For convex, \\(R_1\\) is +, \\(R_2\\) is -. If immersed in liquid, use relative refractive index \\(\\mu_{lens}/\\mu_{liquid}\\).'
      },
      { 
        name: 'Refractive Index of Prism', 
        latex: '\\mu = \\frac{\\sin\\left(\\frac{A+\\delta_m}{2}\\right)}{\\sin\\left(\\frac{A}{2}\\right)}',
        hint: 'Used when angle of minimum deviation (\\(\\delta_m\\)) is given. If prism is thin, use \\(\\delta = (\\mu-1)A\\).'
      },
      { 
        name: 'Magnifying Power (Microscope)', 
        latex: 'm = 1 + \\frac{D}{f}',
        hint: 'Applies when final image is at near point (\\(D=25\\text{cm}\\)). If at infinity, it’s just \\(D/f\\).'
      }
    ]
  }
];

const CHEMISTRY_SHARED: Topic[] = [
  {
    id: 'c-atomic', name: 'Atomic Structure', questions: 18, level: 'Intermediate',
    subtopics: ['Bohr Model', 'Quantum Numbers', 'De Broglie & Heisenberg'],
    formulas: [
      { 
        name: 'Radius of nth Orbit', 
        latex: 'r_n = 0.529 \\frac{n^2}{Z} \\text{ \\AA}',
        hint: 'Radius is proportional to \\(n^2\\). If they ask ratio of 1st to 2nd orbit, it is always 1:4.'
      },
      { 
        name: 'Energy of Electron', 
        latex: 'E_n = -13.6 \\frac{Z^2}{n^2} \\text{ eV}',
        hint: 'Energy is negative. Higher \\(n\\) means less negative (higher energy). Ionization energy is exactly \\(+13.6 Z^2/n^2\\).'
      },
      { 
        name: 'Rydberg Equation', 
        latex: '\\frac{1}{\\lambda} = R_H Z^2 \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right)',
        hint: 'For shortest wavelength, \\(n_2 = \\infty\\). For longest, \\(n_2 = n_1 + 1\\). Very common calculation.'
      }
    ]
  },
  {
    id: 'c-coord', name: 'Coordination Compounds', questions: 22, level: 'Hard',
    subtopics: ['IUPAC Nomenclature', 'Isomerism', 'Crystal Field Theory'],
    formulas: [
      { 
        name: 'Effective Atomic Number (EAN)', 
        latex: 'EAN = Z - \\text{Ox. State} + 2(\\text{Coordination No.})',
        hint: 'Calculate this to check stability. Stable complexes usually have EAN equal to the next noble gas (36, 54, 86).'
      },
      { 
        name: 'Magnetic Moment', 
        latex: '\\mu = \\sqrt{n(n+2)} \\text{ B.M.}',
        hint: 'If \\(n\\) (unpaired electrons) is 1, \\(\\mu \\approx 1.73\\). If \\(n=2\\), \\(\\mu \\approx 2.83\\). The decimal is roughly \\(n.8\\) or \\(n.9\\).'
      },
      { 
        name: 'Crystal Field Stabilization Energy', 
        latex: 'CFSE = (-0.4 t_{2g} + 0.6 e_g)\\Delta_o',
        hint: 'Strong field ligands (CN⁻, CO) force pairing. Weak field ligands (Halogens) do not pair.'
      }
    ]
  },
  {
    id: 'c-mole', name: 'Mole Concept & Solutions', questions: 20, level: 'Easy',
    subtopics: ['Molarity & Molality', 'Colligative Properties', 'Raoult’s Law'],
    formulas: [
      { 
        name: 'Molarity Mixture Formula', 
        latex: 'M_{mix} = \\frac{M_1 V_1 + M_2 V_2}{V_1 + V_2}',
        hint: 'Use this when mixing two solutions of the SAME substance. If reacting (acid+base), use \\(M_1 V_1 - M_2 V_2\\).'
      },
      { 
        name: 'Elevation of Boiling Point', 
        latex: '\\Delta T_b = i \\cdot K_b \\cdot m',
        hint: 'Never forget the Van\'t Hoff factor \\(i\\)! For NaCl, \\(i=2\\). For glucose, \\(i=1\\).'
      },
      { 
        name: 'Osmotic Pressure', 
        latex: '\\pi = iCRT',
        hint: 'Make sure Temperature is in Kelvin and Volume is in Liters.'
      }
    ]
  }
];

// ── STATE SPECIFIC TOPICS ──

export const AP_DATA: Record<string, Topic[]> = {
  Mathematics: [
    {
      id: 'apm-int', name: 'Integration', questions: 35, level: 'Hard',
      subtopics: ['Indefinite Integrals', 'Integration by Parts', 'Substitution', 'Partial Fractions'],
      formulas: [
        { 
          name: 'Integration by Parts', 
          latex: '\\int u \\, dv = uv - \\int v \\, du',
          hint: 'Use the ILATE rule to choose \\(u\\). Inverse Trig > Log > Algebraic > Trig > Exponential.'
        },
        { 
          name: 'Magic Form 1', 
          latex: '\\int e^x[f(x) + f\'(x)] dx = e^x f(x) + C',
          hint: 'Instantly scan for this if you see \\(e^x\\) multiplying a bracket. It saves 3 minutes of calculation!'
        },
        { 
          name: 'Standard Quadratic Denominator', 
          latex: '\\int \\frac{dx}{x^2 + a^2} = \\frac{1}{a} \\tan^{-1}\\left(\\frac{x}{a}\\right) + C',
          hint: 'Complete the square first if the denominator is of form \\(ax^2 + bx + c\\).'
        }
      ]
    },
    {
      id: 'apm-mat', name: 'Matrices & Determinants', questions: 25, level: 'Easy',
      subtopics: ['Properties of Determinants', 'Inverse of Matrix', 'Cramer’s Rule', 'System of Equations'],
      formulas: [
        { 
          name: 'Inverse of 2x2 Trick', 
          latex: 'A^{-1} = \\frac{1}{ad-bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}',
          hint: 'Swap primary diagonal elements, change signs of secondary diagonal elements. Done in 5 seconds.'
        },
        { 
          name: 'Determinant of Adjoint', 
          latex: '|\\text{adj}(A)| = |A|^{n-1}',
          hint: 'Extremely high probability question. For a 3x3 matrix, \\(|\\text{adj}(A)| = |A|^2\\).'
        },
        { 
          name: 'Consistency of Equations', 
          latex: '\\Delta = 0 \\text{ and } (\\Delta_x, \\Delta_y, \\Delta_z \\neq 0)',
          hint: 'This means the system has NO solution (inconsistent). If all deltas are 0, infinite solutions.'
        }
      ]
    },
    {
      id: 'apm-geom', name: '2D Geometry & Lines', questions: 28, level: 'Intermediate',
      subtopics: ['Distance Formula', 'Straight Lines', 'Perpendicular Distance', 'Concurrency'],
      formulas: [
        { 
          name: 'Perpendicular Distance', 
          latex: 'd = \\frac{|ax_1 + by_1 + c|}{\\sqrt{a^2 + b^2}}',
          hint: 'Used to find the radius of a circle if a line is tangent to it.'
        },
        { 
          name: 'Angle Between Two Lines', 
          latex: '\\tan\\theta = \\left| \\frac{m_1 - m_2}{1 + m_1 m_2} \\right|',
          hint: 'If lines are parallel, \\(m_1 = m_2\\). If perpendicular, \\(m_1 m_2 = -1\\).'
        },
        { 
          name: 'Image of a Point', 
          latex: '\\frac{h-x_1}{a} = \\frac{k-y_1}{b} = \\frac{-2(ax_1+by_1+c)}{a^2+b^2}',
          hint: 'Direct cheat code for finding image of a point \\((x_1, y_1)\\) across line \\(ax+by+c=0\\). Do not solve intersections manually!'
        }
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
      subtopics: ['De Moivre’s Theorem', 'Roots of Unity', 'Locus Problems', 'Modulus & Amplitude'],
      formulas: [
        { 
          name: 'Cube Roots of Unity', 
          latex: '1 + \\omega + \\omega^2 = 0 \\quad \\text{and} \\quad \\omega^3 = 1',
          hint: 'If you see huge powers like \\(\\omega^{2024}\\), just divide the power by 3 and use the remainder.'
        },
        { 
          name: 'De Moivre’s Theorem', 
          latex: '(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)',
          hint: 'Only applies if the format is strictly \\(\\cos + i\\sin\\). If it is \\(\\sin + i\\cos\\), factor out \\(i\\) first!'
        },
        { 
          name: 'Triangle Inequality', 
          latex: '||z_1| - |z_2|| \\leq |z_1 + z_2| \\leq |z_1| + |z_2|',
          hint: 'Standard for finding Maximum and Minimum values of complex functions.'
        }
      ]
    },
    {
      id: 'tsm-prob', name: 'Probability', questions: 28, level: 'Intermediate',
      subtopics: ['Conditional Probability', 'Bayes Theorem', 'Random Variables', 'Binomial Distribution'],
      formulas: [
        { 
          name: 'Addition Theorem', 
          latex: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
          hint: 'Use Venn diagrams for these questions to avoid double-counting.'
        },
        { 
          name: 'Bayes Theorem', 
          latex: 'P(E_i|A) = \\frac{P(E_i)P(A|E_i)}{\\Sigma P(E_j)P(A|E_j)}',
          hint: 'Look for "what is the probability it was drawn from Bag A". Numerator is the specific path, denominator is total paths.'
        },
        { 
          name: 'Binomial Distribution', 
          latex: 'P(X = r) = \\binom{n}{r} p^r q^{n-r}',
          hint: 'Mean = \\(np\\), Variance = \\(npq\\). Standard trick: \\(p+q=1\\).'
        }
      ]
    },
    {
      id: 'tsm-quad', name: 'Quadratic Expressions', questions: 22, level: 'Easy',
      subtopics: ['Roots of Equations', 'Nature of Roots', 'Maximum/Minimum Value', 'Common Roots'],
      formulas: [
        { 
          name: 'Sum & Product of Roots', 
          latex: '\\alpha + \\beta = -\\frac{b}{a}, \\quad \\alpha \\beta = \\frac{c}{a}',
          hint: 'If roots are symmetric expressions like \\(\\alpha^2 + \\beta^2\\), rewrite as \\((\\alpha+\\beta)^2 - 2\\alpha\\beta\\).'
        },
        { 
          name: 'Max/Min Value', 
          latex: '\\text{Min/Max} = \\frac{4ac - b^2}{4a} \\quad \\text{at } x = -\\frac{b}{2a}',
          hint: 'If \\(a > 0\\), it has a minimum. If \\(a < 0\\), it has a maximum. Crucial for range problems.'
        },
        { 
          name: 'Condition for One Common Root', 
          latex: '(c_1 a_2 - c_2 a_1)^2 = (a_1 b_2 - a_2 b_1)(b_1 c_2 - b_2 c_1)',
          hint: 'Memorizing this saves 5 minutes of elimination method. Just plug the coefficients in.'
        }
      ]
    }
  ],
  Physics: PHYSICS_SHARED,
  Chemistry: CHEMISTRY_SHARED
};

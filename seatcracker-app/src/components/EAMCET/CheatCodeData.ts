export interface Formula {
  name: string;
  latex: string;
  hint: string;
}

export interface Topic {
  id: string;
  name: string;
  questions: number;
  level: 'Easy' | 'Intermediate' | 'Hard';
  subtopics: string[];
  formulas: Formula[];
}

// ── PHYSICS (Common for both AP and TS) ──
const PHYSICS_TOPICS: Topic[] = [
  {
    id: 'p-motion', name: 'Laws of Motion', questions: 18, level: 'Easy',
    subtopics: ['Newton\'s Laws', 'Friction', 'Circular Motion'],
    formulas: [
      { name: 'Conservation of Momentum', latex: 'm_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2', hint: '💡 Always apply this when there are collisions or explosions. Vector direction matters!' },
      { name: 'Friction on Inclined Plane', latex: 'a = g(\\sin\\theta - \\mu\\cos\\theta)', hint: '💡 If an object is sliding down, use this directly to find acceleration.' },
      { name: 'Banking of Roads', latex: 'v_{max} = \\sqrt{rg\\left(\\frac{\\mu + \\tan\\theta}{1 - \\mu\\tan\\theta}\\right)}', hint: '💡 For optimum speed without friction, set \\(\\mu=0\\), which gives \\(v = \\sqrt{rg\\tan\\theta}\\).' }
    ]
  },
  {
    id: 'p-wep', name: 'Work Energy Power', questions: 20, level: 'Intermediate',
    subtopics: ['Work-Energy Theorem', 'Conservation of Energy', 'Collisions'],
    formulas: [
      { name: 'Work-Energy Theorem', latex: 'W_{net} = \\Delta KE', hint: '💡 Ultimate cheat: If forces are complex or variable, just find the change in velocity.' },
      { name: 'Coefficient of Restitution', latex: 'e = \\frac{v_2 - v_1}{u_1 - u_2}', hint: '💡 Use \\(e=1\\) for perfectly elastic, \\(e=0\\) for perfectly inelastic.' },
      { name: 'Power of a Pump', latex: 'P = \\frac{mgh}{t} + \\frac{1}{2}\\frac{mv^2}{t}', hint: '💡 Water pumped from a well? Don\'t forget to add kinetic energy if water is ejected with velocity!' }
    ]
  },
  {
    id: 'p-rot', name: 'System of Particles & Rotatory Motion', questions: 25, level: 'Hard',
    subtopics: ['Center of Mass', 'Moment of Inertia', 'Angular Momentum'],
    formulas: [
      { name: 'Center of Mass', latex: 'X_{cm} = \\frac{m_1 x_1 + m_2 x_2}{m_1 + m_2}', hint: '💡 If parts of a body are removed, use negative mass for the removed part.' },
      { name: 'Parallel Axis Theorem', latex: 'I = I_{cm} + Md^2', hint: '💡 Use when finding inertia about an edge. \\(I_{cm}\\) must pass through the center.' },
      { name: 'Conservation of Angular Momentum', latex: 'I_1 \\omega_1 = I_2 \\omega_2', hint: '💡 Ice skater folding arms? Inertia drops, angular velocity increases.' }
    ]
  },
  {
    id: 'p-grav', name: 'Gravitation', questions: 15, level: 'Easy',
    subtopics: ['Newton\'s Law', 'Escape Velocity', 'Kepler\'s Laws'],
    formulas: [
      { name: 'Variation of g with Depth', latex: 'g_d = g\\left(1 - \\frac{d}{R}\\right)', hint: '💡 Weight decreases linearly with depth. At center of Earth, \\(d=R\\), so \\(g=0\\).' },
      { name: 'Escape Velocity', latex: 'v_e = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2gR}', hint: '💡 Independent of the mass of the escaping object. For Earth, it is ~11.2 km/s.' },
      { name: 'Kepler\'s Third Law', latex: 'T^2 \\propto R^3', hint: '💡 Use this instantly for ratio problems between two planets: \\((T_1/T_2)^2 = (R_1/R_2)^3\\).' }
    ]
  },
  {
    id: 'p-fluid', name: 'Mechanical Properties of Fluids', questions: 15, level: 'Intermediate',
    subtopics: ['Pressure', 'Archimedes Principle', 'Bernoulli\'s Theorem'],
    formulas: [
      { name: 'Equation of Continuity', latex: 'A_1 v_1 = A_2 v_2', hint: '💡 Water coming out of a tap gets narrower because velocity increases as it falls.' },
      { name: 'Bernoulli\'s Equation', latex: 'P + \\frac{1}{2}\\rho v^2 + \\rho gh = \\text{constant}', hint: '💡 Airplane lift, Venturimeter, and Magnus effect all rely on this. Higher speed = lower pressure.' },
      { name: 'Terminal Velocity', latex: 'v_t = \\frac{2r^2(\\rho - \\sigma)g}{9\\eta}', hint: '💡 Notice that terminal velocity is proportional to the SQUARE of the radius (\\(r^2\\)).' }
    ]
  },
  {
    id: 'p-thermprop', name: 'Thermal Properties of Matter', questions: 12, level: 'Easy',
    subtopics: ['Thermal Expansion', 'Calorimetry', 'Heat Transfer'],
    formulas: [
      { name: 'Linear Expansion', latex: '\\Delta L = \\alpha L \\Delta T', hint: '💡 Areal expansion \\(\\beta = 2\\alpha\\), Volume expansion \\(\\gamma = 3\\alpha\\).' },
      { name: 'Principle of Calorimetry', latex: 'm_1 c_1 \\Delta T_1 = m_2 c_2 \\Delta T_2', hint: '💡 Heat lost = Heat gained. Always check if a phase change (Latent heat \\(mL\\)) is occurring!' },
      { name: 'Stefan-Boltzmann Law', latex: 'E = \\sigma T^4', hint: '💡 Energy radiated is proportional to the FOURTH power of absolute temperature. Convert to Kelvin!' }
    ]
  },
  {
    id: 'p-thermo', name: 'Thermodynamics', questions: 20, level: 'Intermediate',
    subtopics: ['First Law', 'Isothermal/Adiabatic', 'Carnot Engine'],
    formulas: [
      { name: 'First Law of Thermodynamics', latex: '\\Delta Q = \\Delta U + \\Delta W', hint: '💡 Sign convention: +Q if heat added, +W if gas expands (volume increases).' },
      { name: 'Adiabatic Process', latex: 'PV^\\gamma = \\text{constant}', hint: '💡 Sudden compression or expansion? It\'s adiabatic (\\(\\Delta Q = 0\\)).' },
      { name: 'Carnot Efficiency', latex: '\\eta = 1 - \\frac{T_2}{T_1}', hint: '💡 \\(T_1\\) is the hot source, \\(T_2\\) is the cold sink. Must be in Kelvin!' }
    ]
  },
  {
    id: 'p-waves', name: 'Waves', questions: 18, level: 'Intermediate',
    subtopics: ['Wave Equation', 'Beats', 'Doppler Effect'],
    formulas: [
      { name: 'Wave Speed on String', latex: 'v = \\sqrt{\\frac{T}{\\mu}}', hint: '💡 \\(\\mu\\) is mass per unit LENGTH, not total mass. If tension quadruples, speed doubles.' },
      { name: 'Beat Frequency', latex: 'f_{beat} = |f_1 - f_2|', hint: '💡 Number of beats per second. Used for tuning instruments.' },
      { name: 'Doppler Effect', latex: 'f\' = f \\left( \\frac{v \\pm v_o}{v \\mp v_s} \\right)', hint: '💡 Source moving towards observer? Apparent frequency increases (use - in denominator).' }
    ]
  },
  {
    id: 'p-optics', name: 'Ray Optics', questions: 22, level: 'Hard',
    subtopics: ['Mirrors', 'Lenses', 'Prisms'],
    formulas: [
      { name: 'Lens Maker\'s Formula', latex: '\\frac{1}{f} = (\\mu - 1) \\left( \\frac{1}{R_1} - \\frac{1}{R_2} \\right)', hint: '💡 Convex lens in water? Its focal length increases roughly 4 times.' },
      { name: 'Magnification', latex: 'm = \\frac{v}{u} = \\frac{f}{f+u}', hint: '💡 Real images have negative magnification. Virtual images have positive.' },
      { name: 'Prism Formula', latex: '\\mu = \\frac{\\sin((A+\\delta_m)/2)}{\\sin(A/2)}', hint: '💡 At minimum deviation, the refracted ray inside the prism is parallel to the base.' }
    ]
  },
  {
    id: 'p-cap', name: 'Potential & Capacitance', questions: 20, level: 'Intermediate',
    subtopics: ['Electric Potential', 'Capacitors in Series/Parallel', 'Energy Stored'],
    formulas: [
      { name: 'Energy in Capacitor', latex: 'U = \\frac{1}{2}CV^2 = \\frac{Q^2}{2C}', hint: '💡 Battery disconnected before inserting dielectric? Use \\(Q^2/2C\\) (Q is constant).' },
      { name: 'Parallel Plate Capacitor', latex: 'C = \\frac{\\epsilon_0 A}{d}', hint: '💡 Insert a dielectric of constant K? Capacitance becomes \\(K \\cdot C\\).' },
      { name: 'Series Combination', latex: '\\frac{1}{C_{eq}} = \\frac{1}{C_1} + \\frac{1}{C_2}', hint: '💡 Capacitors in series add up like resistors in parallel!' }
    ]
  },
  {
    id: 'p-curr', name: 'Current Electricity', questions: 28, level: 'Hard',
    subtopics: ['Ohm\'s Law', 'Kirchhoff\'s Laws', 'Measuring Instruments'],
    formulas: [
      { name: 'Drift Velocity', latex: 'v_d = \\frac{I}{neA}', hint: '💡 Drift velocity is incredibly slow (mm/s), but electric field propagates at speed of light.' },
      { name: 'Wheatstone Bridge', latex: '\\frac{P}{Q} = \\frac{R}{S}', hint: '💡 If ratio holds, ignore the middle galvanometer resistor completely.' },
      { name: 'Meter Bridge Unknown', latex: 'S = R \\left( \\frac{100 - l}{l} \\right)', hint: '💡 \\(l\\) is balancing length from the left. Simple application of Wheatstone.' }
    ]
  },
  {
    id: 'p-mag', name: 'Moving Charges & Magnetism', questions: 25, level: 'Intermediate',
    subtopics: ['Magnetic Force', 'Biot-Savart Law', 'Ampere\'s Law'],
    formulas: [
      { name: 'Magnetic Force on Charge', latex: 'F = q(\\mathbf{v} \\times \\mathbf{B})', hint: '💡 If particle moves parallel to magnetic field, force is ZERO.' },
      { name: 'Radius of Circular Path', latex: 'r = \\frac{mv}{qB} = \\frac{\\sqrt{2mK}}{qB}', hint: '💡 Very common! K is kinetic energy. Useful for comparing proton and alpha particle paths.' },
      { name: 'Force on Wire', latex: 'F = I(\\mathbf{L} \\times \\mathbf{B})', hint: '💡 Parallel wires carrying current in same direction ATTRACT each other.' }
    ]
  },
  {
    id: 'p-nuc', name: 'Nuclei', questions: 15, level: 'Easy',
    subtopics: ['Mass Defect', 'Radioactivity', 'Half-Life'],
    formulas: [
      { name: 'Radius of Nucleus', latex: 'R = R_0 A^{1/3}', hint: '💡 Volume of a nucleus is directly proportional to its mass number A. Density is constant!' },
      { name: 'Mass Defect Energy', latex: 'E = \\Delta m c^2', hint: '💡 Multiply mass defect in amu by 931.5 to get energy directly in MeV.' },
      { name: 'Radioactive Decay', latex: 'N = N_0 \\left(\\frac{1}{2}\\right)^n', hint: '💡 \\(n\\) is the number of half-lives passed (\\(t / T_{1/2}\\)). Quick calculation!' }
    ]
  },
  {
    id: 'p-semi', name: 'Semiconductors', questions: 18, level: 'Easy',
    subtopics: ['Diodes', 'Logic Gates', 'Transistors'],
    formulas: [
      { name: 'Intrinsic Carrier Concentration', latex: 'n_e n_h = n_i^2', hint: '💡 Mass Action Law. Adding dopants increases one carrier but decreases the other.' },
      { name: 'Current in Transistor', latex: 'I_E = I_B + I_C', hint: '💡 Base current \\(I_B\\) is usually in micro-amps (\\(\\mu A\\)), others in milli-amps (mA).' },
      { name: 'Voltage Gain', latex: 'A_v = \\beta \\frac{R_{out}}{R_{in}}', hint: '💡 Negative sign indicates 180-degree phase shift in Common Emitter configuration.' }
    ]
  },
  {
    id: 'p-units', name: 'Units & Dimensions', questions: 8, level: 'Easy',
    subtopics: ['Dimensional Analysis', 'Errors'],
    formulas: [
      { name: 'Error in Power', latex: 'Z = A^n B^m \\implies \\frac{\\Delta Z}{Z} = n\\frac{\\Delta A}{A} + m\\frac{\\Delta B}{B}', hint: '💡 Max percentage error simply adds up. Always use positive values for error!' },
      { name: 'Dimensional Consistency', latex: '[LHS] = [RHS]', hint: '💡 You can only add or subtract quantities with the exact same dimensions.' }
    ]
  }
];

// ── CHEMISTRY TOPICS ──
const AP_CHEMISTRY: Topic[] = [
  {
    id: 'c-mole', name: 'Mole Concept', questions: 15, level: 'Easy',
    subtopics: ['Molarity', 'Molality', 'Limiting Reagent'],
    formulas: [
      { name: 'Moles Formula', latex: 'n = \\frac{\\text{Mass}}{\\text{Molar Mass}} = \\frac{N}{N_A}', hint: '💡 At STP, 1 mole of any ideal gas occupies 22.4 Liters.' },
      { name: 'Molarity', latex: 'M = \\frac{\\text{Moles of solute}}{\\text{Volume of solution (L)}}', hint: '💡 Temperature dependent! Molality (m) is temperature independent.' }
    ]
  },
  {
    id: 'c-atom', name: 'Atomic Structure', questions: 18, level: 'Intermediate',
    subtopics: ['Bohr Model', 'Quantum Numbers', 'De Broglie'],
    formulas: [
      { name: 'Energy of Orbit', latex: 'E_n = -13.6 \\frac{Z^2}{n^2} \\text{ eV}', hint: '💡 For Hydrogen, \\(Z=1\\). First excited state means \\(n=2\\).' },
      { name: 'Angular Momentum', latex: 'mvr = \\frac{nh}{2\\pi}', hint: '💡 Quantization condition. Also determines the number of waves in an orbit.' }
    ]
  },
  {
    id: 'c-thermo', name: 'Thermodynamics', questions: 20, level: 'Hard',
    subtopics: ['Enthalpy', 'Entropy', 'Gibbs Free Energy'],
    formulas: [
      { name: 'Gibbs Free Energy', latex: '\\Delta G = \\Delta H - T\\Delta S', hint: '💡 Reaction is spontaneous only if \\(\\Delta G < 0\\).' },
      { name: 'Relation with Equilibrium', latex: '\\Delta G^\\circ = -RT \\ln K_{eq}', hint: '💡 If \\(\\Delta G^\\circ\\) is negative, \\(K_{eq} > 1\\) (reaction favors products).' }
    ]
  },
  {
    id: 'c-kinetics', name: 'Chemical Kinetics', questions: 22, level: 'Intermediate',
    subtopics: ['Rate Law', 'First Order Reactions', 'Arrhenius Equation'],
    formulas: [
      { name: 'First Order Decay', latex: 'k = \\frac{2.303}{t} \\log\\left(\\frac{a}{a-x}\\right)', hint: '💡 Half life is \\(0.693/k\\). Independent of initial concentration!' },
      { name: 'Arrhenius Equation', latex: 'k = A e^{-E_a/RT}', hint: '💡 Increasing temperature by 10°C typically doubles the rate constant \\(k\\).' }
    ]
  },
  {
    id: 'c-eq', name: 'Equilibrium', questions: 25, level: 'Hard',
    subtopics: ['Le Chatelier', 'pH Calculations', 'Solubility Product'],
    formulas: [
      { name: 'Relation between Kp and Kc', latex: 'K_p = K_c (RT)^{\\Delta n_g}', hint: '💡 \\(\\Delta n_g\\) is (gaseous moles of products) - (gaseous moles of reactants).' },
      { name: 'Buffer pH (Henderson)', latex: 'pH = pK_a + \\log\\frac{[\\text{Salt}]}{[\\text{Acid}]}', hint: '💡 Maximum buffer capacity occurs when pH = pKa.' }
    ]
  },
  {
    id: 'c-electro', name: 'Electro Chemistry', questions: 20, level: 'Intermediate',
    subtopics: ['Nernst Equation', 'Faraday\'s Laws', 'Conductance'],
    formulas: [
      { name: 'Nernst Equation', latex: 'E_{cell} = E^\\circ_{cell} - \\frac{0.0591}{n} \\log Q', hint: '💡 \\(n\\) is the number of electrons transferred. Check stoichiometry.' },
      { name: 'Faraday\'s First Law', latex: 'W = ZIt = \\frac{E}{96500} It', hint: '💡 1 Faraday = 96500 C = charge of 1 mole of electrons.' }
    ]
  },
  {
    id: 'c-sol', name: 'Solutions', questions: 15, level: 'Easy',
    subtopics: ['Colligative Properties', 'Raoult\'s Law', 'Vant Hoff Factor'],
    formulas: [
      { name: 'Relative Lowering of Vapor Pressure', latex: '\\frac{P^\\circ - P_s}{P^\\circ} = X_{solute}', hint: '💡 \\(X_{solute}\\) is mole fraction. Applies strictly to non-volatile solutes.' },
      { name: 'Depression of Freezing Point', latex: '\\Delta T_f = i \\cdot K_f \\cdot m', hint: '💡 \\(i\\) is the Vant Hoff factor. For complete dissociation of \\(MgCl_2\\), \\(i=3\\).' }
    ]
  },
  {
    id: 'c-period', name: 'Periodic Table and Periodicity', questions: 12, level: 'Easy',
    subtopics: ['Ionization Energy', 'Atomic Radius', 'Electronegativity'],
    formulas: [
      { name: 'Effective Nuclear Charge', latex: 'Z_{eff} = Z - \\sigma', hint: '💡 Explains why atomic radius decreases across a period. Slater\'s rules.' }
    ]
  },
  {
    id: 'c-bond', name: 'Chemical Bonding', questions: 22, level: 'Intermediate',
    subtopics: ['VSEPR Theory', 'Hybridization', 'Molecular Orbital Theory'],
    formulas: [
      { name: 'Bond Order (MOT)', latex: 'B.O. = \\frac{N_b - N_a}{2}', hint: '💡 Fractional bond order means paramagnetic. N2 is 3, O2 is 2.' },
      { name: 'Hybridization Trick', latex: 'H = \\frac{1}{2}(V + M - C + A)', hint: '💡 V=Valence e-, M=Monovalent atoms, C=Cation charge, A=Anion charge.' }
    ]
  },
  {
    id: 'c-coord', name: 'Coordination Compounds', questions: 25, level: 'Hard',
    subtopics: ['Nomenclature', 'Isomerism', 'CFT'],
    formulas: [
      { name: 'Magnetic Moment', latex: '\\mu = \\sqrt{n(n+2)} \\text{ B.M.}', hint: '💡 \\(n\\) is number of unpaired electrons. Strong field ligands pair them up!' }
    ]
  },
  {
    id: 'c-dfblock', name: 'd & f Block Elements', questions: 15, level: 'Intermediate',
    subtopics: ['Lanthanoid Contraction', 'Oxidation States', 'Colored Ions'],
    formulas: [
      { name: 'General Configuration', latex: '(n-1)d^{1-10} ns^{1-2}', hint: '💡 Exceptional configs: Cr is \\(3d^5 4s^1\\), Cu is \\(3d^{10} 4s^1\\) for stability.' }
    ]
  },
  {
    id: 'c-hydro', name: 'Hydrocarbons', questions: 18, level: 'Intermediate',
    subtopics: ['Alkanes', 'Alkenes', 'Alkynes', 'Aromaticity'],
    formulas: [
      { name: 'Huckel\'s Rule', latex: '4n + 2 \\text{ } \\pi \\text{ electrons}', hint: '💡 Must be planar and fully conjugated to be aromatic. Benzene has 6 (n=1).' },
      { name: 'Markovnikov Rule', latex: '\\text{Rich gets richer}', hint: '💡 Adding HX to alkene? H goes to carbon with more H\'s. Anti-Markovnikov only for HBr with peroxide.' }
    ]
  },
  {
    id: 'c-halo', name: 'Haloalkanes and Haloarenes', questions: 15, level: 'Hard',
    subtopics: ['SN1 and SN2', 'Elimination Reactions', 'Grignard Reagent'],
    formulas: [
      { name: 'SN2 Reactivity', latex: '1^\\circ > 2^\\circ > 3^\\circ', hint: '💡 SN2 favors primary due to less steric hindrance. Complete inversion of configuration.' },
      { name: 'SN1 Reactivity', latex: '3^\\circ > 2^\\circ > 1^\\circ', hint: '💡 SN1 relies on carbocation stability. Leads to racemization.' }
    ]
  },
  {
    id: 'c-alcohol', name: 'Alcohols Phenols and Ethers', questions: 18, level: 'Intermediate',
    subtopics: ['Esterification', 'Lucas Test', 'Williamson Synthesis'],
    formulas: [
      { name: 'Lucas Test (ZnCl2/HCl)', latex: '3^\\circ \\text{ (instant) } > 2^\\circ \\text{ (5 mins) } > 1^\\circ \\text{ (no reaction)}', hint: '💡 Used to distinguish types of alcohols based on turbidity.' }
    ]
  },
  {
    id: 'c-carbonyl', name: 'Aldehydes Ketones and Carboxylic Acids', questions: 22, level: 'Hard',
    subtopics: ['Aldol Condensation', 'Cannizzaro', 'Nucleophilic Addition'],
    formulas: [
      { name: 'Aldol vs Cannizzaro', latex: '\\alpha\\text{-Hydrogen ? Aldol : Cannizzaro}', hint: '💡 If molecule has alpha-hydrogen (like Acetaldehyde), it does Aldol. Formaldehyde does Cannizzaro.' }
    ]
  }
];

const TS_CHEMISTRY: Topic[] = [
  ...AP_CHEMISTRY.filter(t => !['c-halo', 'c-alcohol', 'c-carbonyl'].includes(t.id)), // TS has different naming for organics
  {
    id: 'c-org-halo', name: 'Organic Halogens', questions: 12, level: 'Hard', subtopics: ['SN1/SN2'], formulas: AP_CHEMISTRY.find(t=>t.id==='c-halo')?.formulas || []
  },
  {
    id: 'c-org-oxy', name: 'Organic Oxygen', questions: 20, level: 'Hard', subtopics: ['Alcohols', 'Aldehydes'], formulas: AP_CHEMISTRY.find(t=>t.id==='c-carbonyl')?.formulas || []
  },
  {
    id: 'c-org-nit', name: 'Organic Nitrogen', questions: 15, level: 'Intermediate', subtopics: ['Amines', 'Diazonium Salts'], formulas: [
      { name: 'Basic Strength (Aqueous)', latex: '2^\\circ > 1^\\circ > 3^\\circ > NH_3', hint: '💡 For methyl amines in water. Steric hindrance and solvation both play a role.' }
    ]
  },
  {
    id: 'c-pblock', name: 'P-block (13-18)', questions: 18, level: 'Intermediate', subtopics: ['Group 15', 'Halogens', 'Noble Gases'], formulas: [
      { name: 'Inert Pair Effect', latex: '\\text{Lower oxidation state more stable down the group}', hint: '💡 For Group 14, Pb+2 is more stable than Pb+4.' }
    ]
  }
];

// ── AP MATHEMATICS ──
const AP_MATH: Topic[] = [
  {
    id: 'm-trig', name: 'Properties of Triangle', questions: 12, level: 'Intermediate', subtopics: ['Sine Rule', 'Cosine Rule', 'Incircle'], formulas: [
      { name: 'Sine Rule', latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R', hint: '💡 Useful when you know two angles and one side.' },
      { name: 'Cosine Rule', latex: '\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}', hint: '💡 Used to find an angle when all three sides are known.' }
    ]
  },
  {
    id: 'm-2d', name: '2D-Geometry', questions: 15, level: 'Easy', subtopics: ['Distance', 'Section Formula', 'Area'], formulas: [
      { name: 'Section Formula (Internal)', latex: 'P(x,y) = \\left( \\frac{mx_2+nx_1}{m+n}, \\frac{my_2+ny_1}{m+n} \\right)', hint: '💡 If ratio is \\(k:1\\), replace \\(m/n\\) with \\(k\\). Easy to solve.' }
    ]
  },
  {
    id: 'm-lines', name: 'Straight Lines', questions: 22, level: 'Intermediate', subtopics: ['Slope-Intercept', 'Distance', 'Foot of Perpendicular'], formulas: [
      { name: 'Distance from Point to Line', latex: 'd = \\frac{|ax_1 + by_1 + c|}{\\sqrt{a^2 + b^2}}', hint: '💡 Often used to find radius of a circle if tangent is given.' },
      { name: 'Image of a Point', latex: '\\frac{x-x_1}{a} = \\frac{y-y_1}{b} = \\frac{-2(ax_1+by_1+c)}{a^2+b^2}', hint: '💡 Direct shortcut. For Foot of Perpendicular, remove the 2.' }
    ]
  },
  {
    id: 'm-mat', name: 'Matrices and Determinants', questions: 28, level: 'Intermediate', subtopics: ['Adjoint', 'Inverse', 'Cramer\'s Rule'], formulas: [
      { name: 'Determinant of Adjoint', latex: '|\\text{adj}(A)| = |A|^{n-1}', hint: '💡 Extremely common question. For a 3x3 matrix, it is simply \\(|A|^2\\).' },
      { name: 'Inverse of 2x2', latex: 'A^{-1} = \\frac{1}{ad-bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}', hint: '💡 Swap primary, negate secondary. Takes 5 seconds.' }
    ]
  },
  {
    id: 'm-func', name: 'Functions', questions: 25, level: 'Hard', subtopics: ['Domain & Range', 'Inverse', 'Composition'], formulas: [
      { name: 'Even/Odd Function', latex: 'f(-x) = f(x) \\text{ (Even)}, \\; f(-x) = -f(x) \\text{ (Odd)}', hint: '💡 Integral of an odd function from \\(-a\\) to \\(a\\) is always ZERO.' }
    ]
  },
  {
    id: 'm-vec', name: 'Vectors', questions: 20, level: 'Easy', subtopics: ['Dot Product', 'Cross Product', 'Scalar Triple Product'], formulas: [
      { name: 'Dot Product', latex: '\\mathbf{a} \\cdot \\mathbf{b} = |\\mathbf{a}||\\mathbf{b}|\\cos\\theta', hint: '💡 If vectors are perpendicular, dot product is 0. Instant check.' },
      { name: 'Area of Parallelogram', latex: '\\text{Area} = |\\mathbf{a} \\times \\mathbf{b}|', hint: '💡 For a triangle, don\'t forget the 1/2 in front.' }
    ]
  },
  {
    id: 'm-coord', name: 'Coordinate Geometry', questions: 18, level: 'Intermediate', subtopics: ['Conics General Form'], formulas: [
      { name: 'Condition for Conic Type', latex: '\\Delta \\neq 0, \\; h^2 - ab', hint: '💡 If \\(h^2 = ab\\) (Parabola). If \\(h^2 < ab\\) (Ellipse). If \\(h^2 > ab\\) (Hyperbola).' }
    ]
  },
  {
    id: 'm-int', name: 'Integration', questions: 35, level: 'Hard', subtopics: ['Indefinite', 'By Parts', 'Partial Fractions'], formulas: [
      { name: 'By Parts Rule (ILATE)', latex: '\\int u \\, dv = uv - \\int v \\, du', hint: '💡 ILATE: Inverse, Log, Algebraic, Trig, Exponential. Order of choosing u.' },
      { name: 'Magic Form 1', latex: '\\int e^x[f(x) + f\'(x)] dx = e^x f(x) + C', hint: '💡 If you see \\(e^x\\) outside a bracket, look for a function and its derivative inside.' }
    ]
  },
  {
    id: 'm-pnc', name: 'Permutation and Combinations', questions: 22, level: 'Hard', subtopics: ['Arrangements', 'Selections', 'Circular Permutation'], formulas: [
      { name: 'Combinations Formula', latex: '^nC_r = \\frac{n!}{r!(n-r)!}', hint: '💡 Order does NOT matter. Selecting a team.' },
      { name: 'Circular Permutation', latex: '(n-1)!', hint: '💡 If clockwise/anti-clockwise are indistinguishable (like a necklace), divide by 2.' }
    ]
  },
  {
    id: 'm-defint', name: 'Definite Integrals', questions: 28, level: 'Intermediate', subtopics: ['Properties of Integrals', 'Area under curve'], formulas: [
      { name: 'King\'s Property', latex: '\\int_a^b f(x) dx = \\int_a^b f(a+b-x) dx', hint: '💡 Almost every tough definite integral uses this to cancel out terms. Set as I, add equations.' }
    ]
  },
  {
    id: 'm-prob', name: 'Probability', questions: 25, level: 'Intermediate', subtopics: ['Conditional', 'Bayes Theorem', 'Binomial'], formulas: [
      { name: 'Bayes Theorem', latex: 'P(E_i|A) = \\frac{P(E_i)P(A|E_i)}{\\Sigma P(E_j)P(A|E_j)}', hint: '💡 "What is the probability ball came from Bag 2?" Use this reverse-probability theorem.' }
    ]
  },
  {
    id: 'm-disp', name: 'Measure of Dispersion', questions: 10, level: 'Easy', subtopics: ['Variance', 'Standard Deviation'], formulas: [
      { name: 'Variance Shortcut', latex: '\\sigma^2 = \\frac{\\Sigma x^2}{n} - \\left(\\frac{\\Sigma x}{n}\\right)^2', hint: '💡 Mean of squares minus square of mean. Easiest way to calculate.' }
    ]
  },
  {
    id: 'm-maxmin', name: 'Maxima & Minima', questions: 20, level: 'Hard', subtopics: ['First Derivative', 'Second Derivative Test'], formulas: [
      { name: 'Second Derivative Test', latex: 'f\'\'(x) > 0 \\implies \\text{Local Min}', hint: '💡 Counter-intuitive: greater than 0 means it\'s a minimum (concave up). Less than 0 means maximum.' }
    ]
  },
  {
    id: 'm-comp', name: 'Complex Numbers', questions: 28, level: 'Hard', subtopics: ['De Moivre', 'Cube Roots', 'Locus'], formulas: [
      { name: 'Cube Roots of Unity', latex: '1 + \\omega + \\omega^2 = 0', hint: '💡 If you see \\(\\omega^{large}\\), divide power by 3 and take remainder.' }
    ]
  },
  {
    id: 'm-quad', name: 'Quadratic Expressions', questions: 20, level: 'Easy', subtopics: ['Roots', 'Range of rational functions'], formulas: [
      { name: 'Roots sum and product', latex: '\\alpha + \\beta = -b/a, \\; \\alpha\\beta = c/a', hint: '💡 If asked for \\(\\alpha^2+\\beta^2\\), use \\((\\alpha+\\beta)^2 - 2\\alpha\\beta\\).' }
    ]
  },
  {
    id: 'm-binom', name: 'Binomial Theorem', questions: 18, level: 'Intermediate', subtopics: ['General Term', 'Independent Term'], formulas: [
      { name: 'General Term', latex: 'T_{r+1} = ^nC_r x^{n-r} y^r', hint: '💡 To find term independent of x, equate the power of x in general term to ZERO.' }
    ]
  },
  {
    id: 'm-diffeq', name: 'Differential Equations', questions: 25, level: 'Hard', subtopics: ['Variable Separable', 'Linear Diff Eq'], formulas: [
      { name: 'Integrating Factor (Linear)', latex: 'IF = e^{\\int P dx}', hint: '💡 For eq \\(dy/dx + Py = Q\\). The solution is simply \\(y \\cdot IF = \\int (Q \\cdot IF) dx\\).' }
    ]
  },
  {
    id: 'm-diff', name: 'Differentiation', questions: 22, level: 'Intermediate', subtopics: ['Chain Rule', 'Parametric', 'Implicit'], formulas: [
      { name: 'Parametric Differentiation', latex: '\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}', hint: '💡 Don\'t try to eliminate \\(t\\) or \\(\\theta\\). Differentiate separately and divide.' }
    ]
  },
  {
    id: 'm-lim', name: 'Limits & Continuity', questions: 20, level: 'Easy', subtopics: ['L\'Hopital Rule', 'Standard Limits'], formulas: [
      { name: 'L\'Hopital\'s Rule', latex: '\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f\'(x)}{g\'(x)}', hint: '💡 Only applies if form is 0/0 or \\(\\infty/\\infty\\). Differentiate top and bottom independently.' }
    ]
  }
];

// ── TS MATHEMATICS ──
const TS_MATH: Topic[] = [
  ...AP_MATH.filter(t => ['m-comp', 'm-prob', 'm-pnc', 'm-quad', 'm-binom', 'm-int', 'm-defint', 'm-func', 'm-mat', 'm-maxmin'].includes(t.id)),
  {
    id: 'm-circle', name: 'Circle', questions: 25, level: 'Intermediate', subtopics: ['Tangents', 'Orthogonality'], formulas: [
      { name: 'Orthogonal Circles', latex: '2g_1 g_2 + 2f_1 f_2 = c_1 + c_2', hint: '💡 Use this instantly if they say circles cut orthogonally.' }
    ]
  },
  {
    id: 'm-para', name: 'Parabola', questions: 20, level: 'Hard', subtopics: ['Focus', 'Directrix', 'Tangents'], formulas: [
      { name: 'Condition of Tangency', latex: 'c = \\frac{a}{m}', hint: '💡 For line \\(y=mx+c\\) to be tangent to \\(y^2=4ax\\).' }
    ]
  },
  {
    id: 'm-prodvec', name: 'Product of Vectors', questions: 18, level: 'Easy', subtopics: ['Dot', 'Cross', 'Triple'], formulas: [
      { name: 'Scalar Triple Product (Volume)', latex: '[\\mathbf{a} \\; \\mathbf{b} \\; \\mathbf{c}] = \\mathbf{a} \\cdot (\\mathbf{b} \\times \\mathbf{c})', hint: '💡 Represents volume of parallelepiped. If coplanar, volume is ZERO.' }
    ]
  },
  {
    id: 'm-calc', name: 'Calculus', questions: 35, level: 'Hard', subtopics: ['Diff', 'Limits'], formulas: [
      { name: 'Limit \\(1^\\infty\\) Form', latex: '\\lim_{x \\to a} f(x)^{g(x)} = e^{\\lim g(x)[f(x)-1]}', hint: '💡 Crucial cheat code for standard limits problems.' }
    ]
  }
];

export const AP_DATA: Record<string, Topic[]> = {
  Mathematics: AP_MATH,
  Physics: PHYSICS_TOPICS,
  Chemistry: AP_CHEMISTRY
};

export const TS_DATA: Record<string, Topic[]> = {
  Mathematics: TS_MATH,
  Physics: PHYSICS_TOPICS,
  Chemistry: TS_CHEMISTRY
};

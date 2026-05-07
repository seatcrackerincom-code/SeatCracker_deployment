"use client";

import { useState } from "react";
import styles from "./SyllabusPattern.module.css";

interface Chapter {
  unit: string;
  topics: string[];
}

const SYLLABUS_DATA: Record<string, Chapter[]> = {
  Physics: [
    { unit: "General Physics", topics: ["Units, dimensions, dimensional analysis", "Significant figures, least count, errors", "Experiments: Vernier callipers, screw gauge, Simple pendulum, Searle's method, Surface tension, Speed of sound, Meter bridge, Focal length of mirror/lens"] },
    { unit: "Mechanics", topics: ["Kinematics: Straight line, Relative velocity, Projectile, Circular motion", "Newton's Laws: FBD, Friction, Constraint motion, Pseudo force", "Work, Energy, Power: WE theorem, Conservative forces, PE/ME conservation", "Momentum and Collisions: Impulse, CoM, Elastic/Inelastic collisions", "Rotational Motion: MoI, Torque, Angular momentum, Rolling motion", "Gravitation: Kepler's laws, Escape/Orbital velocity, Satellites", "SHM: Spring-mass, Pendulums, Forced/Damped oscillations", "Fluid Mechanics: Pascal's law, Bernoulli's, Viscosity, Surface tension", "Elasticity: Stress, strain, Young's modulus"] },
    { unit: "Thermal Physics", topics: ["Thermal expansion, Calorimetry, Specific heat", "Ideal & Real gas: PV=nRT, van der Waals, Degrees of freedom", "Thermodynamics: Isothermal, adiabatic, First/Second Laws, Carnot engine", "Heat transfer: Conduction, convection, radiation, Newton's law of cooling"] },
    { unit: "Electricity and Magnetism", topics: ["Electrostatics: Coulomb's law, Gauss's law, Potential, Capacitors", "Current Electricity: Ohm's law, Kirchhoff's, Wheatstone, RC circuits", "Magnetism: Biot-Savart, Ampere's law, Lorentz force, Torque on dipole", "EMI: Faraday's law, Lenz's law, Self/Mutual inductance, LR circuits", "Alternating Currents: LCR circuits, Resonance, Power factor, Transformers", "EM Waves: Spectrum, Polarization"] },
    { unit: "Optics", topics: ["Ray Optics: Reflection, Snell's law, TIR, Prism, Lenses, Optical instruments", "Wave Optics: Huygens' principle, Interference (YDSE), Diffraction, Polarization"] },
    { unit: "Modern Physics", topics: ["Dual Nature: Photoelectric effect, de Broglie, Davisson-Germer", "Atomic Physics: Bohr's model, Spectral series, X-rays", "Nuclear Physics: Binding energy, Radioactivity, Fission & Fusion"] }
  ],
  Chemistry: [
    { unit: "Physical Chemistry", topics: ["Mole concept, stoichiometry, Concentration units", "States of Matter: Gas laws, van der Waals, Critical constants", "Atomic Structure: Bohr's model, Quantum numbers, Electronic configuration", "Chemical Bonding: VSEPR, Hybridisation, MO theory, Resonance", "Thermodynamics: Enthalpy, Hess's law, Entropy, Gibbs free energy", "Equilibrium: Kc/Kp, Le Chatelier's, pH, Buffer, Solubility product", "Electrochemistry: Nernst equation, Faraday's laws, Kohlrausch's", "Chemical Kinetics: Rate laws, Order, Arrhenius equation, Catalysis", "Solutions: Raoult's law, Colligative properties, van't Hoff factor", "Surface Chemistry: Adsorption, Colloids, Hardy-Schulze rule", "Nuclear Chemistry: Radioactive decay, Fission/Fusion"] },
    { unit: "Inorganic Chemistry", topics: ["Periodic Table: Periodicity of radii, IE, EA, Electronegativity", "s-Block: Alkali & Alkaline earth metals,Industrial compounds", "p-Block: Boron, Carbon, Nitrogen, Oxygen, Halogen, Noble gas families", "d & f Block: Transition elements, Lanthanide contraction, KMnO4, K2Cr2O7", "Coordination Compounds: IUPAC, Werner's, Isomerism, CFT", "Metallurgy: Extraction & Refining of Fe, Cu, Zn, Al, Na, K", "Qualitative Analysis: Detection of cations/anions", "Environmental Chemistry: Pollution, Acid rain, Greenhouse effect, Ozone"] },
    { unit: "Organic Chemistry", topics: ["Basic Concepts: IUPAC, Isomerism, Resonance, Intermediates", "Hydrocarbons: Alkanes, Alkenes, Alkynes, Benzene (EAS)", "Reactions & Mechanisms: SN1/SN2, E1/E2, Named reactions (Aldol, etc.)", "Functional Groups: Haloalkanes, Alcohols, Phenols, Ethers, Carbonyls, Acids, Amines", "Biomolecules: Carbohydrates, Proteins, Nucleic Acids", "Polymers: Natural & Synthetic, Addition & Condensation", "Practical Organic Chemistry: Functional group detection tests"] }
  ],
  Mathematics: [
    { unit: "Algebra", topics: ["Sets, Relations and Functions: Composition, Domain/Range", "Complex Numbers: Modulus, Argument, De Moivre's, Roots of unity", "Quadratic Equations: Nature of roots, Vieta's formulas, Location of roots", "Sequences and Series: AP, GP, Sum of squares/cubes", "Permutations and Combinations: counting principle, selection/arrangement", "Binomial Theorem: Coefficients, General/Middle terms", "Matrices and Determinants: Transpose, Inverse, Cramer's rule", "Probability: Bayes' theorem, Binomial distribution, Expected value", "Statistics: Mean, Variance, Standard deviation"] },
    { unit: "Trigonometry", topics: ["Functions & Graphs: Periodicity, domain, range", "Identities: Sum/Difference, Double/Half angle formulas", "Inverse Trigonometric Functions: Properties and identities", "Properties of Triangles: Sine/Cosine rules, circumradius/inradius"] },
    { unit: "Coordinate Geometry (2D)", topics: ["Straight Lines: Distance, Angle between lines, Family of lines", "Circles: Tangent, Normal, Radical axis", "Parabola: Focus, directrix, eccentricity, tangent/normal", "Ellipse & Hyperbola: Standard form, focus, eccentricity, asymptotes"] },
    { unit: "Differential Calculus", topics: ["Limits, Continuity and Differentiability: L'Hopital's, Discontinuity", "Differentiation: Chain/Product/Quotient rules, Parametric", "Applications of Derivatives: Tangent/Normal, Maxima/Minima, Rolle's, LMVT"] },
    { unit: "Integral Calculus", topics: ["Integration Techniques: Substitution, By parts, Partial fractions", "Definite Integrals: King's property, Wallis formula, Leibniz rule", "Applications: Area bounded by curves", "Differential Equations: Variable separable, Homogeneous, Linear"] },
    { unit: "Vectors and 3D Geometry", topics: ["Vectors: Dot/Cross products, Triple products", "3D Geometry: Direction cosines, Line & Plane equations, Distance from point"] }
  ]
};

export default function SyllabusView({ onBack }: { onBack: () => void }) {
  const [activeSubject, setActiveSubject] = useState<string>("Mathematics");
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set([`Mathematics-0`]));

  const toggleUnit = (key: string) => {
    setExpandedUnits(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const subjects = ["Mathematics", "Physics", "Chemistry"];

  return (
    <div className={styles.wrapper}>
      <div className={styles.aurora} />
      
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Menu
        </button>
        <h1 className={styles.title}>JEE Advanced <span className={styles.accent}>Syllabus</span></h1>
        <p className={styles.subtitle}>Complete subject-wise detailed topics for 2026</p>
      </header>

      <div className={styles.tabsWrapper}>
        <div className={styles.tabs}>
          {subjects.map(sub => (
            <button
              key={sub}
              className={`${styles.tab} ${activeSubject === sub ? styles.tabActive : ""}`}
              onClick={() => setActiveSubject(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.accordionList}>
        {SYLLABUS_DATA[activeSubject].map((item, idx) => {
          const key = `${activeSubject}-${idx}`;
          const isExpanded = expandedUnits.has(key);
          return (
            <div key={key} className={styles.accordionCard}>
              <button className={styles.accordionHeader} onClick={() => toggleUnit(key)}>
                <span className={styles.chapterTitle}>{item.unit}</span>
                <span className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                </span>
              </button>
              {isExpanded && (
                <div className={styles.accordionContent}>
                  <ul className={styles.topicList}>
                    {item.topics.map((topic, ti) => (
                      <li key={ti} className={styles.topicItem}>
                        <span className={styles.topicDot} />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const fs = require('fs');
const path = require('path');

const rootDir = 'seatcracker-app/public/questions_v2/physics';

const taxonomy = {
  "alternating_current": ["AC", "RMS", "LCR", "reactance", "impedance", "resonance", "transformer"],
  "atomic_physics": ["Bohr", "Rutherford", "energy level", "hydrogen spectrum", "atomic"],
  "communication_system": ["antenna", "bandwidth", "modulation", "digital", "transducer", "signal"],
  "current_electricity": ["Ohm", "Kirchhoff", "resistor", "drift velocity", "potentiometer", "wheatstone bridge"],
  "dual_nature_of_radiation_matter": ["photoelectric", "photon", "de-broglie", "wave-particle", "work function"],
  "electric_charges_and_fields": ["Coulomb", "electric field", "dipole", "Gauss", "charge"],
  "electro_magnetic_induction": ["Lenz", "Faraday", "eddy current", "inductance", "induction"],
  "electro_magnetic_waves": ["displacement current", "EM waves", "spectrum", "electromagnetic wave", "frequency"],
  "electrostatic_potential_and_capacitance": ["capacitor", "capacitance", "potential", "dielectric", "microfarad", "parallel plate"],
  "friction_newtons_laws_of_motion": ["Friction", "Newton", "laws of motion", "momentum", "impulse", "equilibrium"],
  "gravitation": ["Kepler", "escape velocity", "orbit", "satellite", "Newton's law of gravitation", "G", "planet"],
  "kinetic_theory_of_gases": ["gas molecules", "RMS speed", "avogadro", "degree of freedom", "ideal gas"],
  "magnetism_matter": ["magnetic field", "dipole moment", "susceptibility", "hysteresis", "paramagnetic", "diamagnetic"],
  "mechanical_properties_of_fluids": ["viscosity", "surface tension", "Bernoulli", "Pascal", "fluid", "pressure", "capillary"],
  "mechanical_properties_of_solids": ["Young's modulus", "stress", "strain", "elasticity", "Hooke"],
  "motion_in_a_plane": ["projectile", "centripetal", "circular motion", "horizontal range"],
  "motion_in_a_straight_line": ["acceleration", "uniform motion", "velocity-time", "displacement", "car brakes", "speed", "distance"],
  "moving_charges_and_magnetism": ["Biot-Savart", "Ampere", "cyclotron", "galvanometer", "Lorentz force"],
  "nuclear_physics": ["binding energy", "fission", "fusion", "radioactive", "half-life", "nucleus"],
  "oscillations": ["SHM", "pendulum", "simple harmonic", "frequency", "displacement"],
  "ray_optics": ["mirror", "lens", "refractive index", "Snell", "telescope", "microscope", "reflection", "refraction"],
  "semi_conductors": ["p-n junction", "diode", "transistor", "logic gate", "semiconductor", "doping"],
  "system_of_particles_and_rotatory_motion": ["torque", "moment of inertia", "angular momentum", "center of mass"],
  "thermal_properties_i_and_ii": ["convection", "conduction", "radiation", "calorimetry", "specific heat", "thermal expansion"],
  "thermodynamics": ["carnot", "entropy", "isothermal", "adiabatic", "first law", "heat engine"],
  "units_and_measurements": ["significant figures", "dimensions", "errors", "unit", "least count"],
  "vectors": ["dot product", "cross product", "scalar", "vector addition"],
  "wave_motion": ["transverse", "longitudinal", "doppler", "interference", "stationary wave"],
  "wave_optics": ["Young's", "double slit", "polarization", "diffraction", "Huygens", "wavefront"],
  "work_power_energy": ["Work", "Energy", "Power", "Potential energy", "Kinetic energy", "collision", "conservative force"]
};

function restore() {
  const allQuestions = [];
  const topics = fs.readdirSync(rootDir).filter(f => fs.statSync(path.join(rootDir, f)).isDirectory());

  console.log(`Searching through ${topics.length} topics...`);

  // Phase 1: Harvest
  topics.forEach(topic => {
    const topicPath = path.join(rootDir, topic);
    const files = fs.readdirSync(topicPath).filter(f => f.endsWith('.json'));

    files.forEach(file => {
      const filePath = path.join(topicPath, file);
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (data.questions) {
          data.questions.forEach(q => {
            q._sourceTopic = topic;
            allQuestions.push(q);
          });
        }
      } catch (e) {
        console.error(`Error reading ${filePath}: ${e.message}`);
      }
    });
  });

  console.log(`Total questions harvested: ${allQuestions.length}`);

  const uniqueQuestions = [];
  const seenTexts = new Set();
  allQuestions.forEach(q => {
    const cleanText = q.question.toLowerCase().trim();
    if (!seenTexts.has(cleanText)) {
      seenTexts.add(cleanText);
      uniqueQuestions.push(q);
    }
  });

  console.log(`Unique questions remaining: ${uniqueQuestions.length}`);

  const topicBuckets = {};
  topics.forEach(t => topicBuckets[t] = []);

  uniqueQuestions.forEach(q => {
    const text = q.question.toLowerCase();
    let routed = false;

    for (const [topicName, keywords] of Object.entries(taxonomy)) {
      if (keywords.some(k => text.includes(k.toLowerCase()))) {
        topicBuckets[topicName].push(q);
        routed = true;
        break; 
      }
    }

    if (!routed && taxonomy[q._sourceTopic]) {
      topicBuckets[q._sourceTopic].push(q);
    }
  });

  // Write Back
  topics.forEach(topic => {
    if (!topicBuckets[topic]) return;
    
    const bucket = topicBuckets[topic];
    console.log(`Topic ${topic}: ${bucket.length} questions`);

    const attempt1 = [], attempt2 = [], attempt3 = [], attempt4 = [];
    bucket.forEach((q, idx) => {
      const cleanQ = { ...q };
      delete cleanQ._sourceTopic;
      cleanQ.id = idx + 1;

      if (idx % 4 === 0) attempt1.push(cleanQ);
      else if (idx % 4 === 1) attempt2.push(cleanQ);
      else if (idx % 4 === 2) attempt3.push(cleanQ);
      else attempt4.push(cleanQ);
    });

    const topicPath = path.join(rootDir, topic);
    const writeBatch = (filename, list) => {
        fs.writeFileSync(path.join(topicPath, filename), JSON.stringify({ questions: list }, null, 4));
    };

    writeBatch('attempt_1.json', attempt1);
    writeBatch('attempt_2.json', attempt2);
    writeBatch('attempt_3.json', attempt3);
    writeBatch('attempt_4.json', attempt4);
  });

  console.log("Physics Restoration Complete.");
}

restore();

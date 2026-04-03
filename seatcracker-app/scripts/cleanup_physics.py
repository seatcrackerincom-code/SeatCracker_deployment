import os
import shutil

# Target 31 topics
target_topics = {
    "thermodynamics.json",
    "system_of_particles_and_rotatory_motion.json",
    "moving_charges_and_magnetism.json",
    "work_power_energy.json",
    "oscillations.json",
    "semiconductors.json",
    "current_electricity.json",
    "electrostatic_potential_and_capacitance.json",
    "laws_of_motion.json",
    "atomic_physics.json",
    "electric_charges_and_fields.json",
    "thermal_properties_of_matter.json",
    "kinetic_theory_of_gases.json",
    "motion_in_a_straight_line.json",
    "alternating_current.json",
    "electro_magnetic_waves.json",
    "gravitation.json",
    "mechanical_properties_of_fluids.json",
    "nuclear_physics.json",
    "ray_optics.json",
    "units_and_measurements.json",
    "wave_optics.json",
    "communication_systems.json",
    "electro_magnetic_induction.json",
    "mechanical_properties_of_solids.json",
    "wave_motion.json",
    "magnetism_and_matter.json",
    "motion_in_a_plane.json",
    "dual_nature_of_radiation_and_matter.json",
    "vectors.json",
    "collisions.json"
}

source_dir = "public/questions_v2/physics"
all_files = [f for f in os.listdir(source_dir) if f.endswith('.json')]

# Create a backup/staging dir
stage_dir = "public/questions_v2/physics_clean"
os.makedirs(stage_dir, exist_ok=True)

# Mapping table to help resolve naming conflicts
mapping = {
    "dual_nature.json": "dual_nature_of_radiation_and_matter.json",
    "em_waves.json": "electro_magnetic_waves.json",
    "emi.json": "electro_magnetic_induction.json",
    "atoms.json": "atomic_physics.json",
    "nuclei.json": "nuclear_physics.json",
    "semi_conductors.json": "semiconductors.json",
    "moving_charges_magnetism.json": "moving_charges_and_magnetism.json",
    "electrostatic_potential_capacitance.json": "electrostatic_potential_and_capacitance.json",
    "communication_system.json": "communication_systems.json",
    "friction_newtons_laws_of_motion.json": "laws_of_motion.json",
    "thermal_properties_i_and_ii.json": "thermal_properties_of_matter.json",
    "magnetism_matter.json": "magnetism_and_matter.json"
}

# 1. Copy already correct files
for f in all_files:
    if f in target_topics:
        shutil.copy(os.path.join(source_dir, f), os.path.join(stage_dir, f))

# 2. Resolve mapping
for old, new in mapping.items():
    if old in all_files and new not in os.listdir(stage_dir):
        shutil.copy(os.path.join(source_dir, old), os.path.join(stage_dir, new))

print(f"Cleanup done. Staged files in {stage_dir}")

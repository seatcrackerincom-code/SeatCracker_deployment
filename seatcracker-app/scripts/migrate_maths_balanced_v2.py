import json
import os
import random

# Mapping from topic slug to PYQ source key
TOPIC_TO_PYQ_KEY = {
    "areas": "Areas",
    "areas_under_curves": "Areas", # Might share or be different, but in source it's just "Areas"
    "binomial_theorem": "Binomial Theorem",
    "circles": "Circles",
    "complex_numbers": "Complex Numbers",
    "cross_product_vectors": "Cross Product",
    "dc_s_and_dr_s": "3D Geometry",
    "de_moivre_s_theorem": "De Moivre's Theorem",
    "definite_integrals": "Definite Integrals",
    "differential_equations": "Differential Equations",
    "differentiation": "Differentiation",
    "dot_product_vectors": "Dot Product",
    "ellipse": "Ellipse",
    "functions": "Functions",
    "hyperbola": "Hyperbola",
    "hyperbolic_functions": "Hyperbolic Functions",
    "integration": "Integration",
    "limits_continuity": "Limits & Continuity",
    "locus": "Locus",
    "matrices_and_determinants": "Matrices & Determinants",
    "maxima_and_minima": "Maxima & Minima",
    "multiple_and_sub_multiple_angles": "Multiple Angles",
    "pair_of_straight_lines": "Pair of Straight Lines",
    "parabola": "Parabola",
    "partial_fractions": "Partial Fractions",
    "permutations_combinations": "Permutations & Combinations",
    "plane": "Plane",
    "probability": "Probability",
    "properties_of_triangles": "Properties of Triangles",
    "quadratic_equations_and_expressions": "Quadratic Equations",
    "random_variables_and_probability_distribution": "Random Variables",
    "statistics": "Statistics",
    "straight_lines": "Straight Lines",
    "system_of_circles": "System of Circles",
    "tangents_and_normals": "Tangents & Normals",
    "theory_of_equations": "Theory of Equations",
    "trigonometry_upto_transformations": "Trigonometry",
    "vector_addition": "Vector Addition"
}

pyq_source_path = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\PYQS\Maths\eamcet_pyq_questions_maths.json"
maths_dir = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS"

def migrate_topic_with_pyq_injection(filename):
    if not filename.endswith(".json.bak"):
        return

    topic_slug = filename.replace(".json.bak", "")
    pyq_key = TOPIC_TO_PYQ_KEY.get(topic_slug)
    backup_path = os.path.join(maths_dir, filename)
    target_dir = os.path.join(maths_dir, topic_slug)

    if not pyq_key:
        print(f"Skipping {topic_slug}: No mapping found.")
        return

    # Ensure target directory exists
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)

    try:
        with open(backup_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            questions = data.get("questions", [])

        # Load PYQ source
        with open(pyq_source_path, 'r', encoding='utf-8') as f:
            pyq_data = json.load(f)
            raw_pyqs = pyq_data.get(pyq_key, [])

        # Filter already tagged pyqs in current bank
        existing_pyqs = [q for q in questions if q.get('pyq')]
        others = [q for q in questions if not q.get('pyq')]

        # If we are missing pyqs (we need 20), pull from raw_pyqs
        if len(existing_pyqs) < 20:
            diff = 20 - len(existing_pyqs)
            # Tag raw ones as pyqs
            new_pyqs = []
            for q in raw_pyqs:
                # Basic check to avoid duplication (imperfect but better than nothing)
                q_text = q['question'].strip().lower()
                if not any(eq['question'].strip().lower() == q_text for eq in existing_pyqs):
                   q['pyq'] = True
                   q['tag'] = 'pyq'
                   new_pyqs.append(q)
            
            # Select enough to reach 20
            injection = new_pyqs[:diff]
            existing_pyqs += injection
            
            # If we injected new ones, we must REMOVE others to keep total = 80
            # Remove from 'others' pool
            num_to_remove = len(injection)
            others = others[:-num_to_remove] if num_to_remove < len(others) else []

        # Final pools
        final_pyqs = existing_pyqs[:20]
        final_others = others[:60] # Total 80
        
        # Distribute 5 PYQs and 15 others into each of 4 attempts
        for i in range(4):
            batch_pyqs = final_pyqs[i*5 : (i+1)*5]
            batch_others = final_others[i*15 : (i+1)*15]
            batch = batch_pyqs + batch_others
            
            random.shuffle(batch)

            # Re-index
            for idx, q in enumerate(batch):
                q['id'] = idx + 1

            attempt_data = {"questions": batch}
            attempt_filename = f"attempt_{i+1}.json"
            attempt_path = os.path.join(target_dir, attempt_filename)

            with open(attempt_path, 'w', encoding='utf-8') as out:
                json.dump(attempt_data, out, ensure_ascii=False, indent=2)

        print(f"Correctly restructured {topic_slug}: 4 batches (5 PYQ each).")

    except Exception as e:
        print(f"Error migrating {filename}: {e}")

# Process
for f in os.listdir(maths_dir):
    if f.endswith(".json.bak"):
        migrate_topic_with_pyq_injection(f)

print("Restructure with PYQ Injection complete.")

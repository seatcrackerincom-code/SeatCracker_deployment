import os
import json

# Paths
base_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS'
pyq_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\PYQS\Maths\eamcet_pyq_questions_maths.json'

# Mappings (Source Topic -> Filename)
mapping = {
    "Trigonometry": "trigonometry_upto_transformations.json",
    "Integration": "integration.json",
    "Circles": "circles.json",
    "Probability": "probability.json",
    "3D Geometry": "dc_s_and_dr_s.json",
    "Areas": "areas_under_curves.json",
    "Binomial Theorem": "binomial_theorem.json",
    "Complex Numbers": "complex_numbers.json",
    "Cross Product": "cross_product_vectors.json",
    "De Moivre's Theorem": "de_moivre_s_theorem.json",
    "Definite Integrals": "definite_integrals.json",
    "Differential Equations": "differential_equations.json",
    "Differentiation": "differentiation.json",
    "Dot Product": "dot_product_vectors.json",
    "Ellipse": "ellipse.json",
    "Functions": "functions.json",
    "Hyperbola": "hyperbola.json",
    "Hyperbolic Functions": "hyperbolic_functions.json",
    "Limits & Continuity": "limits_continuity.json",
    "Locus": "locus.json",
    "Matrices & Determinants": "matrices_and_determinants.json",
    "Maxima & Minima": "maxima_and_minima.json",  # Will create
    "Multiple Angles": "multiple_and_sub_multiple_angles.json",
    "Pair of Straight Lines": "pair_of_straight_lines.json",
    "Parabola": "parabola.json",
    "Partial Fractions": "partial_fractions.json",
    "Permutations & Combinations": "permutations_combinations.json",
    "Plane": "plane.json",
    "Properties of Triangles": "properties_of_triangles.json",
    "Quadratic Equations": "quadratic_equations_and_expressions.json",
    "Random Variables": "random_variables_and_probability_distribution.json",
    "Statistics": "statistics.json",
    "Straight Lines": "straight_lines.json",
    "System of Circles": "system_of_circles.json",
    "Tangents & Normals": "tangents_and_normals.json",
    "Theory of Equations": "theory_of_equations.json",  # Will create
    "Vector Addition": "vector_addition.json"  # Will create
}

# Load PYQ Data
with open(pyq_file, 'r', encoding='utf-8') as f:
    pyq_data = json.load(f)

# Track progress
merged_count = 0
created_count = 0

# Available IDs based on gaps and next high: [2, 3, 5, 20, 39, 41, 42...]
available_ids = [2, 3, 5, 20, 39, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
next_id_idx = 0

for topic, pyqs in pyq_data.items():
    if topic not in mapping:
        print(f"Skipping topic: {topic} (no mapping)")
        continue
    
    file_name = mapping[topic]
    full_path = os.path.join(base_dir, file_name)
    
    # Load or Create Topic JSON
    if os.path.exists(full_path):
        with open(full_path, 'r', encoding='utf-8') as f:
            topic_json = json.load(f)
    else:
        # Create Skeleton
        topic_id = available_ids[next_id_idx]
        next_id_idx += 1
        topic_json = {
            "topic_id": topic_id,
            "topic_name": topic.upper(),
            "weightage": 1,
            "priority": "Medium",
            "subtopics": [topic],
            "questions": []
        }
        created_count += 1
        print(f"Creating new topic file: {file_name}")

    # Process and Merge PYQs
    existing_questions = {q['question'] for q in topic_json.get('questions', [])}
    
    for q in pyqs:
        if q['question'] in existing_questions:
            continue
            
        # Normalize structure
        new_q = {
            "id": 0,  # Temporary
            "question": q['question'],
            "difficulty": q['difficulty'].capitalize(),
            "hasDiagram": q.get('hasDiagram', False),
            "diagram_description": q.get('diagram_description', ""),
            "options": q['options'],
            "answer": q['answer'],
            "pyq": True,
            "tag": "pyq"
        }
        topic_json['questions'].append(new_q)
        existing_questions.add(q['question'])

    # Perfect ID Re-indexing (1, 2, 3...)
    for i, q in enumerate(topic_json['questions'], 1):
        q['id'] = i
        
    # Save with ensure_ascii=False
    with open(full_path, 'w', encoding='utf-8') as f:
        json.dump(topic_json, f, indent=2, ensure_ascii=False)
    
    merged_count += 1

print(f"Finished! Successfully merged/updated {merged_count} topic files.")
print(f"Created {created_count} new topic files.")

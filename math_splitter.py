import json
import os
import re

# --- CONFIG ---
# This matches the folder structure of your React app
QUESTIONS_DIR = "seatcracker-app/public/questions/Mathematics"
MASTER_FILE = "MASTER_MATHS.json"

# The 40 Main Maths Topics from your Syllabus
MAIN_TOPICS = [
    "Trigonometry Upto Transformations", "Integration", "Circles", "Probability", 
    "Definite Integrals", "Complex Numbers", "Properties of Triangles", 
    "Differential Equations", "Limits & Continuity", "Straight Lines", 
    "Matrices and Determinants", "Permutations & Combinations", "Tangents and Normals", 
    "Quadratic Equations and Expressions", "Differentiation", "Functions", 
    "Binomial Theorem", "Random Variables and Probability Distribution", 
    "Vector Addition", "Theory of Equations", "Hyperbola", "Pair of Straight Lines", 
    "Cross Product (Vectors)", "Maxima and Minima", "3D Coordinate System", 
    "Ellipse", "Parabola", "Plane", "Dot Product (Vectors)", "Hyperbolic Functions", 
    "Statistics", "Locus", "Partial Fractions", "Areas", "System of Circles", 
    "Multiple and Sub Multiple Angles", "DC'S and DR'S", "De Moivre's Theorem", 
    "Triple Product of Vector's", "Mean Value Theorem"
]

def slugify(text):
    """Converts 'Topic Name & Stuff' to 'Topic_Name__Stuff.json'"""
    s = text.replace(" ", "_")
    s = re.sub(r"[^a-zA-Z0-9_]", "", s)
    return s + ".json"

def split_questions():
    if not os.path.exists(MASTER_FILE):
        print(f"ERROR: Could not find {MASTER_FILE}")
        print("Please create this file and paste all your questions in it.")
        return

    try:
        with open(MASTER_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"ERROR reading JSON: {e}")
        return

    # Ensure output dir exists
    os.makedirs(QUESTIONS_DIR, exist_ok=True)

    # Group by topic
    buckets = {topic: [] for topic in MAIN_TOPICS}
    unknown = []

    for q in data:
        topic_found = False
        # Try to find which main topic this question belongs to
        q_topic = q.get("topic", "")
        if q_topic in buckets:
            buckets[q_topic].append(q)
            topic_found = True
        
        if not topic_found:
            unknown.append(q)

    # Save files
    for topic, questions in buckets.items():
        if not questions:
            continue
            
        filename = slugify(topic)
        filepath = os.path.join(QUESTIONS_DIR, filename)
        
        # Merge with existing if file exists
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                existing = json.load(f)
                # Avoid duplicates
                existing_qs = [ex.get("question") for ex in existing]
                new_qs = [nq for nq in questions if nq.get("question") not in existing_qs]
                questions = existing + new_qs

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(questions, f, indent=2, ensure_ascii=False)
        print(f"Successfully processed {topic} -> {len(questions)} questions total.")

    if unknown:
        print(f"\nNOTE: {len(unknown)} questions had unknown topics and were skipped.")

if __name__ == "__main__":
    split_questions()

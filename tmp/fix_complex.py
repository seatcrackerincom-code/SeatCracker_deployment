import json
import os

target_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\complex_numbers.json'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Salvage the good part up to ID 60
# ID 60 ends before ID 61 starts.
if '\"id\": 61' in content:
    good_part = content.split('\"id\": 61')[0].rstrip()
    # Ensure we end at a clean question object boundary
    if good_part.rstrip().endswith('{'):
        good_part = good_part.rsplit('{', 1)[0].rstrip().rstrip(',')
else:
    # If 61 is not there, maybe it's even more broken. 
    # Let's find the last '}' that closes a question object.
    last_bracket = content.rfind('}')
    good_part = content[:last_bracket+1]

# Re-parse or just ensure it's a valid list start
if not good_part.strip().endswith(']'):
    # We need to make sure we have a valid trailing comma or start of list
    pass

new_questions = [
    {
        "id": 61,
        "question": "The value of i + i² + i³ + ... + i⁴⁰⁰ is?",
        "difficulty": "Medium",
        "hasDiagram": False,
        "diagram_description": "",
        "options": {"A": "1", "B": "0", "C": "i", "D": "-1"},
        "answer": "A",
        "pyq": True,
        "tag": "pyq"
    },
    {
        "id": 62,
        "question": "If z = r·e^(iθ), then |e^(iz)| = ?",
        "difficulty": "Hard",
        "hasDiagram": False,
        "diagram_description": "",
        "options": {"A": "e^(−r sin θ)", "B": "e^(r cos θ)", "C": "1", "D": "e^r"},
        "answer": "A",
        "pyq": True,
        "tag": "pyq"
    },
    {
        "id": 63,
        "question": "The principal argument of (−1 − i) is?",
        "difficulty": "Medium",
        "hasDiagram": False,
        "diagram_description": "",
        "options": {"A": "−3π/4", "B": "3π/4", "C": "−π/4", "D": "5π/4"},
        "answer": "A",
        "pyq": True,
        "tag": "pyq"
    },
    {
        "id": 64,
        "question": "If z + 1/z = 2cosθ, then zⁿ + 1/zⁿ = ?",
        "difficulty": "Hard",
        "hasDiagram": False,
        "diagram_description": "",
        "options": {"A": "2cos(nθ)", "B": "2sin(nθ)", "C": "cos(nθ)", "D": "2ncos θ"},
        "answer": "A",
        "pyq": True,
        "tag": "pyq"
    },
    {
        "id": 65,
        "question": "If the area of the triangle on the Argand plane formed by the points z, iz, and z+iz is 50, then |z| is ______.",
        "difficulty": "Hard",
        "hasDiagram": False,
        "diagram_description": "",
        "options": {"A": "10", "B": "5", "C": "√50", "D": "20"},
        "answer": "A",
        "pyq": False,
        "tag": "hard"
    },
    {
        "id": 66,
        "question": "The sum of the roots of (z+1)ⁿ = (z-1)ⁿ is always ______.",
        "difficulty": "Hard",
        "hasDiagram": False,
        "diagram_description": "",
        "options": {"A": "0", "B": "n", "C": "n-1", "D": "None"},
        "answer": "A",
        "pyq": False,
        "tag": "hard"
    },
    {
        "id": 67,
        "question": "The locus of z such that Re(z²) = 2 is a ______.",
        "difficulty": "Hard",
        "hasDiagram": False,
        "diagram_description": "",
        "options": {"A": "Rectangular Hyperbola", "B": "Circle", "C": "Ellipse", "D": "Parabola"},
        "answer": "A",
        "pyq": False,
        "tag": "hard"
    },
    {
        "id": 68,
        "question": "If z₁, z₂, z₃ are roots of z³ - 3z² + 3z + 7 = 0, then the centroid of the triangle formed by them is ______.",
        "difficulty": "Hard",
        "hasDiagram": False,
        "diagram_description": "",
        "options": {"A": "1", "B": "0", "C": "i", "D": "None"},
        "answer": "A",
        "pyq": False,
        "tag": "hard"
    },
    {
        "id": 69,
        "question": "Finding the maximum value of |z| given |z - 3/z| = 2 leads to |z| = ______.",
        "difficulty": "Hard",
        "hasDiagram": False,
        "diagram_description": "",
        "options": {"A": "√3 + 1", "B": "√3 - 1", "C": "2", "D": "√5 + 1"},
        "answer": "A",
        "pyq": False,
        "tag": "hard"
    },
    {
        "id": 70,
        "question": "If |z-1| ≤ 2 and |z-2| ≤ |z-4|, the area of the common region in the complex plane is ______.",
        "difficulty": "Hard",
        "hasDiagram": False,
        "diagram_description": "",
        "options": {"A": "2π/3 + √3", "B": "π", "C": "2π", "D": "None"},
        "answer": "A",
        "pyq": False,
        "tag": "hard"
    },
    {
        "id": 71,
        "question": "The number of real solutions of the equation |z|² - 2iz + (2i-1) = 0 is ______.",
        "difficulty": "Hard",
        "hasDiagram": False,
        "diagram_description": "",
        "options": {"A": "1", "B": "0", "C": "2", "D": "Infinite"},
        "answer": "A",
        "pyq": False,
        "tag": "hard"
    },
    {
        "id": 72,
        "question": "If z = (1+i) / (1-i), then the smallest positive integer n for which zⁿ = 1 is ______.",
        "difficulty": "Hard",
        "hasDiagram": False,
        "diagram_description": "",
        "options": {"A": "4", "B": "2", "C": "8", "D": "12"},
        "answer": "A",
        "pyq": False,
        "tag": "hard"
    },
    {
        "id": 73,
        "question": "The number of complex numbers z satisfying |z| = 1 and Re((1-iz)/(1+iz)) = 0 is ______.",
        "difficulty": "Hard",
        "hasDiagram": False,
        "diagram_description": "",
        "options": {"A": "2", "B": "1", "C": "0", "D": "Infinite"},
        "answer": "A",
        "pyq": False,
        "tag": "hard"
    },
    {
        "id": 74,
        "question": "If arg(z) < 0, then the value of arg(-z) - arg(z) is ______.",
        "difficulty": "Hard",
        "hasDiagram": False,
        "diagram_description": "",
        "options": {"A": "π", "B": "-π", "C": "π/2", "D": "2π"},
        "answer": "A",
        "pyq": False,
        "tag": "hard"
    },
    {
        "id": 75,
        "question": "The value of the sum Σ_{k=1}^{10} (sin(2kπ/11) + i cos(2kπ/11)) is ______.",
        "difficulty": "Hard",
        "hasDiagram": False,
        "diagram_description": "",
        "options": {"A": "-i", "B": "i", "C": "1", "D": "0"},
        "answer": "A",
        "pyq": False,
        "tag": "hard"
    },
    {
        "id": 76,
        "question": "If |z| = 1 and z ≠ ±1, then all the values of z / (1 - z²) lie on ______.",
        "difficulty": "Hard",
        "hasDiagram": False,
        "diagram_description": "",
        "options": {"A": "Imaginary axis", "B": "Real axis", "C": "Unit Circle", "D": "None"},
        "answer": "A",
        "pyq": False,
        "tag": "hard"
    },
    {
      "id": 77,
      "question": "The locus of z satisfying |z-i| + |z+i| = 4 is represented by the equation ______.",
      "difficulty": "Hard",
      "hasDiagram": False,
      "diagram_description": "",
      "options": {"A": "x²/3 + y²/4 = 1", "B": "x²/4 + y²/3 = 1", "C": "x²/16 + y²/15 = 1", "D": "None"},
      "answer": "A",
      "pyq": False,
      "tag": "hard"
    },
    {
      "id": 78,
      "question": "If z₁, z₂, z₃ are vertices of an equilateral triangle inscribed in the circle |z| = 2, and z₁ = 1 + i√3, then z₂ is ______.",
      "difficulty": "Hard",
      "hasDiagram": False,
      "diagram_description": "",
      "options": {"A": "-2", "B": "1 - i√3", "C": "2", "D": "i"},
      "answer": "A",
      "pyq": False,
      "tag": "hard"
    },
    {
      "id": 79,
      "question": "The value of (√3 + i)¹⁰⁰ + (√3 - i)¹⁰⁰ is ______.",
      "difficulty": "Hard",
      "hasDiagram": False,
      "diagram_description": "",
      "options": {"A": "-2¹⁰⁰", "B": "2¹⁰⁰", "C": "2¹⁰¹", "D": "0"},
      "answer": "A",
      "pyq": False,
      "tag": "hard"
    },
    {
      "id": 80,
      "question": "If ω is a complex cube root of unity, then the value of (1+ω)(1+ω²)(1+ω⁴)(1+ω⁸) is ______.",
      "difficulty": "Hard",
      "hasDiagram": False,
      "diagram_description": "",
      "options": {"A": "1", "B": "0", "C": "ω", "D": "9"},
      "answer": "A",
      "pyq": False,
      "tag": "hard"
    }
]

# Ensure good_part ends before the questions list closes
# We split by '\"id\": 61' before, so good_part should end around ID 60's }.
# Let's find the last '}' and everything before it.
last_q_end = good_part.rfind('}')
if last_q_end != -1:
    good_part = good_part[:last_q_end+1]

# Rebuild the full JSON by parsing the good part to ensure validity
try:
    # We need to close the JSON first to parse it
    incomplete_json = good_part + "\n  ]\n}"
    data = json.loads(incomplete_json)
    # Now merge
    data['questions'] = data['questions'][:60] # Keep first 60
    data['questions'].extend(new_questions)
    
    with open(target_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully fixed complex_numbers.json")
except Exception as e:
    print(f"Error: {e}")
    # Fallback: if parsing fails, we might have to manually strip more.

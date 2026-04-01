"""
EAMCET Question File Generator
-------------------------------
Run this script in CMD:
    cd C:\\Users\\admin\\OneDrive\\Desktop\\SeatCracker\\question_generator
    python generate_questions.py

It reads all syllabus files and creates correctly-named JSON files
under: seatcracker-app/public/questions/{Subject}/{Topic_Name}.json

Each new file gets 5 template questions. Fill them with real questions!
Already-existing files are SKIPPED (not overwritten).
"""

import json
import os
import re

# ── Config ──────────────────────────────────────────────────────────
BASE   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SYLLABUS_ROOT = os.path.join(BASE, "seatcracker-app", "public", "SYLLABUS")
OUT_ROOT      = os.path.join(BASE, "seatcracker-app", "public", "questions")

def topic_to_filename(topic: str) -> str:
    """Convert topic name to file-safe slug matching ExamPractice.tsx logic."""
    slug = topic.replace(" ", "_")
    slug = re.sub(r"[^a-zA-Z0-9_]", "", slug)
    return slug + ".json"

def make_template(topic: str, subject: str, subtopics: list) -> list:
    """5 template questions so the file is valid JSON immediately."""
    subs = subtopics[:3] if subtopics else [topic]
    return [
        {
            "question": f"{topic} — Sample Question {i+1}: Add real JSON data to /questions/{subject}/{topic_to_filename(topic)[:-5]}.json",
            "difficulty": ["Easy","Medium","Hard"][i % 3],
            "hasDiagram": False,
            "diagram_description": "",
            "options": {
                "A": "Option A",
                "B": "Option B",
                "C": "Option C",
                "D": "Option D"
            },
            "answer": "A"
        }
        for i in range(5)
    ]

# ── Walk every syllabus file ─────────────────────────────────────────
created = 0
skipped = 0
errors  = 0

for root, dirs, files in os.walk(SYLLABUS_ROOT):
    for fname in files:
        if not fname.endswith(".json"):
            continue
        # Skip formula files
        if "formulas" in root:
            continue

        syllabus_path = os.path.join(root, fname)
        subject_name  = fname.replace(".json", "")  # e.g. Mathematics

        try:
            with open(syllabus_path, "r", encoding="utf-8") as f:
                chapters = json.load(f)
        except Exception as e:
            print(f"  [ERROR] Could not read {syllabus_path}: {e}")
            errors += 1
            continue

        out_dir = os.path.join(OUT_ROOT, subject_name)
        os.makedirs(out_dir, exist_ok=True)

        for ch in chapters:
            topic     = ch.get("chapter", "")
            subtopics = ch.get("subtopics", [])
            if not topic:
                continue

            out_file = os.path.join(out_dir, topic_to_filename(topic))

            if os.path.exists(out_file):
                print(f"  [SKIP]    {subject_name}/{topic_to_filename(topic)}")
                skipped += 1
                continue

            questions = make_template(topic, subject_name, subtopics)
            with open(out_file, "w", encoding="utf-8") as f:
                json.dump(questions, f, indent=2, ensure_ascii=False)

            print(f"  [CREATED] {subject_name}/{topic_to_filename(topic)}")
            created += 1

print(f"\nDone! Created: {created}  |  Skipped (already exist): {skipped}  |  Errors: {errors}")
print(f"\nNow open the files in: {OUT_ROOT}")
print("Replace the template questions with real EAMCET MCQs.")
print("\nJSON format per question:")
print('''{
  "question": "Your question?",
  "difficulty": "Easy",          <-- Easy / Medium / Hard
  "hasDiagram": false,
  "diagram_description": "",
  "options": { "A":"...", "B":"...", "C":"...", "D":"..." },
  "answer": "A"                  <-- correct option key
}''')

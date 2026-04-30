import re
import json

def parse_questions(filename):
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Split by topics
    # Topics are marked by "∑" in maths and "■■" in physics
    # But wait, looking at the extract, physics uses ■■ and maths uses ∑.
    # Let's use a regex that matches both
    topic_matches = list(re.finditer(r'(?:∑|■■)\s+([A-Z, \(\)&]+)', content))
    
    topics = []
    for i in range(len(topic_matches)):
        start = topic_matches[i].start()
        end = topic_matches[i+1].start() if i+1 < len(topic_matches) else len(content)
        
        topic_name = topic_matches[i].group(1).strip()
        topic_content = content[start:end]
        
        # Parse questions in this topic
        # Q001. or Q01.
        q_matches = list(re.finditer(r'Q\d+\.\n(.*?)\n([A-D]\).*?)\n([A-D]\).*?)\n([A-D]\).*?)\n([A-D]\).*?)\n(?:■|■ Answer:)\s+([A-D])\)\s*(.*?)\n■\s+(.*?)(?=\nQ\d+\.|\n(?:∑|■■)|\Z)', topic_content, re.DOTALL))
        
        questions = []
        for q in q_matches:
            q_text = q.group(1).strip()
            options = [q.group(2).strip(), q.group(3).strip(), q.group(4).strip(), q.group(5).strip()]
            correct_option = q.group(6).strip()
            explanation = q.group(7).strip()
            hint = q.group(8).strip()
            
            questions.append({
                "question": q_text,
                "options": options,
                "answer": correct_option,
                "explanation": explanation,
                "hint": hint
            })
        
        if questions:
            topics.append({
                "topic": topic_name,
                "questions": questions
            })
            
    return topics

math_topics = parse_questions("math_questions_extract.txt")
phy_topics = parse_questions("phy_questions_extract.txt")

data = {
    "Mathematics": math_topics,
    "Physics": phy_topics,
    "Chemistry": [] # Still coming soon
}

with open("RepeatedQuestionsData.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Parsed successfully to RepeatedQuestionsData.json")

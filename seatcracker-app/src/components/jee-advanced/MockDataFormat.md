# JEE Advanced Mock Data Format

The JEE Advanced JSON files should follow this structure to support the multi-section UI:

```json
[
  {
    "id": 1,
    "subject": "Mathematics",
    "section": 1,
    "type": "MCQ",
    "text": "Question text or image path...",
    "image": "/path/to/image.png",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "A",
    "marks": {
      "correct": 3,
      "negative": 1
    }
  },
  {
    "id": 5,
    "subject": "Mathematics",
    "section": 2,
    "type": "MSQ",
    "text": "Multiple selection question...",
    "options": ["A", "B", "C", "D"],
    "answer": ["A", "C"],
    "marks": {
      "correct": 4,
      "negative": 2,
      "partial": 1
    }
  },
  {
    "id": 9,
    "subject": "Mathematics",
    "section": 3,
    "type": "SA",
    "text": "Numerical response question...",
    "answer": "12.5",
    "marks": {
      "correct": 4,
      "negative": 0
    }
  }
]
```

## Key Fields:
- `section`: 1, 2, 3, or 4.
- `type`: `MCQ` (Single Correct), `MSQ` (Multiple Select), or `SA` (Subjective/Numerical).
- `marks`: Object containing `correct`, `negative`, and optionally `partial` marks.

export interface BattleQuestion {
  id: number;
  subject: "Mathematics" | "Physics" | "Chemistry";
  question: string;
  options: { A: string; B: string; C: string; D: string };
  answer: "A" | "B" | "C" | "D";
}

export function generateDummyBattleQuestions(): BattleQuestion[] {
  const questions: BattleQuestion[] = [];
  
  // 80 Maths
  for (let i = 1; i <= 80; i++) {
    questions.push({
      id: i,
      subject: "Mathematics",
      question: `This is dummy Mathematics question #${i}. What is the correct choice?`,
      options: { A: "Option A", B: "Option B", C: "Option C", D: "Option D" },
      answer: "A"
    });
  }

  // 40 Physics
  for (let i = 1; i <= 40; i++) {
    questions.push({
      id: 80 + i,
      subject: "Physics",
      question: `This is dummy Physics question #${i}. Choose the right answer.`,
      options: { A: "First Option", B: "Second Option", C: "Third Option", D: "Fourth Option" },
      answer: "B"
    });
  }

  // 40 Chemistry
  for (let i = 1; i <= 40; i++) {
    questions.push({
      id: 120 + i,
      subject: "Chemistry",
      question: `This is dummy Chemistry question #${i}. Identify the correct chemical property.`,
      options: { A: "Property A", B: "Property B", C: "Property C", D: "Property D" },
      answer: "C"
    });
  }

  return questions;
}

export interface ExamConfig {
  examId: string;
  examName: string;
  isPremium: boolean;
  price: number;
  totalDays: number;
  freeDays: number;
}

export const EXAM_CONFIGS: Record<string, ExamConfig> = {
  "jee-advanced": {
    examId: "jee-advanced",
    examName: "JEE Advanced",
    isPremium: true,
    price: 39,
    totalDays: 10,
    freeDays: 1,
  },
  "eamcet": {
    examId: "eamcet",
    examName: "EAMCET",
    isPremium: false,
    price: 0,
    totalDays: 10,
    freeDays: 10,
  }
};

export function getExamConfig(examId: string): ExamConfig {
  return EXAM_CONFIGS[examId] || {
    examId,
    examName: examId.toUpperCase(),
    isPremium: false,
    price: 0,
    totalDays: 10,
    freeDays: 10,
  };
}

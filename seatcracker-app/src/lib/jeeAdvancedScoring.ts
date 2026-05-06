/**
 * JEE Advanced Scoring Engine — Pure Functions
 * 
 * Covers all marking rules for Paper 1 (4 sections) and Paper 2 (4 sections).
 * No side effects — pure computation only.
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface JEEQuestion {
  id: string;
  subject: "Math" | "Phy" | "Chem";
  section: number;          // 1–4
  type: "MCQ" | "MSQ" | "SA" | "MATCH" | "SA_DECIMAL";
  answer?: string | string[];  // correct answer(s)
  match_options?: Record<string, Record<string, number>>; // For MATCH type
  passage?: string;         // For SA_DECIMAL (Paper 2 Sec 4)
}

export interface JEEResponse {
  option: string | string[] | null;
  status: number; // 0=not visited, 1=not answered, 2=answered, 3=marked, 4=answered+marked
}

export interface SubjectScores {
  physics: number;
  chemistry: number;
  maths: number;
}

export interface PaperResult {
  physics: number;
  chemistry: number;
  maths: number;
  total: number;
  correct: number;
  wrong: number;
  unattempted: number;
}

export interface FullResult {
  paper1: PaperResult;
  paper2: PaperResult;
  combined: {
    physics: number;    // max 120
    chemistry: number;  // max 120
    maths: number;      // max 120
    grandTotal: number; // max 360
    totalCorrect: number;
    totalWrong: number;
    totalUnattempted: number;
    accuracyPercent: number;   // 1 decimal
    timeEfficiencyTag: string;
  };
}

export interface PercentileResult {
  overall: number;
  physics: number;
  chemistry: number;
  maths: number;
  rankEstimate: number;
  totalStudents: number;
}

export interface CategoryRow {
  category: string;
  aggregateThreshold: number;
  subjectThreshold: number;
  qualified: boolean;
  failReason: string | null;
  estimatedCategoryRank: number | null;
  marksNeeded: {
    aggregate: number;
    physics: number;
    chemistry: number;
    maths: number;
  };
}

export interface PerformanceResult {
  tag: string;
  subjectClassifications: {
    physics: "Strong" | "Average" | "Weak";
    chemistry: "Strong" | "Average" | "Weak";
    maths: "Strong" | "Average" | "Weak";
  };
  strongSubjects: string[];
  weakSubjects: string[];
  averageSubjects: string[];
  improvementTip: string;
}

// ─── STEP 1: Marks Calculation Engine ──────────────────────────────────────────

/**
 * Score a single question based on paper number, section, type, and student response.
 * Returns { marks, isCorrect, isWrong, isUnattempted }
 */
function scoreQuestion(
  question: JEEQuestion,
  response: JEEResponse | undefined,
  paperNum: 1 | 2
): { marks: number; isCorrect: boolean; isWrong: boolean; isUnattempted: boolean } {
  const studentAnswer = response?.option;
  const correctAnswer = question.answer;

  // Unattempted check
  const isUnattempted = !studentAnswer ||
    (Array.isArray(studentAnswer) && studentAnswer.length === 0) ||
    (response?.status === 0 || response?.status === 1);

  if (isUnattempted) {
    return { marks: 0, isCorrect: false, isWrong: false, isUnattempted: true };
  }

  // No answer key available — can't score
  if (correctAnswer === undefined || correctAnswer === null) {
    return { marks: 0, isCorrect: false, isWrong: false, isUnattempted: true };
  }

  const section = question.section;
  const type = question.type;

  // ── Paper 1 Section Logic ─────────────────────────────────────────
  if (paperNum === 1) {
    switch (section) {
      case 1: // Single Correct MCQ: +3/-1
        if (type === "MCQ") {
          const correct = String(studentAnswer) === String(correctAnswer);
          return { marks: correct ? 3 : -1, isCorrect: correct, isWrong: !correct, isUnattempted: false };
        }
        break;

      case 2: // Multi Correct MCQ: +4(all)/ +1 per partial / -2 (any wrong)
        if (type === "MSQ") {
          return scoreMSQ(studentAnswer, correctAnswer);
        }
        break;

      case 3: // Numerical Integer: +4/0
        if (type === "SA") {
          const correct = compareNumerical(studentAnswer, correctAnswer);
          return { marks: correct ? 4 : 0, isCorrect: correct, isWrong: !correct, isUnattempted: false };
        }
        break;

      case 4: // Match List MCQ: +3/-1
        if (type === "MATCH" || type === "MCQ") {
          const correct = String(studentAnswer) === String(correctAnswer);
          return { marks: correct ? 3 : -1, isCorrect: correct, isWrong: !correct, isUnattempted: false };
        }
        break;
    }
  }

  // ── Paper 2 Section Logic ─────────────────────────────────────────
  if (paperNum === 2) {
    switch (section) {
      case 1: // Single Correct MCQ: +3/-1
        if (type === "MCQ") {
          const correct = String(studentAnswer) === String(correctAnswer);
          return { marks: correct ? 3 : -1, isCorrect: correct, isWrong: !correct, isUnattempted: false };
        }
        break;

      case 2: // Multi Correct MCQ: +4/ +1 partial / -2
        if (type === "MSQ") {
          return scoreMSQ(studentAnswer, correctAnswer);
        }
        break;

      case 3: // Numerical Non-Negative Integer: +4/0
        if (type === "SA") {
          const correct = compareNumerical(studentAnswer, correctAnswer);
          return { marks: correct ? 4 : 0, isCorrect: correct, isWrong: !correct, isUnattempted: false };
        }
        break;

      case 4: // Paragraph Based Numerical Decimal: +3/0 (ZERO negative)
        if (type === "SA_DECIMAL" || type === "SA") {
          const correct = compareDecimal(studentAnswer, correctAnswer);
          return { marks: correct ? 3 : 0, isCorrect: correct, isWrong: !correct, isUnattempted: false };
        }
        break;
    }
  }

  // Fallback — shouldn't reach here
  return { marks: 0, isCorrect: false, isWrong: false, isUnattempted: true };
}

/** MSQ scoring: +4 all correct, +1 per correct option if no wrong selected, -2 if any wrong */
function scoreMSQ(
  studentAnswer: string | string[] | null,
  correctAnswer: string | string[]
): { marks: number; isCorrect: boolean; isWrong: boolean; isUnattempted: boolean } {
  const studentArr = Array.isArray(studentAnswer) ? studentAnswer : [String(studentAnswer)];
  const correctArr = Array.isArray(correctAnswer) ? correctAnswer : [String(correctAnswer)];

  const studentSet = new Set(studentArr.map(s => String(s).trim()));
  const correctSet = new Set(correctArr.map(s => String(s).trim()));

  // Check if any wrong option selected
  let hasWrong = false;
  for (const s of studentSet) {
    if (!correctSet.has(s)) {
      hasWrong = true;
      break;
    }
  }

  if (hasWrong) {
    return { marks: -2, isCorrect: false, isWrong: true, isUnattempted: false };
  }

  // Count how many correct options the student selected
  let correctCount = 0;
  for (const s of studentSet) {
    if (correctSet.has(s)) correctCount++;
  }

  if (correctCount === correctSet.size) {
    // All correct selected, no wrong
    return { marks: 4, isCorrect: true, isWrong: false, isUnattempted: false };
  }

  if (correctCount > 0) {
    // Partial credit: +1 per correct chosen
    return { marks: correctCount, isCorrect: false, isWrong: false, isUnattempted: false };
  }

  return { marks: 0, isCorrect: false, isWrong: false, isUnattempted: true };
}

/** Compare numerical (integer) answers — exact string match after trimming */
function compareNumerical(student: string | string[] | null, correct: string | string[]): boolean {
  const sVal = String(Array.isArray(student) ? student[0] : student).trim();
  const cVal = String(Array.isArray(correct) ? correct[0] : correct).trim();

  // Try numeric comparison
  const sNum = parseFloat(sVal);
  const cNum = parseFloat(cVal);

  if (!isNaN(sNum) && !isNaN(cNum)) {
    return Math.abs(sNum - cNum) < 0.001; // Integer comparison with tiny epsilon
  }

  return sVal === cVal;
}

/** Compare decimal answers — must match to 2 decimal places */
function compareDecimal(student: string | string[] | null, correct: string | string[]): boolean {
  const sVal = String(Array.isArray(student) ? student[0] : student).trim();
  const cVal = String(Array.isArray(correct) ? correct[0] : correct).trim();

  const sNum = parseFloat(sVal);
  const cNum = parseFloat(cVal);

  if (isNaN(sNum) || isNaN(cNum)) return false;

  // Match to 2 decimal places: round both and compare
  const sRounded = Math.round(sNum * 100) / 100;
  const cRounded = Math.round(cNum * 100) / 100;

  return Math.abs(sRounded - cRounded) < 0.001;
}

/**
 * Calculate marks for both papers combined.
 */
export function calculateMarks(
  paper1Questions: JEEQuestion[],
  paper1Responses: Record<string, JEEResponse>,
  paper2Questions: JEEQuestion[],
  paper2Responses: Record<string, JEEResponse>
): FullResult {
  const p1 = scorePaper(paper1Questions, paper1Responses, 1);
  const p2 = scorePaper(paper2Questions, paper2Responses, 2);

  const totalCorrect = p1.correct + p2.correct;
  const totalWrong = p1.wrong + p2.wrong;
  const totalUnattempted = p1.unattempted + p2.unattempted;

  const attempted = totalCorrect + totalWrong;
  const accuracyPercent = attempted > 0
    ? Math.round((totalCorrect / attempted) * 1000) / 10  // 1 decimal place
    : 0;

  let timeEfficiencyTag: string;
  if (totalUnattempted > 30) {
    timeEfficiencyTag = "Too many skipped";
  } else if (attempted > 0 && totalWrong > 0.4 * attempted) {
    timeEfficiencyTag = "Accuracy needs work";
  } else {
    timeEfficiencyTag = "Good attempt balance";
  }

  return {
    paper1: p1,
    paper2: p2,
    combined: {
      physics: p1.physics + p2.physics,
      chemistry: p1.chemistry + p2.chemistry,
      maths: p1.maths + p2.maths,
      grandTotal: p1.total + p2.total,
      totalCorrect,
      totalWrong,
      totalUnattempted,
      accuracyPercent,
      timeEfficiencyTag,
    },
  };
}

function scorePaper(
  questions: JEEQuestion[],
  responses: Record<string, JEEResponse>,
  paperNum: 1 | 2
): PaperResult {
  let physics = 0, chemistry = 0, maths = 0;
  let correct = 0, wrong = 0, unattempted = 0;

  for (const q of questions) {
    const res = responses[q.id];
    const result = scoreQuestion(q, res, paperNum);

    if (result.isCorrect) correct++;
    else if (result.isWrong) wrong++;
    else if (result.isUnattempted) unattempted++;

    // Assign marks to correct subject
    switch (q.subject) {
      case "Phy": physics += result.marks; break;
      case "Chem": chemistry += result.marks; break;
      case "Math": maths += result.marks; break;
    }
  }

  return {
    physics,
    chemistry,
    maths,
    total: physics + chemistry + maths,
    correct,
    wrong,
    unattempted,
  };
}

// ─── STEP 2: Percentile and Rank ───────────────────────────────────────────────

/**
 * NTA Standard Percentile Formula:
 * percentile = (students scoring ≤ this student / total students) × 100
 */
export function calculatePercentile(studentScore: number, allScores: number[]): number {
  if (allScores.length === 0) return 100.00;
  if (allScores.length === 1) return 100.00;

  const equalOrBelow = allScores.filter(s => s <= studentScore).length;
  const percentile = (equalOrBelow / allScores.length) * 100;

  return Math.round(percentile * 100) / 100; // 2 decimal places
}

/**
 * Calculate overall + subject-wise percentiles.
 */
export function calculateAllPercentiles(
  result: FullResult,
  allResults: { grandTotal: number; physics: number; chemistry: number; maths: number }[]
): PercentileResult {
  const allGrand = allResults.map(r => r.grandTotal);
  const allPhysics = allResults.map(r => r.physics);
  const allChemistry = allResults.map(r => r.chemistry);
  const allMaths = allResults.map(r => r.maths);

  const overall = calculatePercentile(result.combined.grandTotal, allGrand);
  const physics = calculatePercentile(result.combined.physics, allPhysics);
  const chemistry = calculatePercentile(result.combined.chemistry, allChemistry);
  const maths = calculatePercentile(result.combined.maths, allMaths);

  // Rank estimate
  const studentsAbove = allGrand.filter(s => s > result.combined.grandTotal).length;
  const rankEstimate = studentsAbove + 1;

  return {
    overall,
    physics,
    chemistry,
    maths,
    rankEstimate,
    totalStudents: allResults.length,
  };
}

// ─── STEP 3: Performance Tagger ────────────────────────────────────────────────

export function getPerformanceTag(grandTotal: number): string {
  if (grandTotal >= 280) return "Outstanding 🏆 — IIT Top Branch Territory";
  if (grandTotal >= 220) return "Excellent ⭐ — Strong IIT Chances";
  if (grandTotal >= 160) return "Good 👍 — IIT Possible with Right Strategy";
  if (grandTotal >= 100) return "Average 📈 — Needs Focused Improvement";
  if (grandTotal >= 60)  return "Below Average 📚 — Revise Core Concepts";
  return "Needs Serious Attention ⚠️";
}

/**
 * Heuristic Percentile Estimation (Based on approximate JEE Advanced 2023/2024 trends)
 * Marks vs Percentile (Estimated for 360 total)
 */
export function getHeuristicPercentile(score: number): number {
  if (score >= 320) return 99.99;
  if (score >= 280) return 99.95;
  if (score >= 240) return 99.8;
  if (score >= 200) return 99.5;
  if (score >= 180) return 99.0;
  if (score >= 160) return 98.0;
  if (score >= 140) return 96.5;
  if (score >= 120) return 94.0;
  if (score >= 100) return 90.0;
  if (score >= 80) return 85.0;
  if (score >= 60) return 78.0;
  if (score >= 40) return 65.0;
  if (score >= 20) return 40.0;
  return Math.max(0, score * 2); // Linear fallback for very low scores
}

function classifySubject(score: number): "Strong" | "Average" | "Weak" {
  if (score >= 84) return "Strong";  // 70%+ of 120
  if (score >= 60) return "Average"; // 50%-69%
  return "Weak";                     // <50%
}

export function getPerformanceAnalysis(
  physics: number,
  chemistry: number,
  maths: number,
  grandTotal: number
): PerformanceResult {
  const tag = getPerformanceTag(grandTotal);

  const phyClass = classifySubject(physics);
  const chemClass = classifySubject(chemistry);
  const mathClass = classifySubject(maths);

  const strong: string[] = [];
  const average: string[] = [];
  const weak: string[] = [];

  if (phyClass === "Strong") strong.push("Physics");
  else if (phyClass === "Average") average.push("Physics");
  else weak.push("Physics");

  if (chemClass === "Strong") strong.push("Chemistry");
  else if (chemClass === "Average") average.push("Chemistry");
  else weak.push("Chemistry");

  if (mathClass === "Strong") strong.push("Maths");
  else if (mathClass === "Average") average.push("Maths");
  else weak.push("Maths");

  // Improvement tip
  let improvementTip: string;
  if (weak.length === 3) {
    improvementTip = "Attempt full mocks daily and analyze mistakes";
  } else if (strong.length === 3) {
    improvementTip = "Maintain consistency and attempt more PYQs";
  } else if (weak.includes("Physics")) {
    improvementTip = "Focus on Mechanics and Electrostatics PYQs";
  } else if (weak.includes("Chemistry")) {
    improvementTip = "Revise Organic reactions and Physical Chemistry";
  } else if (weak.includes("Maths")) {
    improvementTip = "Practice Calculus and Coordinate Geometry daily";
  } else {
    improvementTip = "Keep practicing — consistency is the key to cracking JEE Advanced";
  }

  return {
    tag,
    subjectClassifications: {
      physics: phyClass,
      chemistry: chemClass,
      maths: mathClass,
    },
    strongSubjects: strong,
    weakSubjects: weak,
    averageSubjects: average,
    improvementTip,
  };
}

// ─── STEP 4: Category Qualification Table ──────────────────────────────────────

const CATEGORY_THRESHOLDS = [
  { category: "GEN (CRL)",  aggregateThreshold: 36, subjectThreshold: 12 },
  { category: "GEN-EWS",    aggregateThreshold: 33, subjectThreshold: 11 },
  { category: "OBC-NCL",    aggregateThreshold: 33, subjectThreshold: 11 },
  { category: "SC",          aggregateThreshold: 18, subjectThreshold: 6 },
  { category: "ST",          aggregateThreshold: 18, subjectThreshold: 6 },
  { category: "PwD",         aggregateThreshold: 18, subjectThreshold: 6 },
];

export function getCategoryTable(
  physics: number,
  chemistry: number,
  maths: number,
  grandTotal: number
): CategoryRow[] {
  return CATEGORY_THRESHOLDS.map(({ category, aggregateThreshold, subjectThreshold }) => {
    const aggGap = Math.max(0, aggregateThreshold - grandTotal);
    const phyGap = Math.max(0, subjectThreshold - physics);
    const chemGap = Math.max(0, subjectThreshold - chemistry);
    const mathGap = Math.max(0, subjectThreshold - maths);

    // Check aggregate first, then subjects
    let failReason: string | null = null;
    if (grandTotal < aggregateThreshold) {
      failReason = "aggregate_low";
    } else if (physics < subjectThreshold) {
      failReason = "physics_low";
    } else if (chemistry < subjectThreshold) {
      failReason = "chemistry_low";
    } else if (maths < subjectThreshold) {
      failReason = "maths_low";
    }

    // Heuristic Category Rank Projection (Rough estimate based on typical category ratios)
    let estimatedCategoryRank = null;
    if (failReason === null) {
      // Assuming a total CRL pool of ~200,000 for rank calculation
      // We calculate CRL rank first, then apply multiplier
      const heuristicCRL = Math.max(1, Math.round(200000 * (1 - getHeuristicPercentile(grandTotal) / 100)));
      
      switch(category) {
        case "OBC-NCL": estimatedCategoryRank = Math.round(heuristicCRL * 0.27); break;
        case "GEN-EWS": estimatedCategoryRank = Math.round(heuristicCRL * 0.10); break;
        case "SC":      estimatedCategoryRank = Math.round(heuristicCRL * 0.08); break;
        case "ST":      estimatedCategoryRank = Math.round(heuristicCRL * 0.04); break;
        case "PwD":     estimatedCategoryRank = Math.round(heuristicCRL * 0.01); break;
        default:        estimatedCategoryRank = heuristicCRL; // For GEN (CRL)
      }
    }

    return {
      category,
      aggregateThreshold,
      subjectThreshold,
      qualified: failReason === null,
      failReason,
      estimatedCategoryRank,
      marksNeeded: {
        aggregate: aggGap,
        physics: phyGap,
        chemistry: chemGap,
        maths: mathGap,
      },
    };
  });
}

export interface RepeatedQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  hint: string;
}

export interface TopicQuestions {
  topic: string;
  questions: RepeatedQuestion[];
}

export const REPEATED_QUESTIONS: Record<string, Record<string, TopicQuestions[]>> = {
  "Mathematics": {
    "AP": [
      {
        topic: "SETS, RELATIONS & FUNCTIONS",
        questions: [
          {
            question: "If A = {1,2,3,4} and B = {3,4,5,6}, then A \u25a0 B (symmetric difference) is:",
            options: ["A) {1,2,5,6}", "B) {3,4}", "C) {1,2,3,4,5,6}", "D) {}"],
            answer: "A",
            explanation: "{1,2,5,6}",
            hint: "A \u25a0 B = (A\u222aB) \u2013 (A\u2229B) = {1,2,3,4,5,6} \u2013 {3,4} = {1,2,5,6}"
          },
          {
            question: "The number of subsets of a set with n elements is:",
            options: ["A) n\u00b2", "B) 2n", "C) 2\u207f", "D) n!"],
            answer: "C",
            explanation: "2\u207f",
            hint: "Every element has 2 choices (in or out). Total subsets = 2\u207f. For n=3: 2\u00b3=8 subsets."
          },
          {
            question: "If n(A)=3, n(B)=4 and n(A\u2229B)=2, then n(A\u222aB) is:",
            options: ["A) 5", "B) 7", "C) 9", "D) 3"],
            answer: "A",
            explanation: "5",
            hint: "n(A\u222aB) = n(A)+n(B)\u2013n(A\u2229B) = 3+4\u20132 = 5"
          },
          {
            question: "A relation R on set A is called an equivalence relation if it is:",
            options: ["A) Reflexive and symmetric only", "B) Symmetric and transitive only", "C) Reflexive, symmetric and transitive", "D) Anti-symmetric and transitive"],
            answer: "C",
            explanation: "Reflexive, symmetric and transitive",
            hint: "Equivalence relation must satisfy all three: reflexive, symmetric AND transitive."
          },
          {
            question: "Which of the following functions is one-one (injective)?",
            options: ["A) f(x)=x\u00b2", "B) f(x)=sinx", "C) f(x)=2x+3", "D) f(x)=|x|"],
            answer: "C",
            explanation: "f(x)=2x+3",
            hint: "f(x)=2x+3 is strictly increasing \u2192 one-one. Others fail: f(x)=f(-x) for x\u00b2 and |x|."
          }
        ]
      },
      {
        topic: "MATRICES & DETERMINANTS",
        questions: [
          {
            question: "If A is a 3\u00d73 matrix and |A| = 5, then |3A| is:",
            options: ["A) 15", "B) 45", "C) 135", "D) 375"],
            answer: "C",
            explanation: "135",
            hint: "|kA| = k\u207f|A| for an n\u00d7n matrix. |3A| = 3\u00b3\u00d75 = 27\u00d75 = 135."
          },
          {
            question: "A square matrix A is singular if:",
            options: ["A) |A| \u2260 0", "B) |A| = 0", "C) A = I", "D) A = A\u1d40"],
            answer: "B",
            explanation: "|A| = 0",
            hint: "Singular matrix: |A|=0, no inverse exists. Non-singular: |A|\u22600, inverse exists."
          }
        ]
      },
      {
        topic: "COMPLEX NUMBERS",
        questions: [
          {
            question: "The modulus of z = 3 + 4i is:",
            options: ["A) 3", "B) 4", "C) 5", "D) 7"],
            answer: "C",
            explanation: "5",
            hint: "|z| = \u221a(3\u00b2+4\u00b2) = \u221a(9+16) = \u221a25 = 5. (3,4,5 Pythagorean triple)"
          }
        ]
      },
      {
        topic: "QUADRATIC EQUATIONS",
        questions: [
          {
            question: "The discriminant of ax\u00b2+bx+c=0 for real and distinct roots must be:",
            options: ["A) \u0394 = 0", "B) \u0394 < 0", "C) \u0394 > 0", "D) \u0394 \u2265 0"],
            answer: "C",
            explanation: "\u0394 > 0",
            hint: "\u0394=b\u00b2\u20134ac. \u0394>0: 2 real distinct roots; \u0394=0: equal roots; \u0394<0: complex roots."
          }
        ]
      },
      {
        topic: "PERMUTATIONS & COMBINATIONS",
        questions: [
          {
            question: "The value of \u00b9\u2070C\u2083 is:",
            options: ["A) 120", "B) 720", "C) 30", "D) 240"],
            answer: "A",
            explanation: "120",
            hint: "\u00b9\u2070C\u2083 = 10!/(3!\u00d77!) = (10\u00d79\u00d78)/(3\u00d72\u00d71) = 720/6 = 120."
          }
        ]
      }
    ],
    "TS": [] // Copy of AP for now or placeholder
  },
  "Physics": {
    "AP": [
      {
        topic: "UNITS & MEASUREMENTS",
        questions: [
          {
            question: "The dimensional formula of angular momentum is:",
            options: ["A) [ML\u00b2T\u207b\u00b9]", "B) [MLT\u207b\u00b9]", "C) [ML\u00b2T\u207b\u00b2]", "D) [ML\u00b3T\u207b\u00b9]"],
            answer: "A",
            explanation: "[ML\u00b2T\u207b\u00b9]",
            hint: "L = mvr = [M][LT\u207b\u00b9][L] = [ML\u00b2T\u207b\u00b9]. Also L = I\u03c9 = [ML\u00b2][T\u207b\u00b9] = [ML\u00b2T\u207b\u00b9]"
          },
          {
            question: "Light year is a unit of:",
            options: ["A) Time", "B) Speed", "C) Distance", "D) Intensity"],
            answer: "C",
            explanation: "Distance",
            hint: "1 light year = distance light travels in one year \u2248 9.46 \u00d7 10\u00b9\u2075 m."
          }
        ]
      },
      {
        topic: "KINEMATICS",
        questions: [
          {
            question: "A projectile is fired at angle \u03b8 with horizontal. The horizontal range is maximum when \u03b8 equals:",
            options: ["A) 30\u00b0", "B) 45\u00b0", "C) 60\u00b0", "D) 90\u00b0"],
            answer: "B",
            explanation: "45\u00b0",
            hint: "R = u\u00b2sin2\u03b8/g. R is maximum when sin2\u03b8 = 1 \u2192 2\u03b8 = 90\u00b0 \u2192 \u03b8 = 45\u00b0"
          }
        ]
      },
      {
        topic: "LAWS OF MOTION",
        questions: [
          {
            question: "A body of mass 5 kg is acted upon by a net force of 20 N. Its acceleration is:",
            options: ["A) 2 m/s\u00b2", "B) 4 m/s\u00b2", "C) 10 m/s\u00b2", "D) 100 m/s\u00b2"],
            answer: "B",
            explanation: "4 m/s\u00b2",
            hint: "Newton's 2nd law: F = ma \u2192 a = F/m = 20/5 = 4 m/s\u00b2"
          }
        ]
      }
    ],
    "TS": []
  },
  "Chemistry": {
    "AP": [],
    "TS": []
  }
};

// Copy AP to TS where applicable as they share high-yield questions
REPEATED_QUESTIONS["Mathematics"]["TS"] = REPEATED_QUESTIONS["Mathematics"]["AP"];
REPEATED_QUESTIONS["Physics"]["TS"] = REPEATED_QUESTIONS["Physics"]["AP"];

import { describe, test, expect } from "vitest";
import { calculateScore } from "./predictions";

const testCases = [
  {
    description: "returns 0 when prediction is wrong",
    prediction: { team1Score: 2, team2Score: 1 },
    actual: { team1Score: 2, team2Score: 2 },
    expectedScore: 0,
  },
  {
    description: "returns 1 when the winner (team 1) is correctly predicted",
    prediction: { team1Score: 2, team2Score: 1 },
    actual: { team1Score: 3, team2Score: 1 },
    expectedScore: 1,
  },
  {
    description: "returns 1 when the winner (team 2) is correctly predicted",
    prediction: { team1Score: 1, team2Score: 2 },
    actual: { team1Score: 1, team2Score: 3 },
    expectedScore: 1,
  },
  {
    description: "returns 2 when goal difference is correctly predicted (case 1)",
    prediction: { team1Score: 2, team2Score: 1 },
    actual: { team1Score: 3, team2Score: 2 },
    expectedScore: 2,
  },
  {
    description: "returns 2 when goal difference is correctly predicted (case 2)",
    prediction: { team1Score: 1, team2Score: 2 },
    actual: { team1Score: 2, team2Score: 3 },
    expectedScore: 2,
  },
  {
    description: "returns 3 when the exact score is correctly predicted",
    prediction: { team1Score: 2, team2Score: 1 },
    actual: { team1Score: 2, team2Score: 1 },
    expectedScore: 3,
  },
  {
    description: "returns 3 when a draw is correctly predicted",
    prediction: { team1Score: 1, team2Score: 1 },
    actual: { team1Score: 1, team2Score: 1 },
    expectedScore: 3,
  },
];

describe("calculateScore", () => {
  test.each(testCases)("$description", ({ prediction, actual, expectedScore }) => {
    expect(calculateScore(prediction, actual)).toBe(expectedScore);
  });
});

import { describe, test, expect } from "vitest";
import { processScores } from "./standings";

describe("processScores", () => {
  test("should sort scores in descending order and assign ranks correctly", () => {
    const scores = [
      { userId: "1", userName: "Alice", points: 50, group: 1 },
      { userId: "2", userName: "Bob", points: 70, group: 1 },
      { userId: "3", userName: "Charlie", points: 40, group: 2 },
      { userId: "4", userName: "David", points: 70, group: 2 },
    ];

    const result = processScores(scores);

    expect(result).toEqual([
      { userId: "2", userName: "Bob", points: 70, group: 1, rank: 1 },
      { userId: "4", userName: "David", points: 70, group: 2, rank: 1 },
      { userId: "1", userName: "Alice", points: 50, group: 1, rank: 3 },
      { userId: "3", userName: "Charlie", points: 40, group: 2, rank: 4 },
    ]);
  });

  test("should assign the same rank to users with the same points", () => {
    const scores = [
      { userId: "1", userName: "Alice", points: 50, group: 1 },
      { userId: "2", userName: "Bob", points: 50, group: 1 },
      { userId: "3", userName: "Charlie", points: 40, group: 2 },
      { userId: "4", userName: "David", points: 70, group: 2 },
    ];

    const result = processScores(scores);

    expect(result).toEqual([
      { userId: "4", userName: "David", points: 70, group: 2, rank: 1 },
      { userId: "1", userName: "Alice", points: 50, group: 1, rank: 2 },
      { userId: "2", userName: "Bob", points: 50, group: 1, rank: 2 },
      { userId: "3", userName: "Charlie", points: 40, group: 2, rank: 4 },
    ]);
  });

  test("should handle empty scores array", () => {
    const scores: {
      userId: string;
      userName: string;
      points: number;
      group: number;
    }[] = [];

    const result = processScores(scores);

    expect(result).toEqual([]);
  });

  test("should handle scores with only one entry", () => {
    const scores = [{ userId: "1", userName: "Alice", points: 50, group: 1 }];

    const result = processScores(scores);

    expect(result).toEqual([
      { userId: "1", userName: "Alice", points: 50, group: 1, rank: 1 },
    ]);
  });

  test("should correctly rank when all points are different", () => {
    const scores = [
      { userId: "1", userName: "Alice", points: 30, group: 1 },
      { userId: "2", userName: "Bob", points: 40, group: 1 },
      { userId: "3", userName: "Charlie", points: 20, group: 2 },
      { userId: "4", userName: "David", points: 10, group: 2 },
    ];

    const result = processScores(scores);

    expect(result).toEqual([
      { userId: "2", userName: "Bob", points: 40, group: 1, rank: 1 },
      { userId: "1", userName: "Alice", points: 30, group: 1, rank: 2 },
      { userId: "3", userName: "Charlie", points: 20, group: 2, rank: 3 },
      { userId: "4", userName: "David", points: 10, group: 2, rank: 4 },
    ]);
  });
});

export function processScores(
  scores: {
    userId: string;
    userName: string;
    points: number;
    group: number;
    rank?: number;
  }[]
) {
  const p = scores.toSorted((a, b) => b.points - a.points);

  let currentRank = 1;
  p.forEach((score, index) => {
    if (index > 0 && p[index].points === p[index - 1].points) {
      score.rank = p[index - 1].rank;
    } else {
      score.rank = currentRank;
    }
    currentRank++;
  });

  return p;
}

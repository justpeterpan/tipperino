export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { group } = getQuery(event);
  const scores = await useDB()
    .select({
      userId: tables.users.id,
      userName: tables.users.name,
      points: tables.scores.points,
      group: tables.scores.group,
      predictions: tables.predictions,
    })
    .from(tables.scores)
    .innerJoin(tables.users, eq(tables.users.id, tables.scores.user))
    .innerJoin(
      tables.predictions,
      eq(tables.predictions.group, tables.scores.group)
    )
    .where(
      and(
        eq(tables.scores.group, Number(group)),
        eq(tables.predictions.finished, 1)
      )
    );

  const userScore = scores.filter((s) => s.userId === user.id);
  const [uniqueUserScore] = Array.from(
    new Map(userScore.map((score) => [score.userId, score.points])).values()
  );
  const uniqueScores = Array.from(
    new Map(scores.map((score) => [score.userId, score])).values()
  );
  const processedScores = processScores(uniqueScores);
  const processedPredictions = scores.map((s) => ({
    ...s.predictions,
  }));

  const uniquePredictions = Array.from(
    new Map(processedPredictions.map((p) => [p.id, { ...p }])).values()
  );

  return {
    user: uniqueUserScore,
    scores: processedScores,
    predictions: uniquePredictions,
  };
});

function processScores(
  scores: {
    userId: string;
    userName: string;
    points: number;
    group: number;
    rank?: number;
  }[]
) {
  const p = scores.toSorted((a, b) => b.points - a.points);

  p.forEach((score, index) => {
    score.rank = index + 1;
  });

  return p;
}

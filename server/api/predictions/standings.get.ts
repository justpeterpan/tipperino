import type { Match } from "~/types";
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { group } = getQuery(event);
  const scores = await useDB()
    .select({
      userId: tables.users.id,
      userName: tables.users.name,
      show: tables.users.show,
      points: tables.scores.points,
      group: tables.scores.group,
      predictions: tables.predictions,
      match: tables.matches,
    })
    .from(tables.scores)
    .innerJoin(tables.users, eq(tables.users.id, tables.scores.user))
    .innerJoin(
      tables.predictions,
      eq(tables.predictions.group, tables.scores.group)
    )
    .innerJoin(tables.matches, eq(tables.matches.id, tables.predictions.match))
    .where(
      and(
        eq(tables.scores.group, Number(group)),
        eq(tables.predictions.match, tables.matches.id)
      )
    );

  const matches = await $fetch<Match[]>("/api/matches");
  const userScore = scores.filter((s) => s.userId === user.id);
  const showScore = userScore[0]?.show ?? 0;
  const [uniqueUserScore] = Array.from(
    new Map(userScore.map((score) => [score.userId, score.points])).values()
  );
  const uniqueScores = Array.from(
    new Map(scores.map((score) => [score.userId, score])).values()
  );
  const processedScores = processScores(uniqueScores);
  const processedPredictions = scores.map((s) => ({
    ...s.predictions,
    date: new Date(
      matches.find((m) => m.matchID === s.predictions.match)
        ?.matchDateTimeUTC ?? 0
    ).getTime(),
  }));

  const uniquePredictions = Array.from(
    new Map(processedPredictions.map((p) => [p.id, { ...p }])).values()
  ).sort((a, b) => a.date - b.date);

  return {
    user: uniqueUserScore,
    scores: processedScores,
    predictions: showScore
      ? uniquePredictions.filter((p) => p.date < Date.now())
      : uniquePredictions.filter((p) => p.finished === 1),
  };
});

import { ResultType, type Match } from "~/types";

export default eventHandler(async () => {
  const matches = await $fetch<Match[]>(
    `${useRuntimeConfig().public.api}/getmatchdata/em2024/2024`
  );

  const userCount = await useDB()
    .select({ count: sql`COUNT(*)` })
    .from(tables.members)
    .all();

  const scores = await useDB().select().from(tables.scores).all();

  const finishedMatches = await useDB()
    .select()
    .from(tables.matches)
    .where(eq(tables.matches.finished, 1))
    .all();

  const predictions = await useDB()
    .select()
    .from(tables.predictions)
    .where(and(eq(tables.predictions.finished, 1)));

  let correctPredictions = 0;

  finishedMatches.forEach((m) => {
    const prediction = predictions.filter((p) => {
      const actualMatch = matches.find((match) => match.matchID === m.id);
      const matchResult = actualMatch?.matchResults.find(
        (r) => r.resultTypeID === ResultType.Finished
      );
      return (
        p.match === m.id &&
        p.team1Score === matchResult?.pointsTeam1 &&
        p.team2Score === matchResult?.pointsTeam2
      );
    });
    if (prediction.length) {
      correctPredictions++;
    }
  });

  const sortedScores = Array.from(
    new Set(scores.map((s) => s.points).sort((a, b) => b - a))
  );

  return {
    correctPredictions,
    count: userCount[0].count,
    scores: sortedScores,
    forgotten: 4,
  };
});
